import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const heroBlock = defineBlock({
  name: 'hero',
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
    defineField('background_image', {
      filetypes: ['images'],
      type: 'asset',
    }),
    defineField('layout', {
      default_value: 'constrained',
      exclude_empty_option: true,
      options: [
        {
          _uid: '809dc70a-d45e-497f-891d-def67e03e3a8',
          name: 'Constrained',
          value: 'constrained',
        },
        {
          _uid: 'e6c21f99-ab6a-4db5-9d80-42267d46776b',
          name: 'Full Width',
          value: 'full-width',
        },
      ],
      type: 'option',
      use_uuid: true,
    }),
  ],
});
