import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const menuLinkBlock = defineBlock({
  name: 'menu_link',
  is_root: false,
  is_nestable: true,
  folder: nestebalesFolder,
  fields: [
    defineField('label', {
      type: 'text',
    }),
    defineField('link', {
      type: 'multilink',
    }),
  ],
});
