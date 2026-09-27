import { defineBlock, defineField } from '@storyblok/schema';

export const articleBlock = defineBlock({
  name: 'article',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('image', {
      filetypes: ['images'],
      type: 'asset',
    }),
    defineField('title', {
      type: 'text',
    }),
    defineField('teaser', {
      type: 'textarea',
    }),
    defineField('content', {
      type: 'richtext',
    }),
  ],
});
