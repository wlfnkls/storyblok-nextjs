import type { Metadata } from 'next';
import { fetchStoryPaths } from '@/lib/storyblok/story-paths';
import { storyMetadata } from '@/lib/storyblok/story-metadata';
import StoryPage from '@/components/story-page';

export async function generateStaticParams() {
  const paths = await fetchStoryPaths();
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[...slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return storyMetadata(slug.join('/'));
}

export default async function Page({ params }: PageProps<'/[...slug]'>) {
  const { slug } = await params;
  return <StoryPage path={slug.join('/')} />;
}
