import { StoryblokServerComponent, StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { fetchStory, RESOLVE_RELATIONS } from '@/lib/storyblok/api';
import { isDraftRequest } from '@/lib/storyblok/draft';
import { isSettingsSlug } from '@/lib/storyblok/settings';
import { MAIN_CONTENT_ID } from '@/components/header/skip-link';

export default async function StoryPage({ path }: { path: string }) {
  // Checked before fetching so settings stories are never requested for a page
  if (isSettingsSlug(path)) notFound();

  const story = await fetchStory(path);

  // full_slug is authoritative, in case the requested path differs in form
  if (!story || isSettingsSlug(story.full_slug)) notFound();

  const isDraft = await isDraftRequest();

  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className='scroll-mt-24 outline-none'
    >
      {isDraft ? (
        <StoryblokStory
          story={story}
          bridgeOptions={{ resolveRelations: RESOLVE_RELATIONS }}
          fullSlug={story.full_slug}
        />
      ) : (
        <StoryblokServerComponent
          blok={story.content}
          fullSlug={story.full_slug}
        />
      )}
    </main>
  );
}
