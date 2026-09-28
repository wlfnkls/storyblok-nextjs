import 'server-only';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { fetchStory } from './api';
import { isSettingsSlug } from './settings';

export async function storyMetadata(path: string): Promise<Metadata> {
  if (isSettingsSlug(path)) return {};

  const story = await fetchStory(path);

  if (!story) return {};

  const { isEnabled } = await draftMode();
  return {
    title: story.name, // or a dedicated SEO field on your content type
    // description: story.content.seo_description,
    robots: isEnabled ? { index: false } : undefined,
  };
}
