/**
 * Regenerates the code-defined schema in storyblok/ from the Storyblok space,
 * so bloks created or changed in the Storyblok UI end up in code.
 *
 * Run with `pnpm sb:schema:pull` (which then runs sync-storyblok-types.mts for the types).
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fail, requireLogin, run, step } from './lib/cli.mts';

const SCHEMA_DIR = 'storyblok';

function hasUncommittedChanges() {
  const status = spawnSync('git', ['status', '--porcelain', '--', SCHEMA_DIR], {
    encoding: 'utf8',
  });
  if (status.status !== 0) fail('Could not read the git status.');
  return status.stdout.trim().length > 0;
}

requireLogin();

step(`Checking ${SCHEMA_DIR}/ for uncommitted changes`);
if (hasUncommittedChanges()) {
  fail(
    `${SCHEMA_DIR}/ has uncommitted changes, which the pull would overwrite. Push or commit them first (or discard them), then pull again.`,
  );
}

// `schema init` only writes into an empty directory, so it bootstraps into a temp one
const tempDir = mkdtempSync(join(tmpdir(), 'storyblok-schema-'));
const generatedDir = join(tempDir, SCHEMA_DIR);
// On exit rather than in `finally`: fail() exits the process, which skips `finally`
process.on('exit', () => rmSync(tempDir, { recursive: true, force: true }));

step('Pulling the schema from Storyblok');
if (!run('pnpm', ['exec', 'storyblok', 'schema', 'init', '--out-dir', generatedDir])) {
  fail('Pulling the schema failed.');
}
// Only replace storyblok/ once there's something to replace it with
if (!existsSync(join(generatedDir, 'schema.ts'))) {
  fail(`The pull didn't generate ${SCHEMA_DIR}/schema.ts. ${SCHEMA_DIR}/ was left unchanged.`);
}

step(`Replacing ${SCHEMA_DIR}/`);
rmSync(SCHEMA_DIR, { recursive: true, force: true });
cpSync(generatedDir, SCHEMA_DIR, { recursive: true });

console.log(`\n✔ ${SCHEMA_DIR}/ matches the space. Review the changes with \`git diff ${SCHEMA_DIR}/\`.`);
