import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const teaserBlock = defineBlock({
  name: 'teaser',
  is_root: false,
  is_nestable: true,
  folder: nestebalesFolder,
  fields: [
    defineField('image', {
      type: 'asset',
    }),
    defineField('link', {
      type: 'multilink',
    }),
    defineField('description', {
      type: 'text',
    }),
    defineField('headline', {
      type: 'text',
    }),
  ],
});
