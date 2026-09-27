# Design system

Reference implementations: `components/bloks/hero.tsx`, `components/bloks/teaser/`, `components/bloks/article/` and `components/ui/rich-text.tsx`. New UI should look like it belongs next to them, in light **and** dark mode.

## Direction

- **Minimal and nearly black and white.** Off-white page with near-black text in light mode, the inverse in dark mode. Content comes first; the UI stays out of the way.
- **No accent color in content.** Hierarchy comes from size, weight, opacity and whitespace, not color. To highlight something, invert it (see *Highlighted card*).
- **Flat.** Hairline borders only: no shadows, gradients, glows or blur in content elements (hero, blocks, cards, text).
- **One background pattern:** a faint dot grid behind the top of every page (`body::before` in `app/globals.css`) that fades out towards the content. Don't add further decoration.
- **Navigation is the exception** and stays as it is: the header capsule keeps its frosted glass, the emerald active pill and its soft glow. The `ink` and `accent*` tokens exist only for it.
- **Tailwind only.** No shadcn or other component libraries.
- **Lean markup.** No wrapper elements that don't carry layout or semantics.

## Component structure

**Always follow the single responsibility principle.** Every component, hook and module does exactly one thing.

- **Split into new files.** When a component takes on a second job (layout *and* state, data mapping *and* rendering, a list *and* its items), move that job into its own file, usually a child component next to the parent. Don't keep several components in one file; each file exports one component. The only exception is a small set of stateless variants of the same thing, like the three icons in `theme-icons.tsx`.
- **Group related children in a folder** named after the parent, e.g. `components/header/` for `components/header.tsx`.
- **Keep client code small.** Only the part that needs state, effects or browser APIs gets `'use client'` in its own file. The parent stays a server component and passes plain props down.
- **Shared logic goes to `lib/`** (e.g. `lib/storyblok/link.ts`), not into a component.

Reference: the header.
- `header.tsx` maps the CMS menu and positions the header.
- `nav-pills.tsx` renders the capsule and list.
- `nav-pill.tsx` is one link with its active state (client).
- `theme-toggle.tsx` holds the theme state (client).
- `theme-icons.tsx` holds the icons.
- `skip-link.tsx` is the skip link.

## Tokens

Defined in `app/globals.css`. Use the token utilities and never raw hex in components.

| Token        | Light     | Dark      | Use                                  |
| ------------ | --------- | --------- | ------------------------------------ |
| `background` | `#fafafa` | `#0a0a0a` | Page surface                         |
| `foreground` | `#0a0a0a` | `#ededed` | Text, borders, rings (with opacity)  |
| `surface`    | `#ffffff` | `#141414` | Cards that sit on the page           |

The semantic tokens switch with the theme on their own, so content needs **no `dark:` variants**. Shades are opacities of `foreground`:

| Use                  | Class                  |
| -------------------- | ---------------------- |
| Headings, body       | inherited `foreground` |
| Secondary text       | `text-foreground/70`   |
| Hairline border      | `border-foreground/10` |
| Hover border         | `border-foreground/30` |
| Image placeholder    | `bg-foreground/5`      |
| Focus ring           | `ring-foreground`      |

Don't go below `/60` for text (keeps 4.5:1 contrast in both modes).

Navigation only: `ink` (`#050d0b`), `accent` (`#34d399`), `accent-soft` (`#a7f3d0`), `accent-deep` (`#0f766e`). Don't use them in content.

## Light & dark mode

Tailwind's `dark:` variant follows `data-theme` on `<html>` (custom variant in `app/globals.css`), and so do the CSS variables behind the tokens.

