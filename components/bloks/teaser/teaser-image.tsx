import Image from 'next/image';
import { focusToObjectPosition } from '@/lib/storyblok/image';
import type { StoryblokAsset } from '@/types/storyblok/storyblok';

export default function TeaserImage({ image }: { image: StoryblokAsset }) {
  return (
    <div className='relative aspect-4/3 border-b border-foreground/10 bg-foreground/5'>
      <Image
        src={image.filename!}
        alt={image.alt ?? ''}
        fill
        sizes='(min-width: 1024px) 310px, (min-width: 640px) 48vw, 100vw'
        className='object-cover'
        style={{ objectPosition: focusToObjectPosition(image) }}
      />
    </div>
  );
}
