import ArticleOverviewLink from './article-overview-link';

export default function ArticleFooter({ overviewHref }: { overviewHref: string }) {
  return (
    <footer className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8'>
      <div className='border-t border-foreground/10 pt-6'>
        <ArticleOverviewLink href={overviewHref} />
      </div>
    </footer>
  );
}
