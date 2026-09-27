import { defineBlock, defineField } from '@storyblok/schema';

export const configBlock = defineBlock({
  name: 'config',
  is_root: true,
  is_nestable: false,
  fields: [
    defineField('header_menu', {
      allow: ['menu_link'],
      type: 'bloks',
    }),
  ],
});
