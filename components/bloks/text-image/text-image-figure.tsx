import Image from 'next/image';
import { focusToObjectPosition } from '@/lib/storyblok/image';
import type { StoryblokAsset } from '@/types/storyblok/storyblok';

export default function TextImageFigure({ image }: { image: StoryblokAsset }) {
  const credit = image.copyright || image.title;

  return (
    <figure>
      <div className='relative aspect-4/3 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5'>
        <Image
          src={image.filename!}
          alt={image.alt ?? ''}
          fill
          sizes='(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw'
          className='object-cover'
          style={{ objectPosition: focusToObjectPosition(image) }}
        />
      </div>
      {credit && (
        <figcaption className='mt-3 font-code text-xs text-foreground/60'>
          {credit}
        </figcaption>
      )}
    </figure>
  );
}
