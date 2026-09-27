'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { DarkIcon, LightIcon, SystemIcon } from './theme-icons';

type ThemePreference = 'light' | 'dark' | 'system';

const CYCLE: Record<ThemePreference, ThemePreference> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

const LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const ICONS = { light: LightIcon, dark: DarkIcon, system: SystemIcon };

const subscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // The stored preference only exists in the browser, so it's shown after hydration
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const preference = isHydrated
    ? theme && theme in CYCLE
      ? (theme as ThemePreference)
      : 'system'
    : undefined;
  const next = CYCLE[preference ?? 'system'];
  const Icon = preference && ICONS[preference];

  return (
    <button
      type='button'
      onClick={() => setTheme(next)}
      aria-label={
        preference
          ? `Color scheme: ${LABELS[preference]}. Switch to ${LABELS[next]}`
          : 'Switch color scheme'
      }
      title={`Switch to ${LABELS[next]}`}
      className='group pointer-events-auto shrink-0 cursor-pointer rounded-full border border-ink/10 bg-white/70 p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.6),0_16px_32px_-16px_rgb(5_13_11/0.25)] backdrop-blur-xl transition-[opacity,translate] duration-500 ease-out outline-none starting:-translate-y-2 starting:opacity-0 motion-reduce:transition-none dark:border-white/10 dark:bg-ink/70 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_24px_48px_-24px_rgb(0_0_0/0.6)]'
    >
      <span className='flex size-11 items-center justify-center rounded-full text-ink/70 transition-[color,background-color] duration-200 ease-out group-hover:bg-ink/5 group-hover:text-ink group-focus-visible:ring-2 group-focus-visible:ring-accent-deep motion-reduce:transition-none dark:text-white/70 dark:group-hover:bg-white/6 dark:group-hover:text-white dark:group-focus-visible:ring-accent'>
        {/* Shows the current preference */}
        {Icon && <Icon />}
      </span>
    </button>
  );
}
