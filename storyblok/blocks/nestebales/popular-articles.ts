import { defineBlock, defineField } from '@storyblok/schema';

import { nestebalesFolder } from '../../folders';

export const popularArticlesBlock = defineBlock({
  name: 'popular-articles',
  is_root: false,
  is_nestable: true,
  folder: nestebalesFolder,
  fields: [
    defineField('headline', {
      type: 'text',
    }),
    defineField('articles', {
      filter_content_type: ['article'],
      folder_slug: 'blog/',
      max_options: '3',
      source: 'internal_stories',
      type: 'options',
    }),
  ],
});
