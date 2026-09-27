import { defineBlock, defineField } from '@storyblok/schema';

export const pageBlock = defineBlock({
  name: 'page',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('body', {
      allow: ['grid', 'hero', 'popular-articles', 'text', 'text_image'],
      minimum: 0,
      type: 'bloks',
    }),
  ],
});
