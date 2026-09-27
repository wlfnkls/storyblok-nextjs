import { defineConfig } from 'storyblok/config';

// The Storyblok CLI loads .env itself before reading this file
const space = process.env.STORYBLOK_SPACE_ID;
if (!space) throw new Error('Missing STORYBLOK_SPACE_ID (see .env.example)');

export default defineConfig({
  space,
  region: 'eu',
  path: '.storyblok',
  modules: {
    types: {
      generate: {
        filename: 'storyblok-component-types',
      },
    },
  },
});
