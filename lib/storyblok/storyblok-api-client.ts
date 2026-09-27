import 'server-only';
import { createApiClient } from '@storyblok/api-client';

type StoryblokEnvs = 'STORYBLOK_PUBLIC_TOKEN' | 'STORYBLOK_PREVIEW_TOKEN';

function requireEnv(name: StoryblokEnvs): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

const shared = {
  region: 'eu',
  inlineRelations: true,
  cache: { strategy: 'network-first', cv: 'manual' }, // Next.js owns caching, not the client
} as const;

export const publicClient = createApiClient({
  ...shared,
  accessToken: requireEnv('STORYBLOK_PUBLIC_TOKEN'),
});

export const previewClient = createApiClient({
  ...shared,
  accessToken: requireEnv('STORYBLOK_PREVIEW_TOKEN'),
});
