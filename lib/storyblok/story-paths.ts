import 'server-only';
import { publicClient } from './storyblok-api-client';
import { isSettingsSlug } from './settings';

const HOME_SLUG = 'home';

export async function fetchStoryPaths(): Promise<string[][]> {
  const paths: string[][] = [];
  let page = 1;
  let total = Infinity;

  while ((page - 1) * 1000 < total) {
    const { data, error, response } = await publicClient.links.list({
      query: { version: 'published', per_page: 1000, page, paginated: '1' },
    });
    if (error) throw error;
    total = Number(response.headers.get('total') ?? 0);

    for (const link of Object.values(data?.links ?? {})) {
      if (link.is_folder || isSettingsSlug(link.slug)) continue;
      // Folder start pages have slugs like "blog/" and should map to /blog
      const slug = link.slug.replace(/\/$/, '');
      if (slug === HOME_SLUG) continue;
      paths.push(slug.split('/'));
    }
    page++;
  }
  return paths;
}
