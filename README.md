# Blog

A personal blog built with Next.js and the Storyblok headless CMS: minimal, fast, and fully editable in Storyblok's Visual Editor.

## Tech stack

- **[Next.js 16](https://nextjs.org)**: App Router, React Server Components, static generation, `proxy.ts`
- **[React 19](https://react.dev)** and **TypeScript**
- **[Storyblok](https://www.storyblok.com)**: headless CMS, via `@storyblok/react` (RSC), `@storyblok/api-client` and the Storyblok CLI v4
- **[Tailwind CSS v4](https://tailwindcss.com)**: no component library; design rules in [`DESIGN.md`](DESIGN.md)
- **[next-themes](https://github.com/pacocoursey/next-themes)**: light, dark and system theme without flash
- `next/font` (Bricolage Grotesque, JetBrains Mono) and `next/image`
- **pnpm 11** on **Node 24**

## Features

- **One route for all content.** `app/[[...slug]]` renders every Storyblok story. All published stories are pre-rendered at build time (`generateStaticParams`).
- **Caching with on-demand revalidation.** Published content is cached with tags. A signed Storyblok webhook (`/api/revalidate`) refreshes it on publish, with a daily revalidation as a fallback.
- **Visual Editor preview.** Next.js Draft Mode, entered via signed, time-limited preview links (`/api/draft`). Drafts are never cached. Outside the editor, a banner lets you leave draft mode.
- **Typed CMS content.** TypeScript types are generated from the Storyblok schema and verified against the code (`pnpm sb:sync`).
- **Editor-friendly fallback.** Bloks without a React component are flagged in preview instead of silently disappearing.
- **Accessible.** Skip link, visible focus states, a consistent heading outline (rich text headings are shifted to fit the page), and support for reduced motion.

## Prerequisites

- **Node.js 24**
- **pnpm 11**: the exact version is pinned in `package.json` (`packageManager`). The easiest way to get it is Corepack, which ships with Node: `corepack enable`.
- A **Storyblok space** in the **EU** region, plus access to its settings (tokens, webhooks, Visual Editor).

## Getting started

```bash
git clone <repository-url> blog
cd blog
corepack enable          # provides the pinned pnpm version
pnpm install
cp .env.example .env     # then fill in the values, see below
pnpm dev
```

Open **https://localhost:3000**. Note the `https`, see [Caveats](#caveats).

### Environment variables

All variables are required. `.env.example` explains where to find each one.

| Variable                   | Where to find it                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `STORYBLOK_PUBLIC_TOKEN`   | Storyblok → Settings → Access Tokens, access level **Public**                      |
| `STORYBLOK_PREVIEW_TOKEN`  | Storyblok → Settings → Access Tokens, access level **Preview**                     |
| `STORYBLOK_SPACE_ID`       | Storyblok → Settings → General. Used by the app and the Storyblok CLI              |
| `STORYBLOK_WEBHOOK_SECRET` | Any long random string (e.g. `openssl rand -hex 32`), also entered in the webhook  |

`.env` is git-ignored. Never commit real values.

## Scripts

| Script                    | What it does                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                | Starts the dev server on https://localhost:3000 (always shows draft content)                              |
| `pnpm build`              | Production build; pre-renders all published stories (needs Storyblok access)                              |
| `pnpm start`              | Serves the production build                                                                               |
| `pnpm lint`               | Runs ESLint                                                                                               |
| `pnpm sb:login`           | Logs in to the Storyblok CLI (once per machine)                                                           |
| `pnpm sb:user`            | Shows the logged-in Storyblok user, a quick login check                                                   |
| `pnpm sb:pull-components` | Pulls the component schema into `.storyblok/components/`                                                  |
| `pnpm sb:generate-types`  | Generates TypeScript types from the pulled schema into `.storyblok/types/`                                |
| `pnpm sb:sync`            | **Use this one.** Checks the login, pulls components, generates types, moves them to `types/`, and verifies they compile |

Run `pnpm sb:sync` whenever a component changes in Storyblok. If the verification fails, the new types stay in place and the script exits with an error, so you can see what broke.

## Project structure

```
app/
  [[...slug]]/page.tsx     Catch-all route: fetches and renders any story
  api/draft/               Enters draft mode from a signed Visual Editor link
  api/draft/disable/       Leaves draft mode
  api/revalidate/          Storyblok webhook → cache revalidation
  layout.tsx               Root layout: fonts, theme, header (menu from settings/config)
  loading.tsx, not-found.tsx
components/
  bloks/                   One component per Storyblok blok (page, hero, grid, teaser, text, article, …)
  header/                  Navigation, theme toggle, skip link
  ui/                      Shared UI (card grid, cover image, rich text)
  registry.ts              Maps Storyblok component names to React components
lib/
  storyblok/               API clients, fetching, links, images, rich text helpers
  fonts.ts
types/                     Generated Storyblok types (do not edit) + shared prop types
scripts/                   sync-storyblok-types.mts (pnpm sb:sync)
.storyblok/components/     Pulled component schema (committed for reference)
storyblok.config.ts        Storyblok CLI config
DESIGN.md                  Design system: tokens, recipes, component rules
AGENTS.md, CLAUDE.md       Instructions for AI coding agents
```

## Storyblok setup

### Required content

- **`home`**: the story rendered at `/`.
- **`settings/config`**: a story of content type `config` that holds the header menu (`header_menu`). "Home" is always added as the first menu item. Stories in the `settings/` folder are never rendered as pages.
- Folder start pages map to the folder path, e.g. the start page of `blog/` is `/blog`.

### Visual Editor

Storyblok → Settings → Visual Editor → set the preview URL (location) to:

```
https://localhost:3000/api/draft?slug=
```

Storyblok appends the story's slug and its signed `_storyblok_tk` parameters. The route verifies them with `STORYBLOK_PREVIEW_TOKEN`, enables draft mode, and redirects to the page. Add your production URL as a second location in the same way.

### Webhook (cache revalidation)

Storyblok → Settings → Webhooks → new webhook:

- **Endpoint:** `https://<your-domain>/api/revalidate`
- **Secret:** the value of `STORYBLOK_WEBHOOK_SECRET`
- **Triggers:** story published, unpublished, deleted (and moved, if you use it)

Requests without a valid signature are rejected.

### Adding a new blok

1. Create the component in Storyblok.
2. Run `pnpm sb:sync` to get its types.
3. Build the React component in `components/bloks/`, following [`DESIGN.md`](DESIGN.md).
4. Register it in `components/registry.ts`.

## Deployment

The app runs on any host that supports Next.js (e.g. Vercel).

1. Set all four environment variables on the host.
2. Build with `pnpm build`. The build fetches content from Storyblok, so the tokens must be available at build time.
3. Point the Storyblok webhook and a Visual Editor location at the production URL.

## Caveats

- **Local HTTPS.** `pnpm dev` runs with `--experimental-https`, because the Storyblok Visual Editor only loads previews over HTTPS. On the first run, Next.js creates a local certificate in `certificates/` (git-ignored) and may ask for your system password to trust it. If the editor preview stays blank, open https://localhost:3000 once in the browser and accept the certificate.
- **Dev always shows drafts.** In `pnpm dev`, content is fetched with the preview token and never cached. To check the published site and its caching, use `pnpm build && pnpm start`.
- **Builds need Storyblok.** Missing tokens throw on startup (`lib/storyblok/storyblok-api-client.ts`), and the build fails if Storyblok isn't reachable.
- **Storyblok CLI.** The `sb:*` scripts read `STORYBLOK_SPACE_ID` from `.env`; the CLI loads it itself. Run `pnpm sb:login` once before `pnpm sb:sync`. In CI, the CLI can log in with `STORYBLOK_LOGIN`, `STORYBLOK_TOKEN` and `STORYBLOK_REGION` instead.
- **Region.** The EU region is set in `storyblok.config.ts` and `lib/storyblok/storyblok-api-client.ts`. A space in another region needs both changed.
- **Generated types.** `types/storyblok/` and `types/storyblok-component-types.d.ts` are generated by `pnpm sb:sync`. Don't edit them by hand; they're excluded from ESLint.
- **Next.js 16.** Some APIs and conventions differ from older Next.js versions and tutorials. Check the docs bundled in `node_modules/next/dist/docs/` (see `AGENTS.md`).
- **Dependency build scripts.** pnpm 11 blocks install scripts of dependencies; `pnpm-workspace.yaml` (`allowBuilds`) records the decisions. Only allow a package there if it really needs its script.
