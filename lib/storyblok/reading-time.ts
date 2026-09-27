import type { StoryblokRichTextDoc } from '@/types/storyblok/storyblok';

// Typical silent reading speed for English non-fiction
const WORDS_PER_MINUTE = 230;

type TextTree = { text?: string; content?: TextTree[] };

function collectText(node: TextTree): string {
  return (node.text ?? '') + ' ' + (node.content ?? []).map(collectText).join(' ');
}

/** Estimated reading time of a rich text document in whole minutes (at least 1). */
export function readingMinutes(doc: StoryblokRichTextDoc): number {
  const words = collectText(doc as TextTree).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
