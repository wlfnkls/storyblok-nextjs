import type { StoryblokMultilink } from '@/types/storyblok/storyblok';

// Storyblok slug -> app path; the "home" story is the root route
export function slugToPath(slug = ''): string {
  const trimmed = slug.replace(/^\/+|\/+$/g, '');
  return trimmed === '' || trimmed === 'home' ? '/' : `/${trimmed}`;
}

export function resolveLink(link?: StoryblokMultilink): {
  href: string;
  external: boolean;
  target?: string;
} {
  if (!link) return { href: '#', external: false };
  const anchor = link.anchor ? `#${link.anchor}` : '';

  switch (link.linktype) {
    case 'url':
      return {
        href: link.url ?? link.cached_url ?? '#',
        external: true,
        target: link.target,
      };
    case 'email':
      return { href: `mailto:${link.email ?? link.url}`, external: true };
    case 'asset':
      return { href: link.url ?? '#', external: true, target: link.target };
    default: {
      const path = slugToPath(link.cached_url);
      return { href: `${path}${anchor}`, external: false, target: link.target };
    }
  }
}

// Storyblok sends an "empty" multilink (linktype 'story', cached_url '') when the
// editor left the field blank; resolveLink would turn that into '/'
export function hasLink(link?: StoryblokMultilink): link is StoryblokMultilink {
  if (!link) return false;
  if (link.linktype === 'email') return Boolean(link.email);
  return Boolean(link.url || link.cached_url);
}

// Path of the folder a story lives in ("blog/my-post" -> "/blog"); "/" for top-level stories
export function parentPath(fullSlug = ''): string {
  const segments = fullSlug.replace(/^\/+|\/+$/g, '').split('/');
  return slugToPath(segments.slice(0, -1).join('/'));
}
