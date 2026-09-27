import { resolveLink } from '@/lib/storyblok/link';
import type { Config } from '@/types/storyblok-component-types';
import type { NavItem } from './header/nav-pill';
import NavPills from './header/nav-pills';
import SkipLink from './header/skip-link';
import ThemeToggle from './header/theme-toggle';

const homeItem: NavItem = { label: 'Home', href: '/', external: false };

export default function Header({
  siteConfigContent,
}: {
  siteConfigContent?: Config;
}) {
  const menuItems: NavItem[] = (siteConfigContent?.header_menu ?? [])
    .map((item) => ({ label: item.label ?? '', ...resolveLink(item.link) }))
    // Home is always first, so drop a CMS entry that points there too
    .filter((item) => item.label && item.href !== '/');

  return (
    <header className='pointer-events-none sticky top-0 z-50 flex h-header items-start justify-center gap-2 px-4 pt-4'>
      <SkipLink />
      <NavPills items={[homeItem, ...menuItems]} />
      <ThemeToggle />
    </header>
  );
}