- The theme is handled by [next-themes](https://github.com/pacocoursey/next-themes): `<ThemeProvider attribute='data-theme'>` in `app/layout.tsx`. Its inline script sets `data-theme` (resolved: `light`/`dark`, drives `dark:` and the tokens) and `color-scheme` on `<html>` before the first paint, from `localStorage` (`theme`; default `system`). In `system`, the page follows OS changes live. Without JS the attribute is missing and everything falls back to `prefers-color-scheme`.
- `suppressHydrationWarning` on `<html>` is required by next-themes (it changes that element before hydration). It only covers `<html>`'s own attributes, not its children.
- The theme toggle in the header (`components/header/theme-toggle.tsx`) reads and sets the preference with `useTheme()`, cycles light → dark → system and shows the icon of the current preference. The preference only exists in the browser, so the icon renders after hydration.
- Never read the theme on the server, and only render theme-dependent markup after hydration (like the toggle icon). Style with the semantic tokens (or `dark:`) so server and client HTML match.
- A new color that must differ between modes becomes a new variable in all three theme blocks of `app/globals.css`, not a pair of `dark:` classes.

## Type

Fonts come from `lib/fonts.ts`. `font-fine` (Bricolage Grotesque) is the body default, so it never needs to be set.

- Headlines: `font-semibold tracking-tight text-balance`, `leading-[1.05]` at display sizes. Page `h1`: `text-4xl sm:text-5xl lg:text-6xl`. Section `h2`: `text-2xl sm:text-3xl`. Card heading: `text-xl leading-snug`.
- Body and supporting text: `text-lg/relaxed text-pretty max-w-[56ch] text-foreground/70` (`text-base/relaxed` in cards).
- `font-code` (JetBrains Mono) for labels, credits and metadata: `text-xs text-foreground/70`.
- Long words: add `wrap-break-word hyphens-auto` to headlines and text from the CMS.

## Layout

- **Container:** `mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8`. Full-width images are the only thing that leaves it.
- **Reading column:** `mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8` for long-form text (about 65–75 characters per line). Images in the same page may stay in the wider container.
- **Section spacing:** `py-12 md:py-16`; the hero gets `py-16 md:py-24`.
- Sections sit directly on the page. Only cards and images get a frame.

## Recipes

**Card.** Cards in a row (like teasers) are always framed, with or without an image:

```
overflow-hidden rounded-2xl border border-foreground/10 bg-surface
```

Content padding `p-6`. An image sits flush at the top with `border-b border-foreground/10 bg-foreground/5`.

**Image frame.** A standalone image inside the container. `components/ui/cover-image.tsx` is the shared one (hero and article):

```
relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5
```

Credits go in a `figcaption` below the image (`mt-3 font-code text-xs text-foreground/60`), never on top of it.

**Hero.** Headline and subheadline sit on the page; an optional image follows below them, not behind them. `layout: full-width` makes the image edge to edge, without frame.

**Card row.** `components/ui/card-grid.tsx` is the shared row for cards (used by the `grid` blok and popular articles):

- At most 3 per row: `sm:grid-cols-2 lg:grid-cols-3`. A single item gets `max-w-xl`, and two items get `sm:grid-cols-2`, so there's never a half-empty row of three.
- The parent section owns the container and spacing. Cards only render themselves and fill their cell (`flex` on the `li`, `w-full` on the card, `flex-1` on the content). The "Read more" cue is pinned with `mt-auto`, so cues line up across a row.
- Editors build rows of arbitrary bloks with the Storyblok `grid` blok (`components/bloks/grid.tsx`). Its optional headline is a section `h2` (`mb-8`) that labels the section; the grid then passes `headingLevel='h3'` to its children, so teaser cards drop to `h3`.

**Teaser card.** `components/bloks/teaser/teaser-card.tsx` is the one card for anything that points to content. It takes plain props (headline, description, image, resolved link, `headingLevel`, `highlighted`, `editable`). Bloks only map their data onto it: `teaser.tsx` from its own fields, `popular-articles.tsx` from article stories. Don't build a second card for another content type; map onto this one.

**Highlighted card.** Content that should stand out from regular cards (popular articles pass `highlighted`) is **inverted**, not colored: same size and layout, but filled with `foreground` and its text in `background`. The card sets `*:[--foreground:var(--background)]`, so its children's `foreground` shades (secondary text, borders, placeholder, cue) flip automatically and need no extra classes. Hover lightens the fill (`hover:bg-foreground/90`); the focus ring gets `ring-offset-2 ring-offset-background` so it doesn't merge with the card.

**Article.** `components/bloks/article.tsx` is the page of an article story, read top to bottom:

- `article/article-overview-link.tsx`: "← All articles", a plain link (never `history.back()`, which would leave the site for readers from search or social) to the story's parent folder, via `parentPath()` in `lib/storyblok/link.ts`. It sits above the title and again in `article/article-footer.tsx` after the body (hairline `border-t`), and is hidden for top-level articles. Style: `font-code text-xs text-foreground/70 hover:text-foreground`, `min-h-11` hit area. The route passes `fullSlug` to the root blok, since a blok only knows its own content.
- `article/article-header.tsx`: `h1` (page `h1` sizes, but only up to `sm:text-5xl` because it sits in the reading column), the teaser as the lead (`text-lg/relaxed sm:text-xl/relaxed text-foreground/70`), and the reading time as metadata (`font-code text-xs`, from `lib/storyblok/reading-time.ts`).
- The cover image follows the header as a framed `CoverImage` in the wide container, never behind the title.
- The body is a `RichText` (see below) in the reading column, headings starting at `h2`.

**Rich text.** `components/ui/rich-text.tsx` is the one renderer for Storyblok rich text (article body, text blok). It uses `StoryblokServerRichText`; its elements are plain HTML, so they are styled from the wrapper with arbitrary variants (`[&>h2]:…`), all in one `PROSE` list. The parent passes width and position via `className`.

- Flow spacing `[&>*+*]:mt-6`, more above headings, none above the first element.
- Code blocks and images use the card frame, inline code `bg-foreground/5`, links the inline link recipe, quotes a `border-l-2 border-foreground`. Images are lazy and resized by the Storyblok image service.
- `minHeadingLevel` shifts the editor's headings down (`shiftHeadings()` in `lib/storyblok/rich-text.ts`) so they continue the page outline: `2` directly below the page `h1`, `3` under a section `h2`. Editors can pick any level; the order is kept, levels never repeat the `h1` or skip one.
- Check fields with `hasRichText()` first: an emptied field still sends an empty paragraph.
- No `@tailwindcss/typography`: add new elements to `PROSE` instead.

**Text.** `components/bloks/text.tsx`: an optional section `h2` (`mb-6`) and rich text. It sits in the regular container, left-aligned with the hero, and uses its full width. Labelled by its heading (`aria-labelledby`), and renders nothing when both fields are empty.

**Text & image.** `components/bloks/text-image.tsx`: text and image side by side in the regular container (`md:grid-cols-2 md:items-center`), stacked on mobile with the text first. Without an image the grid stays one column, so the text uses the full container width. `text-image/text-image-content.tsx` holds the optional section `h2`, the subheadline (`text-lg/relaxed text-foreground/70`) and the rich text (headings from `h3` below a headline). `text-image/text-image-figure.tsx` is the image frame at `aspect-4/3`, lazy, with the credit in a `figcaption`. Labelled by its heading, and renders nothing when every field is empty.

**Section with heading and cards.** Popular articles (`components/bloks/popular-articles.tsx`): a section `h2` (`mb-8`), then a card row. The section is labelled by its heading (`aria-labelledby`), and the cards drop to `h3` so headings don't skip levels.

**Linked card.** When a whole card or block links somewhere (see `components/bloks/teaser/`):

- Put the real link on the headline and stretch it with `after:absolute after:inset-0 after:content-['']` over the `relative` card. The accessible name stays just the headline, and there's only one tab stop.
- Visual cues like "Read more →" are `aria-hidden` spans (`font-code text-xs`), not second links.
- Hover and focus live on the card: `group/<name> hover:border-foreground/30` and `has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-foreground`. Only apply them when there is a link.
- Check CMS links with `hasLink()` from `lib/storyblok/link.ts` before rendering. An empty Storyblok multilink would otherwise resolve to `/`.

**Inline link.** `text-foreground underline underline-offset-4 hover:decoration-2`.

## Header

- The header is sticky and stays in the page flow with a fixed height (`h-header`, token `--spacing-header` in `app/globals.css`), so it never covers content.
- If you change the header's height, update `--spacing-header`.

## Motion & accessibility

- Motion is rare and small: entry animations use `starting:` variants, 400–500ms, `ease-out`, small offsets (`translate-y-2`). Hover is a 200ms color change.
- Every transition gets `motion-reduce:transition-none`.
- Loading skeletons (`app/loading.tsx`) appear immediately at full opacity, with no fade-in or delay: loads here are usually shorter than any delay, which leaves an empty page instead. Only the bars pulse (`animate-pulse motion-reduce:animate-none`).
- Decorative layers get `aria-hidden` and `pointer-events-none`.
- `figcaption` must be a direct child of `figure`.
- Every page's `<main>` gets `id={MAIN_CONTENT_ID}` (from `components/header/skip-link.tsx`) so the skip link works.
