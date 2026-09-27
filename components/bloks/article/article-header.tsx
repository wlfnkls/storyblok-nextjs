import ArticleOverviewLink from './article-overview-link';

export default function ArticleHeader({
  title,
  teaser,
  readingMinutes,
  overviewHref,
}: {
  title?: string;
  teaser?: string;
  readingMinutes?: number;
  overviewHref?: string;
}) {
  return (
    <header className='mx-auto w-full max-w-2xl px-4 transition-[opacity,translate] duration-500 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none sm:px-6 lg:px-8'>
      {overviewHref && (
        <div className='mb-6'>
          <ArticleOverviewLink href={overviewHref} />
        </div>
      )}
      {title && (
        <h1 className='text-4xl leading-[1.05] font-semibold tracking-tight wrap-break-word hyphens-auto text-balance sm:text-5xl'>
          {title}
        </h1>
      )}
      {teaser && (
        <p className='mt-6 text-lg/relaxed wrap-break-word text-pretty text-foreground/70 sm:text-xl/relaxed'>
          {teaser}
        </p>
      )}
      {readingMinutes && (
        <p className='mt-8 font-code text-xs text-foreground/70'>
          {readingMinutes}&nbsp;min read
        </p>
      )}
    </header>
  );
}
