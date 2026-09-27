import type { ReactNode } from 'react';

const COLUMNS: Record<number, string> = {
  1: 'max-w-xl',
  2: 'sm:grid-cols-2',
};
const MANY_COLUMNS = 'sm:grid-cols-2 lg:grid-cols-3';

export type CardGridItem = { key: string; node: ReactNode };

export default function CardGrid({ items }: { items: CardGridItem[] }) {
  return (
    <ul
      role='list'
      className={`grid gap-6 ${COLUMNS[items.length] ?? MANY_COLUMNS}`}
    >
      {items.map(({ key, node }) => (
        <li key={key} className='flex'>
          {node}
        </li>
      ))}
    </ul>
  );
}
