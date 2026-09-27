import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { TextImage } from '@/types/storyblok-component-types';
import { storyblokEditable } from '@storyblok/react/rsc';
import { hasRichText } from '@/lib/storyblok/rich-text';
import TextImageContent from '@/components/bloks/text-image/text-image-content';
import TextImageFigure from '@/components/bloks/text-image/text-image-figure';

export default function TextImage({ blok }: StoryblokComponentProps<TextImage>) {
  const text = hasRichText(blok.text) ? blok.text : null;
  const image = blok.image?.filename ? blok.image : null;
  if (!blok.headline && !blok.subheadline && !text && !image) return null;

  const headingId = `text-image-${blok._uid}`;

  return (
    <section
      aria-labelledby={blok.headline ? headingId : undefined}
      // Two columns only with an image, so text alone fills the container
      className={`mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:px-6 md:gap-12 md:py-16 lg:px-8 ${image ? 'md:grid-cols-2 md:items-center' : ''}`}
      {...storyblokEditable(blok)}
    >
      <TextImageContent
        headline={blok.headline}
        headingId={headingId}
        subheadline={blok.subheadline}
        text={text}
      />
      {image && <TextImageFigure image={image} />}
    </section>
  );
}
