import NavPill, { type NavItem } from './nav-pill';

// Floating glass capsule (light frost / dark ink) holding one pill per nav item
export default function NavPills({ items }: { items: NavItem[] }) {
  return (
    <nav
      aria-label='Main navigation'
      className='pointer-events-auto max-w-full min-w-0 overflow-x-auto rounded-full border border-ink/10 bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_16px_32px_-16px_rgb(5_13_11/0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-ink/70 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_24px_48px_-24px_rgb(0_0_0/0.6)] transition-[opacity,translate] duration-500 ease-out scrollbar:none starting:-translate-y-2 starting:opacity-0 motion-reduce:transition-none'
    >
      <ul className='flex items-center gap-1'>
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <NavPill item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
