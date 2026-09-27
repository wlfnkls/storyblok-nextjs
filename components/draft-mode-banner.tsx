'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Shown when the draft-mode cookie is set and the site is opened outside the
 * Storyblok Visual Editor. The cookie is browser-wide, so without this an
 * editor keeps seeing unpublished content everywhere on the site.
 */
export default function DraftModeBanner() {
  const pathname = usePathname();
  const isTopLevel = useSyncExternalStore(
    subscribe,
    () => window.self === window.top,
    () => false, // server: render nothing, decide on the client
  );

  if (!isTopLevel) return null;

  return (
    <div className='fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t-2 border-dashed border-amber-500 bg-amber-50 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] font-mono text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100'>
      <p>
        <strong>Draft mode</strong>: you are viewing unpublished content.
      </p>
      {/* A form, not <Link>: prefetching a GET would exit draft mode by accident */}
      <form
        method='post'
        action={`/api/draft/disable?path=${encodeURIComponent(pathname)}`}
      >
        <button
          type='submit'
          className='cursor-pointer rounded border border-amber-600 px-3 py-1 hover:bg-amber-100 dark:hover:bg-amber-900'
        >
          Exit draft mode
        </button>
      </form>
    </div>
  );
}
