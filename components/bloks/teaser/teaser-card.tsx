import type { storyblokEditable } from '@storyblok/react/rsc';
import type { resolveLink } from '@/lib/storyblok/link';
import type { StoryblokAsset } from '@/types/storyblok/storyblok';
import TeaserContent, { type HeadingLevel } from './teaser-content';
import TeaserImage from './teaser-image';

const TONES = {
  default: {
    card: 'border-foreground/10 bg-surface',
    link: 'transition-[border-color] hover:border-foreground/30',
  },
  // Inverted: the card fills with foreground, and its children see the page
  // background as their foreground, so all text, borders and cues flip with it
  highlighted: {
    card: 'border-foreground bg-foreground text-background *:[--foreground:var(--background)]',
    link: 'transition-[background-color] hover:bg-foreground/90 has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background',
  },
};

export type TeaserCardProps = {
  headline?: string;
  description?: string;
  image?: StoryblokAsset | null;
  link?: ReturnType<typeof resolveLink>;
  headingLevel?: HeadingLevel;
  highlighted?: boolean;
  editable?: ReturnType<typeof storyblokEditable>;
};

export default function TeaserCard({
  headline,
  description,
  image,
  link,
  headingLevel,
  highlighted = false,
  editable,
}: TeaserCardProps) {
  const tone = TONES[highlighted ? 'highlighted' : 'default'];

  return (
    <article
      className={`relative flex w-full flex-col overflow-hidden rounded-2xl border ${tone.card} ${
        link
          ? `group/teaser duration-200 ease-out ${tone.link} has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-foreground motion-reduce:transition-none`
          : ''
      }`}
      {...editable}
    >
      {image && <TeaserImage image={image} />}
      <TeaserContent
        headline={headline}
        description={description}
        link={link}
        headingLevel={headingLevel}
      />
    </article>
  );
}
