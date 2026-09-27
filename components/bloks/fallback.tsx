import { StoryblokComponentProps } from '@/types/storyblok-component-props';
import { storyblokEditable, type SbBlokData } from '@storyblok/react/rsc';
import { isDraftRequest } from '@/lib/storyblok/draft';

// Storyblok-internal keys that aren't editor content
const META_KEYS = new Set(['_uid', 'component', '_editable']);

/**
 * Rendered by StoryblokServerComponent when a blok has no registered React
 * component. Only visible in dev or draft mode, so editors see what they
 * placed in the Visual Editor while published pages render nothing.
 */
export default async function Fallback({
  blok,
}: StoryblokComponentProps<SbBlokData>) {
  if (!(await isDraftRequest())) return null;

  const fields = Object.entries(blok).filter(([key]) => !META_KEYS.has(key));

  return (
    <div
      className='my-4 rounded-md border-2 border-dashed border-amber-500 bg-amber-50 p-4 font-mono text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100'
      {...storyblokEditable(blok)}
    >
      <p>
        Missing component: <strong>{blok.component}</strong>
      </p>
      <p className='mt-1 opacity-75'>
        Create it in <code>components/bloks/</code> and register it in{' '}
        <code>components/registry.ts</code>.
      </p>

      {fields.length > 0 && (
        <details className='mt-3'>
          <summary className='cursor-pointer select-none'>
            Blok data ({fields.length} {fields.length === 1 ? 'field' : 'fields'})
          </summary>
          <pre className='mt-2 overflow-x-auto rounded bg-white/60 p-3 text-xs dark:bg-black/30'>
            {JSON.stringify(Object.fromEntries(fields), null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
