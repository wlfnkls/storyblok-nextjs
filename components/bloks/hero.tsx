import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { Hero } from '@/types/storyblok-component-types';
import { storyblokEditable } from '@storyblok/react/rsc';
import CoverImage from '@/components/ui/cover-image';

export default function Hero({ blok }: StoryblokComponentProps<Hero>) {
  const image = blok.background_image?.filename ? blok.background_image : null;

  return (
    <section
      className='flex flex-col gap-12 py-16 md:gap-16 md:py-24'
      {...storyblokEditable(blok)}
    >
      {(blok.headline || blok.subheadline) && (
        <div className='mx-auto w-full max-w-5xl px-4 transition-[opacity,translate] duration-500 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none sm:px-6 lg:px-8'>
          {blok.headline && (
            <h1 className='max-w-[20ch] text-4xl leading-[1.05] font-semibold tracking-tight wrap-break-word hyphens-auto text-balance sm:text-5xl lg:text-6xl'>
              {blok.headline}
            </h1>
          )}
          {blok.subheadline && (
            <p className='mt-6 max-w-[56ch] text-lg/relaxed wrap-break-word text-pretty text-foreground/70'>
              {blok.subheadline}
            </p>
          )}
        </div>
      )}

      {image && (
        <CoverImage image={image} isFullWidth={blok.layout === 'full-width'} />
      )}
    </section>
  );
}
