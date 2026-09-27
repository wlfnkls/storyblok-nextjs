import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { draftMode } from 'next/headers';
import '@/components/registry';
import './globals.css';
import { fetchStory } from '@/lib/storyblok/api';
import { fontVariables } from '@/lib/fonts';
import Header from '@/components/header';
import DraftModeBanner from '@/components/draft-mode-banner';
import type { Config } from '@/types/storyblok-component-types';

export const metadata: Metadata = {
  title: { default: 'Wolf Niklas', template: '%s | Wolf Niklas' },
  description: '…',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const siteConfigStory = await fetchStory('settings/config');
  const siteConfigContent = siteConfigStory?.content as Config | undefined;
  // Real cookie state, not isDraftRequest(): in dev that's always true and exiting would do nothing
  const { isEnabled: isDraftCookieSet } = await draftMode();

  return (
    <html
      lang='en'
      className={`${fontVariables} h-full antialiased`}
      // next-themes sets data-theme and color-scheme on <html> before hydration
      suppressHydrationWarning
    >
      <body className='min-h-full flex flex-col'>
        <ThemeProvider attribute='data-theme' disableTransitionOnChange>
          <Header siteConfigContent={siteConfigContent} />
          {children}
          {isDraftCookieSet && <DraftModeBanner />}
        </ThemeProvider>
      </body>
    </html>
  );
}
