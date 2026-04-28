# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/radiance-of-darkness` (`@workspace/radiance-of-darkness`)

Dark fantasy manga website — React + Vite + Wouter + Framer Motion + TanStack Query.

- **8 pages**: Home, Trailer, MangaList, MangaReader, Gallery, Universe, Studio, Contact
- **i18n**: 9 languages (IT/EN/FR/DE/ES/JA/KO/ZH/PT) via `src/lib/i18n.ts` + `LanguageContext`
- **Layout**: navbar with full language dropdown, footer with X/IG/TT social links and team credits
- **Trailer** (`/trailer`): full-bleed MP4 player from `@assets/trailer.mp4`
- **Gallery**: filter bar (Tutto / Concept Art / Personaggi / Illustrazioni / Bozze) + lightbox with prev/next; `Bozze` section displays 79 sketches in responsive grid
- **MangaReader** (`/reader/:id`): digital flipbook using `react-pageflip` (HTMLFlipBook landscape mode, `showCover=true`). Two view modes — `book` (flipbook) and `scroll` (vertical stacked)
  - Chapter 1: 32 spread pages (each ~1.55:1 = 2 manga pages already side-by-side) split via CSS into 64 half-pages, plus front/back covers (split from `COPERTINA.jpeg` 50/50). Total 66 leaves
  - Pages stored as WebP q85 ≤2400px in `public/manga/chapter-1/` (`page-00.webp`…`page-31.webp` + `cover-front.webp` + `cover-back.webp`)
  - `BookPage` component: covers use `object-cover`; inner pages use absolute `<img>` at `width:200%` with `left:0` (left half) or `left:-100%` (right half) + gutter shadow + corner page number
  - Keyboard nav (←/→), corner click, drag/swipe; bottom toolbar shows "Copertina" / page N / total / "Retro"
- **Studio**: team cards (Federico Francesco Arcuri, Alessio Francesco Lanza, Andrea Ianni, Tommaso Mannarino)
- **Universe**: lore + 3 factions (Order / Void / Lightless) + character cards
- **Assets**: hero-bg, cover-1/2/3, concept-1/2, char-1/2, pixel-alchemists-logo.jpeg under `public/images/`; manga assets under `public/manga/chapter-1/`; trailer.mp4 in `attached_assets/`
- **Contact email**: pixelalchemists09@gmail.com
- **Logo rendering**: `filter: invert(1) contrast(2.5) brightness(1.3)` + `mixBlendMode: screen`
- **Font**: Cinzel Decorative for hero title via Google Fonts
- **Key deps**: `react-pageflip` (flipbook), `framer-motion`, `wouter`, `@tanstack/react-query`, Tailwind v4
- **Asset processing scripts** (one-off): `yauzl` for unzipping, `sharp` (already in `node_modules`) for WebP compression and cover splitting; root `package.json` has `pnpm.onlyBuiltDependencies: ["sharp"]`

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
