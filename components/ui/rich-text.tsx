import {
  StoryblokServerRichText,
  type StoryblokRichTextImageOptions,
} from '@storyblok/react/rsc';
import type { StoryblokRichTextDoc } from '@/types/storyblok/storyblok';
import { shiftHeadings } from '@/lib/storyblok/rich-text';

// Rich text arrives as plain HTML elements, so they are styled from the wrapper.
// Block spacing comes from the flow (> * + *), headings add more space above.
// Width and position come from the parent via className.
const PROSE = [
  'text-lg/relaxed wrap-break-word hyphens-auto text-pretty',
  '[&>*+*]:mt-6 [&>:first-child]:mt-0',
  // Headings: the page already has its h1, so text headings start at minHeadingLevel
  '[&>h2]:mt-14 [&>h2]:text-2xl [&>h2]:leading-snug [&>h2]:font-semibold [&>h2]:tracking-tight [&>h2]:text-balance sm:[&>h2]:text-3xl',
  '[&>h3]:mt-10 [&>h3]:text-xl [&>h3]:leading-snug [&>h3]:font-semibold [&>h3]:tracking-tight [&>h3]:text-balance',
  '[&>:is(h4,h5,h6)]:mt-8 [&>:is(h4,h5,h6)]:font-semibold',
  // Anchored headings stay clear of the sticky header
  '[&>:is(h2,h3,h4,h5,h6)]:scroll-mt-(--spacing-header)',
  // Lists
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:pl-1 [&_li+li]:mt-2 [&_li_ul]:mt-2 [&_li_ol]:mt-2 [&_li::marker]:text-foreground/60',
  // Inline
  '[&_strong]:font-semibold',
  '[&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:decoration-2 [&_a]:rounded-sm [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-foreground',
  '[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-foreground/5 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-code [&_:not(pre)>code]:text-[0.875em]',
  // Blocks
  '[&>blockquote]:border-l-2 [&>blockquote]:border-foreground [&>blockquote]:pl-6 [&>blockquote]:text-foreground/70',
  '[&>pre]:overflow-x-auto [&>pre]:rounded-2xl [&>pre]:border [&>pre]:border-foreground/10 [&>pre]:bg-surface [&>pre]:p-6 [&>pre]:font-code [&>pre]:text-sm/relaxed [&>pre]:hyphens-none [&>pre]:wrap-normal',
  '[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-foreground/10',
  '[&>hr]:my-14 [&>hr]:border-foreground/10',
  '[&>table]:block [&>table]:overflow-x-auto [&>table]:text-base [&_th]:border-b [&_th]:border-foreground/30 [&_th]:py-2 [&_th]:pr-6 [&_th]:text-left [&_th]:font-semibold [&_td]:border-b [&_td]:border-foreground/10 [&_td]:py-2 [&_td]:pr-6',
].join(' ');

// Images in the text are below the fold: lazy, resized by the Storyblok image service.
// Width and height stay unset so images keep their own aspect ratio; the SDK types
// every option as required, although it only applies the ones that are set.
const IMAGES = {
  loading: 'lazy',
  srcset: [640, 960, 1344],
  sizes: ['(min-width: 672px) 640px', '100vw'],
  filters: { format: 'webp' },
} as StoryblokRichTextImageOptions;

export default function RichText({
  document,
  minHeadingLevel,
  className = '',
}: {
  document: StoryblokRichTextDoc;
  minHeadingLevel: 2 | 3;
  className?: string;
}) {
  return (
    <StoryblokServerRichText
      document={shiftHeadings(document, minHeadingLevel)}
      optimizeImage={IMAGES}
      className={`${PROSE} ${className}`}
    />
  );
}
