import type { Metadata } from 'next';
import { storyMetadata } from '@/lib/storyblok/story-metadata';
import StoryPage from '@/components/story-page';

const HOME_SLUG = 'home';

// Own route instead of the catch-all's root: Vercel regenerates an optional
// catch-all's root as "/index", which breaks usePathname()
export function generateMetadata(): Promise<Metadata> {
  return storyMetadata(HOME_SLUG);
}

export default function Home() {
  return <StoryPage path={HOME_SLUG} />;
}
