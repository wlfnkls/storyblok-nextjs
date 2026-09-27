/**
 * Pulls the component schemas from Storyblok, generates the TypeScript types
 * and moves them from .storyblok/ into types/, where the app imports them from.
 *
 * The final step of `pnpm sb:schema:pull` and `pnpm sb:schema:push`, never run
 * on its own. It pulls instead of reading storyblok/ because `types generate`
 * only reads the pulled JSON, and that JSON is also the snapshot the drift
 * check compares the space with (check-storyblok-schema-drift.mts). Run alone,
 * it would move the snapshot without updating storyblok/ and hide UI changes.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fail, requireLogin, run, step } from './lib/cli.mts';

// CLI output: `path` and `modules.types.generate.filename` in storyblok.config.ts
const GENERATED_DIR = '.storyblok/types';
const GENERATED_BASE_TYPES = join(GENERATED_DIR, 'storyblok.d.ts');
const GENERATED_COMPONENT_TYPES_FILE = 'storyblok-component-types.d.ts';

const BASE_TYPES = 'types/storyblok/storyblok.d.ts';
const COMPONENT_TYPES = 'types/storyblok-component-types.d.ts';

// The generated component types import the base types relative to .storyblok/types/<space>/
const GENERATED_IMPORT = "from '../storyblok.d.ts'";
const IMPORT = "from './storyblok/storyblok'";

// Checks the two .d.ts files with lib checking on (tsconfig.json skips .d.ts files)
const TYPES_TSCONFIG = 'tsconfig.storyblok-types.json';

function findComponentTypes() {
  const spaces = readdirSync(GENERATED_DIR, { withFileTypes: true }).filter(
    (entry) =>
      entry.isDirectory() &&
      existsSync(join(GENERATED_DIR, entry.name, GENERATED_COMPONENT_TYPES_FILE)),
  );
  if (spaces.length !== 1) {
    fail(
      `Expected ${GENERATED_COMPONENT_TYPES_FILE} in exactly one space folder of ${GENERATED_DIR}, found ${spaces.length}.`,
    );
  }
  return join(GENERATED_DIR, spaces[0].name, GENERATED_COMPONENT_TYPES_FILE);
}

function moveTypes() {
  if (!existsSync(GENERATED_BASE_TYPES)) {
    fail(`${GENERATED_BASE_TYPES} was not generated.`);
  }
  const componentTypes = readFileSync(findComponentTypes(), 'utf8');

  // Exactly one match, so a changed CLI output fails here instead of leaving a broken import
  const importCount = componentTypes.split(GENERATED_IMPORT).length - 1;
  if (importCount !== 1) {
    fail(
      `Expected the import "${GENERATED_IMPORT}" once in the generated component types, found it ${importCount} times. Did the Storyblok CLI output change?`,
    );
  }

  mkdirSync(dirname(BASE_TYPES), { recursive: true });
  writeFileSync(BASE_TYPES, readFileSync(GENERATED_BASE_TYPES, 'utf8'));
  writeFileSync(
    COMPONENT_TYPES,
    componentTypes.replace(GENERATED_IMPORT, IMPORT),
  );

  // Moved, not copied: tsconfig.json includes **/*.ts, so leftovers would be compiled too
  rmSync(GENERATED_DIR, { recursive: true });
}

requireLogin();

step('Pulling components');
if (!run('pnpm', ['exec', 'storyblok', 'components', 'pull'])) {
  fail('Pulling the components failed.');
}

step('Generating types');
if (!run('pnpm', ['exec', 'storyblok', 'types', 'generate'])) {
  fail('Generating the types failed.');
}

step(`Moving types to ${BASE_TYPES} and ${COMPONENT_TYPES}`);
moveTypes();

step('Verifying the generated types and their imports');
if (!run('pnpm', ['exec', 'tsc', '--noEmit', '-p', TYPES_TSCONFIG])) {
  fail(`The generated types don't compile (see ${TYPES_TSCONFIG}). The new files were kept.`);
}

step('Verifying that the app compiles against the new types');
if (!run('pnpm', ['exec', 'tsc', '--noEmit'])) {
  fail('The app no longer compiles against the new types. Update the components (see git diff types/). The new files were kept.');
}

console.log(`\n✔ Storyblok types are up to date:\n  ${BASE_TYPES}\n  ${COMPONENT_TYPES}`);
