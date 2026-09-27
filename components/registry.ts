import 'server-only';

import { storyblokInit } from '@storyblok/react/rsc';

import Page from '@/components/bloks/page';
import Teaser from '@/components/bloks/teaser';
import Article from '@/components/bloks/article';
import PopularArticles from './bloks/popular-articles';
import Hero from '@/components/bloks/hero';
import Grid from '@/components/bloks/grid';
import Text from '@/components/bloks/text';
import TextImage from '@/components/bloks/text-image';
import Fallback from '@/components/bloks/fallback';

storyblokInit({
  // Always on: Fallback itself decides per request (dev or draft mode) whether to render
  enableFallbackComponent: true,
  customFallbackComponent: Fallback,
  components: {
    page: Page,
    teaser: Teaser,
    article: Article,
    'popular-articles': PopularArticles,
    hero: Hero,
    grid: Grid,
    text: Text,
    text_image: TextImage,
  },
});
