import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { Grid } from '@/types/storyblok-component-types';
import {
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';
import CardGrid from '@/components/ui/card-grid';

export default function Grid({ blok }: StoryblokComponentProps<Grid>) {
  const columns = blok.columns ?? [];
  if (!columns.length) return null;

  const headingId = `grid-${blok._uid}`;

  return (
    <section
      aria-labelledby={blok.headline ? headingId : undefined}
      className='mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'
      {...storyblokEditable(blok)}
    >
      {blok.headline && (
        <h2
          id={headingId}
          className='mb-8 text-2xl font-semibold tracking-tight wrap-break-word hyphens-auto text-balance sm:text-3xl'
        >
          {blok.headline}
        </h2>
      )}
      <CardGrid
        items={columns.map((column) => ({
          key: column._uid,
          // Cards drop to h3 below the grid's headline (see Teaser)
          node: (
            <StoryblokServerComponent
              blok={column}
              headingLevel={blok.headline ? 'h3' : 'h2'}
            />
          ),
        }))}
      />
    </section>
  );
}
