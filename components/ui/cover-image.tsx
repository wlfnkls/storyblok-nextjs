import Image from 'next/image';
import { focusToObjectPosition } from '@/lib/storyblok/image';
import type { StoryblokAsset } from '@/types/storyblok/storyblok';

const container = 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8';

export default function CoverImage({
  image,
  isFullWidth,
}: {
  image: StoryblokAsset;
  isFullWidth: boolean;
}) {
  const credit = image.copyright || image.title;

  return (
    <figure className={isFullWidth ? '' : container}>
      <div
        className={`relative overflow-hidden bg-foreground/5 ${
          isFullWidth
            ? 'aspect-video lg:aspect-21/9'
            : 'aspect-video rounded-2xl border border-foreground/10'
        }`}
      >
        <Image
          src={image.filename!}
          alt={image.alt ?? ''}
          fill
          sizes={isFullWidth ? '100vw' : '(min-width: 1024px) 960px, 100vw'}
          preload
          className='object-cover'
          style={{ objectPosition: focusToObjectPosition(image) }}
        />
      </div>
      {credit && (
        <figcaption
          className={`mt-3 font-code text-xs text-foreground/60 ${
            isFullWidth ? container : ''
          }`}
        >
          {credit}
        </figcaption>
      )}
    </figure>
  );
}
