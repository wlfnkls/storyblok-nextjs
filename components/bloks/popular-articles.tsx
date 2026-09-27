import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type {
  Article,
  PopularArticles,
} from '@/types/storyblok-component-types';
import type { ISbStoryData } from '@storyblok/js';
import { storyblokEditable } from '@storyblok/react/rsc';
import { slugToPath } from '@/lib/storyblok/link';
import CardGrid from '@/components/ui/card-grid';
import TeaserCard from './teaser/teaser-card';

// Unresolved relations arrive as plain UUID strings (e.g. unpublished articles); skip them
const isResolved = (
  article: ISbStoryData<Article> | string,
): article is ISbStoryData<Article> => typeof article !== 'string';

export default function PopularArticles({
  blok,
}: StoryblokComponentProps<PopularArticles>) {
  const articles = (blok.articles ?? []).filter(isResolved);
  if (!articles.length) return null;

  const headingId = `popular-articles-${blok._uid}`;

  return (
    <section
      aria-labelledby={blok.headline ? headingId : undefined}
      className='mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'
      {...storyblokEditable(blok)}
    >
      {blok.headline && (
        <h2
          id={headingId}
          className='mb-8 text-2xl font-semibold tracking-tight text-balance sm:text-3xl'
        >
          {blok.headline}
        </h2>
      )}
      <CardGrid
        items={articles.map((article) => ({
          key: article.uuid,
          node: (
            <TeaserCard
              headline={article.content.title || article.name}
              description={article.content.teaser}
              image={
                article.content.image?.filename ? article.content.image : null
              }
              link={{ href: slugToPath(article.full_slug), external: false }}
              headingLevel={blok.headline ? 'h3' : 'h2'}
              highlighted
            />
          ),
        }))}
      />
    </section>
  );
}
