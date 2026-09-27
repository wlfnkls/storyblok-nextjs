export const MAIN_CONTENT_ID = 'main-content';

// Hidden until keyboard-focused; the first tab stop on every page
export default function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className='pointer-events-auto absolute top-4 left-4 z-10 flex min-h-11 -translate-y-24 items-center rounded-full bg-accent px-5 font-fine text-sm font-semibold text-ink shadow-[0_0_24px_-6px_var(--color-accent)] transition-transform duration-200 ease-out outline-none focus-visible:translate-y-0 focus-visible:ring-2 focus-visible:ring-accent-deep focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
    >
      Skip to content
    </a>
  );
}
