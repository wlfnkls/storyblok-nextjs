import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';

/**
 * Brand type pair. Each font only exposes a CSS variable; `fontVariables` is
 * applied on <html> in app/layout.tsx, so the Tailwind utilities `font-fine`
 * and `font-code` (tokens in app/globals.css) work everywhere.
 */

// Grotesk for headlines and body text
export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage-grotesque',
});

// Technical mono for labels and metadata
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const fontVariables = [bricolageGrotesque, jetbrainsMono]
  .map((font) => font.variable)
  .join(' ');
