import Link from 'next/link';
import { MAIN_CONTENT_ID } from '@/components/header/skip-link';

export default function NotFound() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className='mx-auto w-full max-w-5xl scroll-mt-24 px-4 py-16 outline-none sm:px-6 md:py-24 lg:px-8'
    >
      <p className='font-code text-xs text-foreground/70'>404</p>
      <h1 className='mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl'>
        Page not found
      </h1>
      <p className='mt-6 max-w-[56ch] text-lg/relaxed text-pretty text-foreground/70'>
        This page doesn’t exist (anymore).{' '}
        <Link
          href='/'
          className='text-foreground underline underline-offset-4 hover:decoration-2'
        >
          Back to the homepage
        </Link>
      </p>
    </main>
  );
}
