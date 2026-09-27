import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const textImageBlock = defineBlock({
  name: 'text_image',
  display_name: 'Text & Image',
  is_root: false,
  is_nestable: true,
  folder: nestebalesFolder,
  fields: [
    defineField('headline', {
      type: 'text',
    }),
    defineField('subheadline', {
      type: 'text',
    }),
    defineField('image', {
      filetypes: ['images'],
      type: 'asset',
    }),
    defineField('text', {
      type: 'richtext',
    }),
  ],
});
