import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { Teaser } from '@/types/storyblok-component-types';
import { hasLink, resolveLink } from '@/lib/storyblok/link';
import { storyblokEditable } from '@storyblok/react/rsc';
import TeaserCard from './teaser/teaser-card';
import type { HeadingLevel } from './teaser/teaser-content';

export default function Teaser({
  blok,
  headingLevel,
}: StoryblokComponentProps<Teaser> & {
  // Passed by a parent with its own heading, e.g. the grid
  headingLevel?: HeadingLevel;
}) {
  const image = blok.image?.filename ? blok.image : null;
  if (!blok.headline && !blok.description && !image) return null;

  return (
    <TeaserCard
      headline={blok.headline}
      description={blok.description}
      image={image}
      link={hasLink(blok.link) ? resolveLink(blok.link) : undefined}
      headingLevel={headingLevel}
      editable={storyblokEditable(blok)}
    />
  );
}
