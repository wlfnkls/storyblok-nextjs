import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const gridBlock = defineBlock({
  name: 'grid',
  is_root: false,
  is_nestable: true,
  folder: nestebalesFolder,
  fields: [
    defineField('headline', {
      type: 'text',
    }),
    defineField('columns', {
      type: 'bloks',
    }),
  ],
});
