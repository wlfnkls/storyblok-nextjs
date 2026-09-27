import Link from 'next/link';
import type { ReactNode } from 'react';

const stretched =
  "outline-none after:absolute after:inset-0 after:content-['']";

export default function TeaserLink({
  href,
  external,
  target,
  children,
}: {
  href: string;
  external: boolean;
  target?: string;
  children: ReactNode;
}) {
  if (external) {
    const opensNewTab = target === '_blank';
    return (
      <a
        href={href}
        target={target}
        rel={opensNewTab ? 'noopener noreferrer' : undefined}
        className={stretched}
      >
        {children}
        {opensNewTab && <span className='sr-only'> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={stretched}>
      {children}
    </Link>
  );
}
