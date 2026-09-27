import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import { storyblokEditable } from '@storyblok/react/rsc';
import type { Article } from '@/types/storyblok-component-types';
import { readingMinutes } from '@/lib/storyblok/reading-time';
import { parentPath } from '@/lib/storyblok/link';
import { hasRichText } from '@/lib/storyblok/rich-text';
import CoverImage from '@/components/ui/cover-image';
import RichText from '@/components/ui/rich-text';
import ArticleHeader from './article/article-header';
import ArticleFooter from './article/article-footer';

// fullSlug is passed down by the page route, since a blok only knows its own content
export default function Article({
  blok,
  fullSlug,
}: StoryblokComponentProps<Article> & { fullSlug?: string }) {
  // Articles at the top level have no overview to go back to
  const overviewPath = fullSlug ? parentPath(fullSlug) : '/';
  const overviewHref = overviewPath === '/' ? undefined : overviewPath;
  const image = blok.image?.filename ? blok.image : null;
  const content = hasRichText(blok.content) ? blok.content : null;

  return (
    <article
      className='flex flex-col gap-12 py-16 md:gap-16 md:py-24'
      {...storyblokEditable(blok)}
    >
      <ArticleHeader
        title={blok.title}
        teaser={blok.teaser}
        readingMinutes={content ? readingMinutes(content) : undefined}
        overviewHref={overviewHref}
      />
      {image && <CoverImage image={image} isFullWidth={false} />}
      {content && (
        <RichText
          document={content}
          minHeadingLevel={2}
          className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8'
        />
      )}
      {overviewHref && <ArticleFooter overviewHref={overviewHref} />}
    </article>
  );
}
