import { defineSchema } from '@storyblok/schema';
import type {
  Schema as InferSchema,
  Story as InferStory,
} from '@storyblok/schema';
import type {
  BlockContent,
  MapiStory as InferStoryMapi,
} from '@storyblok/schema';

import { articleBlock } from './blocks/article';
import { configBlock } from './blocks/config';
import { gridBlock } from './blocks/nestebales/grid';
import { heroBlock } from './blocks/nestebales/hero';
import { menuLinkBlock } from './blocks/nestebales/menu-link';
import { pageBlock } from './blocks/page';
import { popularArticlesBlock } from './blocks/nestebales/popular-articles';
import { teaserBlock } from './blocks/nestebales/teaser';
import { textBlock } from './blocks/nestebales/text';
import { textImageBlock } from './blocks/nestebales/text-image';
import { nestebalesFolder } from './folders';

export const schema = defineSchema({
  blocks: {
    articleBlock,
    configBlock,
    gridBlock,
    heroBlock,
    menuLinkBlock,
    pageBlock,
    popularArticlesBlock,
    teaserBlock,
    textBlock,
    textImageBlock,
  },
  folders: {
    nestebalesFolder,
  },
});

export type Schema = InferSchema<typeof schema>;
export type Blocks = Schema['blocks'];
export type FieldPlugins = Schema['fieldPlugins'];
export type Story = InferStory<Blocks, FieldPlugins>;
export type StoryMapi = InferStoryMapi<Blocks, FieldPlugins>;

// Type a component's props by block name: `Block<"hero">`.
export type Block<TName extends Blocks['name']> = BlockContent<
  Extract<Blocks, { name: TName }>,
  Blocks,
  FieldPlugins
>;

// Loose union of every block's content, for a dynamic component dispatcher.
export type AnyBlock = BlockContent<Blocks, Blocks, FieldPlugins>;
