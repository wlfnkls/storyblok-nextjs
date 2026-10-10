'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = {
  label: string;
  href: string;
  external: boolean;
  target?: string;
};

// '/' only matches itself; other routes also match their sub-pages
function isActivePath(pathname: string, href: string) {
  const path = href.split('#')[0] || '/';
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function NavPill({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = !item.external && isActivePath(pathname, item.href);

  console.log('pathname', pathname);
  console.log('item.href', item.href);
  console.log('item.label', item.label);

  const className = `flex min-h-11 items-center rounded-full px-4 font-fine text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-accent-deep dark:focus-visible:ring-accent motion-reduce:transition-none ${
    isActive
      ? 'bg-accent-deep/10 text-accent-deep shadow-[inset_0_0_0_1px_rgb(15_118_110/0.3)] dark:bg-accent/15 dark:text-accent-soft dark:shadow-[inset_0_0_0_1px_rgb(52_211_153/0.35),0_0_16px_-4px_var(--color-accent)]'
      : 'text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-white/70 dark:hover:bg-white/6 dark:hover:text-white'
  }`;

  if (item.external) {
    return (
      <a
        href={item.href}
        target={item.target}
        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={className}
    >
      {item.label}
    </Link>
  );
}
