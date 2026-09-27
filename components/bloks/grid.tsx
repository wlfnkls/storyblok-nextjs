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

  return (
    <section
      className='mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 md:py-16 lg:px-8'
      {...storyblokEditable(blok)}
    >
      <CardGrid
        items={columns.map((column) => ({
          key: column._uid,
          node: <StoryblokServerComponent blok={column} />,
        }))}
      />
    </section>
  );
}
