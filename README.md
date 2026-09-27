# Blog

A personal blog built with Next.js and the Storyblok headless CMS: minimal, fast, and fully editable in Storyblok's Visual Editor.

You find a live-preview here: [Follow the white rabbit](https://storyblok-nextjs-six.vercel.app/)

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
- **Schema as code, UI welcome.** Bloks live in TypeScript (`storyblok/`) and are pushed to Storyblok (`pnpm sb:schema:push`). Bloks built in the Storyblok UI are pulled back into code (`pnpm sb:schema:pull`), and a push refuses to overwrite UI changes that haven't been pulled yet.
- **Typed CMS content.** TypeScript types are generated from the Storyblok schema and verified against the code, as the last step of `pnpm sb:schema:pull` and `pnpm sb:schema:push`.
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
| `pnpm sb:schema:pull`     | Regenerates `storyblok/` from the space (after changes in the Storyblok UI), then syncs the types         |
| `pnpm sb:schema:diff`     | Shows what `sb:schema:push` would change in Storyblok (dry run, changes nothing)                          |
| `pnpm sb:schema:push`     | Pushes the schema in `storyblok/` to Storyblok, then syncs the types                                      |

Bloks can be added in code or in the Storyblok UI. [Adding a blok](#adding-a-blok) explains both ways and which script to use when. "Syncs the types" means: pull the component JSON into `.storyblok/components/` (the snapshot), generate the types from it, move them to `types/` and verify that the app compiles (`scripts/sync-storyblok-types.mts`). There is no separate script for it, so the snapshot and `storyblok/` can't get out of step. If the type verification fails, the new types stay in place and the script exits with an error, so you can see what broke.

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
scripts/                   Storyblok sync scripts: schema pull, drift check before push, type sync
storyblok/                 Blok schema as code (schema.ts, blocks/, folders.ts), synced with pnpm sb:schema:pull/push
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

## Adding a blok

There are two ways to add or change a blok (a Storyblok component). Both are fully supported, and you can mix them:

| | Way 1: schema as code | Way 2: in the Storyblok UI |
| --- | --- | --- |
| You edit | `storyblok/blocks/*.ts` | The Block Library in Storyblok |
| Then run | `pnpm sb:schema:diff`, then `pnpm sb:schema:push` | `pnpm sb:schema:pull` |
| Direction | Code → Storyblok | Storyblok → code |
| Good for | Reviewable changes in pull requests, exact field settings | Quick experiments, clicking through field options |

Either way, you finish by building the React component (see [Frontend](#frontend-both-ways)).

### How the sync works

The schema exists in three places, and the scripts keep them in line:

- **`storyblok/`**: the schema as TypeScript (`schema.ts`, `folders.ts`, `blocks/`). It's what gets pushed.
- **The Storyblok space**: what editors see.
- **`.storyblok/components/`**: a snapshot of the space, written at the end of every pull and push. Types are generated from it into `types/`.

Before every `sb:schema:diff` and `sb:schema:push`, a drift check compares the space with the snapshot. If someone changed the space in the UI since the last pull or push, the push is refused, so it never reverts their work. Pull first, then push.

Commit `storyblok/`, `.storyblok/components/` and `types/` together after every pull or push, so the next person starts from the same snapshot.

Once per machine, run `pnpm sb:login` (check it with `pnpm sb:user`).

### Way 1: schema as code

1. **Get in sync before you edit anything.** There are two "remotes": the git repository and the Storyblok space. Update from both, in this order:
   1. **Git:** `git pull`. This gets your teammates' schema changes in `storyblok/` (and the matching snapshot and types).
   2. **Storyblok:** `pnpm sb:schema:diff`. The drift check at its start tells you whether someone changed bloks in the UI since the last pull or push:
      - **"No changes in Storyblok since the last sync"**: the space matches the snapshot. Look at the diff below it. Normally every blok is `unchanged`. If something else shows up, `storyblok/` has changes in git that were never pushed (e.g. a teammate committed without pushing). Your push in step 6 pushes them too, so check that they're meant to go live, or ask whoever made them.
      - **"The space changed in Storyblok since the last sync"**: run `pnpm sb:schema:pull`, review the changes with `git diff`, and commit them. Then run `pnpm sb:schema:diff` again: it passes now.

   Doing this first matters, because the pull replaces `storyblok/` and refuses to run while you have uncommitted edits there. If you only notice the drift after you started editing (step 5 refuses), follow [Changes in code *and* in the UI](#troubleshooting).
2. **Define the blok** in a new file. Nestable bloks (the ones used inside pages) go into `storyblok/blocks/nestebales/` and get the folder. `name` is the technical name, and the order of `fields` is the order in the editor:

   ```ts
   // storyblok/blocks/nestebales/quote.ts
   import { defineBlock, defineField } from '@storyblok/schema';

   import { nestebalesFolder } from '../../folders';

   export const quoteBlock = defineBlock({
     name: 'quote',
     display_name: 'Quote',
     is_root: false,
     is_nestable: true,
     folder: nestebalesFolder,
     fields: [
       defineField('text', { type: 'textarea' }),
       defineField('author', { type: 'text' }),
       defineField('image', { type: 'asset', filetypes: ['images'] }),
     ],
   });
   ```

   Look at the existing files in `storyblok/blocks/` for other field types (`richtext`, `multilink`, `option`, `bloks`, …). `defineField` is typed, so your editor flags options that don't fit the type.
3. **Register it** in `storyblok/schema.ts`: import it and add it to `blocks`.
4. **Allow it where it's used.** Add the name to the `allow` list of every field that should accept it, e.g. `body` in `storyblok/blocks/page.ts`. Otherwise editors can't insert it.
5. **Preview the change:** `pnpm sb:schema:diff`. This runs the drift check first, then shows what the push would create or update, without changing anything. Expect your new blok as `create` and `page` as `update`.
6. **Push:** `pnpm sb:schema:push`. This runs the drift check again, creates or updates the bloks in Storyblok, pulls a new snapshot and generates the types. After that, the blok's type (e.g. `Quote`) is in `types/storyblok-component-types.d.ts`.
7. **Build the frontend** (see [Frontend](#frontend-both-ways)), then commit.

### Way 2: in the Storyblok UI

1. **Get the latest code and commit or push local schema work first.** Run `git pull`, so the pull in step 4 starts from your teammates' latest `storyblok/`. The pull replaces `storyblok/` completely and refuses to run while it has uncommitted changes. If you have committed but unpushed changes in `storyblok/`, push them *before* you change anything in the UI (see [Troubleshooting](#troubleshooting)).
2. **Create or edit the blok** in Storyblok → Block Library. Put nestable bloks into the "Nestebales" folder.
3. **Allow it where it's used:** in the `page` blok, edit the `body` field and add the new blok to its allowed bloks.
4. **Pull:** `pnpm sb:schema:pull`. This regenerates `storyblok/` from the space (your blok becomes a new file in `storyblok/blocks/`), pulls a new snapshot and generates the types.
5. **Review:** `git diff` and `git status`. Expect the new blok file, the changed `page.ts` and `schema.ts`, the snapshot in `.storyblok/components/` and the new type in `types/`.
6. **Build the frontend** (see [Frontend](#frontend-both-ways)), then commit.

### Frontend (both ways)

1. **Build the component** in `components/bloks/<name>.tsx`, following [`DESIGN.md`](DESIGN.md). Type its props with the generated type (`StoryblokComponentProps<Quote>`), and spread `storyblokEditable(blok)` on the root element so it's clickable in the Visual Editor. `components/bloks/text-image.tsx` is a good reference.
2. **Register it** in `components/registry.ts`, keyed by the technical name (`quote: Quote`). Until then, the blok shows up as "Missing component: quote" in dev and preview, and not at all on the live site.
3. **Check it:** run `pnpm dev` and add the blok to a draft page in the Visual Editor. Then run `pnpm lint` and `pnpm exec tsc --noEmit`.

### Changing or removing a blok

- **Changing** works the same way as adding: edit the file and push (Way 1), or edit in the UI and pull (Way 2).
- **Renaming or removing a field** breaks existing content. `sb:schema:push` detects it, lists the breaking changes and offers to scaffold a migration. Review the migration, then run it with `pnpm exec storyblok migrations run`.
- **Removing a blok:** a push never deletes bloks on its own, so leaving one out of `schema.ts` isn't enough. Delete it in the UI and pull. Or remove it from `storyblok/`, commit, run `pnpm exec storyblok schema push storyblok/schema.ts --delete` (check it with `--dry-run` first), then `pnpm sb:schema:pull` to refresh the snapshot and types (`storyblok/` stays as it is).
- **Undo a push:** restore only the schema code from before the change (`git checkout <commit>~1 -- storyblok/`), commit it, and run `pnpm sb:schema:push`. This works on any machine. Don't `git revert` the whole commit: that would also revert the snapshot in `.storyblok/components/`, and the drift check would refuse the push. On the machine that did the push, `pnpm exec storyblok schema rollback --latest` followed by `pnpm sb:schema:pull` also works: every push saves the space's previous state as a changeset in `.storyblok/schema/changesets/`. Those files are git-ignored, because they're local undo records and git history already has the schema.

### Which script when

| Situation | Run |
| --- | --- |
| Added or changed a blok in `storyblok/` | `pnpm sb:schema:diff`, then `pnpm sb:schema:push` |
| Added or changed a blok in the Storyblok UI | `pnpm sb:schema:pull` |
| Want to see whether code and space differ, without changing anything | `pnpm sb:schema:diff` |
| Types in `types/` look stale | `pnpm sb:schema:pull` |
| Not logged in | `pnpm sb:login` |


### Troubleshooting

- **"The space changed in Storyblok since the last sync"** (push or diff refused): someone changed the UI. Run `pnpm sb:schema:pull`, review, commit, then push again.
- **"storyblok/ has uncommitted changes"** (pull refused): commit your changes and push them with `pnpm sb:schema:push`, then pull.
- **Changes in code *and* in the UI at the same time:** the push is refused, and the pull would overwrite your code changes. Commit your code changes, then run `pnpm sb:schema:pull`. `git diff` now shows your changes as removed, while the UI changes are in. Restore your changes from the diff (e.g. `git checkout -p storyblok/`, keeping the UI parts), then run `pnpm sb:schema:diff` and `pnpm sb:schema:push`.
- **"The app no longer compiles against the new types"**: a field your components use was renamed or removed. The new types stay in place. Fix the components (see `git diff types/`), then run `pnpm exec tsc --noEmit`.

## Deployment

The app runs on any host that supports Next.js (e.g. Vercel).

1. Set all four environment variables on the host.
2. Build with `pnpm build`. The build fetches content from Storyblok, so the tokens must be available at build time.
3. Point the Storyblok webhook and a Visual Editor location at the production URL.

## Caveats

- **Local HTTPS.** `pnpm dev` runs with `--experimental-https`, because the Storyblok Visual Editor only loads previews over HTTPS. On the first run, Next.js creates a local certificate in `certificates/` (git-ignored) and may ask for your system password to trust it. If the editor preview stays blank, open https://localhost:3000 once in the browser and accept the certificate.
- **Dev always shows drafts.** In `pnpm dev`, content is fetched with the preview token and never cached. To check the published site and its caching, use `pnpm build && pnpm start`.
- **Builds need Storyblok.** Missing tokens throw on startup (`lib/storyblok/storyblok-api-client.ts`), and the build fails if Storyblok isn't reachable.
- **Storyblok CLI.** The `sb:*` scripts read `STORYBLOK_SPACE_ID` from `.env`; the CLI loads it itself. Run `pnpm sb:login` once before using the `sb:schema:*` scripts. In CI, the CLI can log in with `STORYBLOK_LOGIN`, `STORYBLOK_TOKEN` and `STORYBLOK_REGION` instead.
- **Region.** The EU region is set in `storyblok.config.ts` and `lib/storyblok/storyblok-api-client.ts`. A space in another region needs both changed.
- **Generated types.** `types/storyblok/` and `types/storyblok-component-types.d.ts` are generated by `pnpm sb:schema:pull` and `pnpm sb:schema:push`. Don't edit them by hand; they're excluded from ESLint.
- **Next.js 16.** Some APIs and conventions differ from older Next.js versions and tutorials. Check the docs bundled in `node_modules/next/dist/docs/` (see `AGENTS.md`).
- **Dependency build scripts.** pnpm 11 blocks install scripts of dependencies; `pnpm-workspace.yaml` (`allowBuilds`) records the decisions. Only allow a package there if it really needs its script.
