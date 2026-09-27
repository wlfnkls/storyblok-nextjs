import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { Text } from '@/types/storyblok-component-types';
import { storyblokEditable } from '@storyblok/react/rsc';
import { hasRichText } from '@/lib/storyblok/rich-text';
import RichText from '@/components/ui/rich-text';

export default function Text({ blok }: StoryblokComponentProps<Text>) {
  const text = hasRichText(blok.text) ? blok.text : null;
  if (!blok.headline && !text) return null;

  const headingId = `text-${blok._uid}`;

  return (
    <section
      aria-labelledby={blok.headline ? headingId : undefined}
      className='mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'
      {...storyblokEditable(blok)}
    >
      {blok.headline && (
        <h2
          id={headingId}
          className='mb-6 text-2xl font-semibold tracking-tight wrap-break-word hyphens-auto text-balance sm:text-3xl'
        >
          {blok.headline}
        </h2>
      )}
      {text && (
        <RichText document={text} minHeadingLevel={blok.headline ? 3 : 2} />
      )}
    </section>
  );
}
