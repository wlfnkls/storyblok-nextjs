import { MAIN_CONTENT_ID } from '@/components/header/skip-link';

function Bar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-foreground/[0.07] motion-reduce:animate-none ${className}`}
    />
  );
}

function CardSkeleton() {
  return (
    <div className='overflow-hidden rounded-2xl border border-foreground/10 bg-surface'>
      <Bar className='aspect-4/3 w-full rounded-none' />
      <div className='space-y-3 p-6'>
        <Bar className='h-5 w-5/6' />
        <Bar className='h-4 w-2/3' />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      aria-busy='true'
      className='scroll-mt-24 outline-none'
    >
      <p role='status' className='sr-only'>
        Loading content…
      </p>

      <div
        aria-hidden
        className='mx-auto w-full max-w-5xl space-y-16 px-4 py-16 sm:px-6 md:space-y-24 md:py-24 lg:px-8'
      >
        <div className='space-y-3'>
          <Bar className='h-10 w-3/4 sm:h-12 lg:h-14' />
          <Bar className='h-10 w-1/2 sm:h-12 lg:h-14' />
          <Bar className='mt-6! h-4 w-full max-w-[56ch]' />
          <Bar className='h-4 w-2/3 max-w-[56ch]' />
        </div>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </main>
  );
}
