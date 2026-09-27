import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import type { Page } from '@/types/storyblok-component-types';
import {
  storyblokEditable,
  StoryblokServerComponent,
} from '@storyblok/react/rsc';

export default function Page({ blok }: StoryblokComponentProps<Page>) {
  return (
    <div className='page' {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
}
