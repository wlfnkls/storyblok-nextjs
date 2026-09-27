import type { resolveLink } from '@/lib/storyblok/link';
import TeaserLink from './teaser-link';

export type HeadingLevel = 'h2' | 'h3';

export default function TeaserContent({
  headline,
  description,
  link,
  headingLevel: Heading = 'h2',
}: {
  headline?: string;
  description?: string;
  link?: ReturnType<typeof resolveLink>;
  headingLevel?: HeadingLevel;
}) {
  return (
    <div className='flex flex-1 flex-col p-6'>
      {headline && (
        <Heading className='text-xl leading-snug font-semibold tracking-tight wrap-break-word hyphens-auto text-balance'>
          {link ? <TeaserLink {...link}>{headline}</TeaserLink> : headline}
        </Heading>
      )}

      {description && (
        <p className='mt-2 text-base/relaxed wrap-break-word text-pretty text-foreground/70'>
          {description}
        </p>
      )}

      {link && (
        <span
          aria-hidden
          className='mt-auto pt-6 font-code text-xs text-foreground/70 transition-colors duration-200 ease-out group-hover/teaser:text-foreground motion-reduce:transition-none'
        >
          Read more →
        </span>
      )}
    </div>
  );
}
