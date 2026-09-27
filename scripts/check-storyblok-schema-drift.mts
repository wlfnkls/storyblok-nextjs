/**
 * Fails when the Storyblok space changed since the last sync, i.e. someone
 * created, edited or deleted a blok in the Storyblok UI that isn't in storyblok/
 * yet. Pushing then would revert those changes.
 *
 * The committed component JSON in .storyblok/components/ is the snapshot of the
 * space at the last `sb:schema:pull` or `sb:schema:push` (both end with the type
 * sync in sync-storyblok-types.mts, which pulls it).
 *
 * Runs before `pnpm sb:schema:push` and `pnpm sb:schema:diff`.
 */
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fail, requireLogin, run, step } from './lib/cli.mts';

const SNAPSHOT_DIR = '.storyblok/components';

type Component = { name: string; updated_at: string };
type Group = { uuid: string; name: string; parent_uuid: string | null };

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/** The space folder the CLI pulled into (named after the space id). */
function findSpace(componentsDir: string) {
  const spaces = readdirSync(componentsDir, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  );
  if (spaces.length !== 1) {
    fail(`Expected exactly one space folder in ${componentsDir}, found ${spaces.length}.`);
  }
  return spaces[0].name;
}

function changedComponents(snapshot: Component[], remote: Component[]) {
  const before = new Map(snapshot.map((c) => [c.name, c.updated_at]));
  const after = new Map(remote.map((c) => [c.name, c.updated_at]));

  return [
    ...remote.filter((c) => !before.has(c.name)).map((c) => `${c.name} (new)`),
    ...snapshot.filter((c) => !after.has(c.name)).map((c) => `${c.name} (deleted)`),
    ...remote
      .filter((c) => before.has(c.name) && before.get(c.name) !== c.updated_at)
      .map((c) => `${c.name} (changed)`),
  ];
}

function groupsKey(groups: Group[]) {
  return JSON.stringify(
    groups.map(({ uuid, name, parent_uuid }) => [uuid, name, parent_uuid]).sort(),
  );
}

requireLogin();

const tempDir = mkdtempSync(join(tmpdir(), 'storyblok-drift-'));
// On exit rather than in `finally`: fail() exits the process, which skips `finally`
process.on('exit', () => rmSync(tempDir, { recursive: true, force: true }));

step('Pulling the current components from Storyblok');
if (!run('pnpm', ['exec', 'storyblok', '--path', tempDir, 'components', 'pull'])) {
  fail('Pulling the components failed.');
}

const remoteDir = join(tempDir, 'components', findSpace(join(tempDir, 'components')));
const snapshotDir = join(SNAPSHOT_DIR, findSpace(SNAPSHOT_DIR));
if (!existsSync(join(snapshotDir, 'components.json'))) {
  fail(`No snapshot in ${snapshotDir}. Run \`pnpm sb:schema:pull\` first.`);
}

step('Comparing with the last sync');
const changes = changedComponents(
  readJson<Component[]>(join(snapshotDir, 'components.json')),
  readJson<Component[]>(join(remoteDir, 'components.json')),
);
if (
  groupsKey(readJson<Group[]>(join(snapshotDir, 'groups.json'))) !==
  groupsKey(readJson<Group[]>(join(remoteDir, 'groups.json')))
) {
  changes.push('component groups (changed)');
}

if (changes.length > 0) {
  fail(
    `The space changed in Storyblok since the last sync:\n  ${changes.join('\n  ')}\n\nRun \`pnpm sb:schema:pull\`, review and commit the changes, then push again.`,
  );
}

console.log('\n✔ No changes in Storyblok since the last sync.');
