/**
 * Console and process helpers shared by the Storyblok scripts in scripts/.
 */
import { spawnSync } from 'node:child_process';

export function fail(message: string): never {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

export function step(message: string) {
  console.log(`\n→ ${message}`);
}

/** Runs a command with inherited output and returns whether it succeeded. */
export function run(command: string, args: string[]) {
  return spawnSync(command, args, { stdio: 'inherit' }).status === 0;
}

/** Stops early when the Storyblok CLI isn't logged in, before any command talks to the API. */
export function requireLogin() {
  step('Checking Storyblok login');
  if (!run('pnpm', ['--silent', 'sb:user'])) {
    fail('Not logged in to Storyblok (or the API is unreachable). Run `pnpm sb:login` and try again.');
  }
}
