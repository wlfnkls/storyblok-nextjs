import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const textBlock = defineBlock({
  name: 'text',
  is_root: false,
  is_nestable: true,
  folder: nestebalesFolder,
  fields: [
    defineField('headline', {
      type: 'text',
    }),
    defineField('text', {
      type: 'richtext',
    }),
  ],
});
