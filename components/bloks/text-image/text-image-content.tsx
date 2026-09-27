import type { StoryblokRichTextDoc } from '@/types/storyblok/storyblok';
import RichText from '@/components/ui/rich-text';

export default function TextImageContent({
  headline,
  headingId,
  subheadline,
  text,
}: {
  headline?: string;
  headingId: string;
  subheadline?: string;
  text: StoryblokRichTextDoc | null;
}) {
  return (
    <div>
      {headline && (
        <h2
          id={headingId}
          className='text-2xl font-semibold tracking-tight wrap-break-word hyphens-auto text-balance sm:text-3xl'
        >
          {headline}
        </h2>
      )}
      {subheadline && (
        <p className='mt-4 text-lg/relaxed wrap-break-word text-pretty text-foreground/70 first:mt-0'>
          {subheadline}
        </p>
      )}
      {text && (
        <RichText
          document={text}
          minHeadingLevel={headline ? 3 : 2}
          className='mt-6 first:mt-0'
        />
      )}
    </div>
  );
}
