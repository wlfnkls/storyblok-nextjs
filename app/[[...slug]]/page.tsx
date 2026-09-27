import { draftMode } from 'next/headers';
import type { Metadata } from 'next';
import { fetchStory, RESOLVE_RELATIONS } from '@/lib/storyblok/api';
import { isDraftRequest } from '@/lib/storyblok/draft';
import { StoryblokServerComponent, StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { publicClient } from '@/lib/storyblok/storyblok-api-client';
import { MAIN_CONTENT_ID } from '@/components/header/skip-link';

const SETTINGS_FOLDER = 'settings';

function isSettingsSlug(slug: string) {
  const normalized = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  return (
    normalized === SETTINGS_FOLDER ||
    normalized.startsWith(`${SETTINGS_FOLDER}/`)
  );
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  let page = 1;
  let total = Infinity;

  while ((page - 1) * 1000 < total) {
    const { data, error, response } = await publicClient.links.list({
      query: { version: 'published', per_page: 1000, page, paginated: '1' },
    });
    if (error) throw error;
    total = Number(response.headers.get('total') ?? 0);

    for (const link of Object.values(data?.links ?? {})) {
      if (link.is_folder || isSettingsSlug(link.slug)) continue;
      // Folder start pages have slugs like "blog/" and should map to /blog
      const slug = link.slug.replace(/\/$/, '');
      params.push({ slug: slug === 'home' ? [] : slug.split('/') });
    }
    page++;
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<'/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await params;
  const path = slug?.length ? slug.join('/') : 'home';

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

export default async function Page({ params }: PageProps<'/[[...slug]]'>) {
  const { slug } = await params;
  const path = slug?.length ? slug.join('/') : 'home';

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
