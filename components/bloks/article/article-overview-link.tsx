import Link from 'next/link';

export default function ArticleOverviewLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className='inline-flex min-h-11 items-center gap-2 rounded-sm font-code text-xs text-foreground/70 transition-[color] duration-200 ease-out hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground motion-reduce:transition-none'
    >
      <span aria-hidden='true'>←</span>
      All articles
    </Link>
  );
}
