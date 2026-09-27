import 'server-only';
import { cache } from 'react';
import { draftMode } from 'next/headers';
import { publicClient, previewClient } from './storyblok-api-client';

export const RESOLVE_RELATIONS = ['popular-articles.articles'];

export const fetchStory = cache(async (slug: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const isDraft =
    process.env.NODE_ENV === 'development' || (await draftMode()).isEnabled;
  const client = isDraft ? previewClient : publicClient;

  const { data, error } = await client.stories.get(slug, {
    query: {
      version: isDraft ? 'draft' : 'published',
      resolve_relations: RESOLVE_RELATIONS.join(','),
    },
    fetchOptions: isDraft
      ? { cache: 'no-store' }
      : { next: { tags: ['storyblok', `story:${slug}`], revalidate: 86400 } }, // 86400sec -> 1day
  });

  if (error) {
    if (error.response?.status === 404) return null;
    throw new Error(`Storyblok: failed to load "${slug}" (${error.message})`, {
      cause: error,
    });
  }

  return data?.story ?? null;
});
