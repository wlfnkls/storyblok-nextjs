import type { StoryblokRichTextDoc } from '@/types/storyblok/storyblok';

type Node = StoryblokRichTextDoc['content'][number];
type HeadingNode = Extract<Node, { type: 'heading' }>;
type HeadingLevel = NonNullable<HeadingNode['attrs']['level']>;

const isHeading = (node: Node): node is HeadingNode => node.type === 'heading';
const levelOf = (node: HeadingNode): HeadingLevel => node.attrs.level ?? 1;

/** Whether a rich text field holds visible content (an emptied field still sends an empty paragraph). */
export function hasRichText(doc?: StoryblokRichTextDoc): doc is StoryblokRichTextDoc {
  return Boolean(
    doc?.content?.some(
      (node) => node.type !== 'paragraph' || Boolean(node.content?.length),
    ),
  );
}

/**
 * Shifts all headings down so the highest one is at least `minLevel`, keeping
 * their relative order (h2/h3 under a section h2 become h3/h4). The page
 * outline then never repeats the page h1 or skips a level.
 */
export function shiftHeadings(
  doc: StoryblokRichTextDoc,
  minLevel: HeadingLevel,
): StoryblokRichTextDoc {
  const levels = doc.content.filter(isHeading).map(levelOf);
  const offset = levels.length ? minLevel - Math.min(...levels) : 0;
  if (offset <= 0) return doc;

  return {
    ...doc,
    content: doc.content.map((node) =>
      isHeading(node)
        ? {
            ...node,
            attrs: {
              ...node.attrs,
              level: Math.min(6, levelOf(node) + offset) as HeadingLevel,
            },
          }
        : node,
    ),
  };
}
