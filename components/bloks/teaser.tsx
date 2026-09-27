import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { Teaser } from '@/types/storyblok-component-types';
import { hasLink, resolveLink } from '@/lib/storyblok/link';
import { storyblokEditable } from '@storyblok/react/rsc';
import TeaserCard from './teaser/teaser-card';

export default function Teaser({ blok }: StoryblokComponentProps<Teaser>) {
  const image = blok.image?.filename ? blok.image : null;
  if (!blok.headline && !blok.description && !image) return null;

  return (
    <TeaserCard
      headline={blok.headline}
      description={blok.description}
      image={image}
      link={hasLink(blok.link) ? resolveLink(blok.link) : undefined}
      editable={storyblokEditable(blok)}
    />
  );
}
