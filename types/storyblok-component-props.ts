import type { storyblokEditable } from '@storyblok/react';

export type StoryblokComponentProps<T> = {
  blok: T;
  storyblokEditable?: ReturnType<typeof storyblokEditable>;

  _uid: string;
  component: string;
};
