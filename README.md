# Portfolio — Mushfique Tanzim Muztaba

Personal portfolio site. Client-rendered SPA across five routes, no backend — all
content lives in JSON files under `src/data/` and the components are pure presentation.

Live at <https://mushfique-portfolio.vercel.app/>.

## Stack

React 19 · TypeScript · Vite · React Router · Tailwind CSS · Framer Motion ·
Lenis (smooth scroll)

## Commands

```bash
npm install
npm run dev              # dev server on http://localhost:5173
npm run build            # tsc -b, then vite build → dist/
npm run preview          # serve the production build locally
npm run lint             # eslint
npm run convert:webp     # generate .webp siblings for images in public/projects/
npm run sizes:images     # regenerate src/data/imageSizes.json after adding images
npm run convert:webp:dry # report what convert:webp would write, without writing
```

## Routes

| Route | Page | Sections |
| --- | --- | --- |
| `/` | `HomePage` | Hero (with the page index cards) → Work Experience |
| `/mechanical` | `MechanicalPage` | SOLIDWORKS → AutoCAD → Concept & Product Design |
| `/robotics` | `RoboticsPage` | Robotics & Autonomy → AI & Computer Vision → Software |
| `/design` | `DesignPage` | Graphic Design → Leadership & Activities |
| `/about` | `AboutPage` | Skills → Certifications |

[`src/App.tsx`](src/App.tsx) is just the router. Every page but the home page is
`lazy()`-loaded behind a [`PageSkeleton`](src/components/ui/PageSkeleton.tsx) — the
home page stays eager so first paint needs no extra round-trip.

[`RootLayout`](src/layouts/RootLayout.tsx) is a layout route, so the cursor,
backgrounds, nav, and footer stay mounted across navigations. That matters for
`useLenis`, whose instance must survive a route change, and for the nav's `layoutId`
pill animation.

Its `ScrollOnNavigate` resets scroll on every `pathname` change and then calls
`lenis.resize()`. Both are needed: Lenis caches the document height, so without the
resize it clamps scrolling to the *previous* page's height. Both run inside a
`requestAnimationFrame` so the incoming route has laid out first.

```
src/
  App.tsx                     router: route table + lazy boundaries
  layouts/RootLayout.tsx      persistent chrome + scroll-on-navigate
  pages/                      one component per route
  lib/
    projects.ts               the project data layer — filters, partitions, counts
    orgs.ts                   the same for leadership.json
  components/
    FloatingNav.tsx           sticky pill nav; page links + per-route section links
    ProjectSection.tsx        a titled accordion of projects (mechanical, robotics)
    OrgSection.tsx            a titled list of organizations (design)
    PageHeader.tsx            the h1 block at the top of each category page
    BackToTop.tsx  ParallaxOrbs.tsx  Footer.tsx  Lightbox.tsx  ScrollReveal.tsx
    sections/                 Hero, WorkExperience, Certifications, Skills
    ui/                       presentational primitives (NeuCard, ProjectImageGrid,
                              OptimizedImage, ImageCarousel, CustomCursor, …)
  data/                       all page content, as JSON
  hooks/                      useLenis, useScrollReveal, useLightbox, useDocumentMeta
  index.css                   design tokens + neumorphic component classes
```

## Editing content

Nothing about the copy lives in the components. Edit the JSON:

| File | Feeds |
| --- | --- |
| `src/data/workExperience.json` | Work Experience (companies, each with nested `teams[]`) |
| `src/data/projects.json` | every project, on `/mechanical` and `/robotics` |
| `src/data/leadership.json` | `/design` |

### Adding a project

Append an entry to `src/data/projects.json`. Which page it lands on is decided by two
fields, not by which file it lives in:

- **`categories`** — any of `mechanical`, `robotics`, `ai`, `software`. A project may
  carry several, and that is how one project legitimately appears on two pages: the
  humanoid robot arm is both `mechanical` and `robotics`.
- **`tools`** — `SOLIDWORKS` or `AutoCAD`. Groups the `/mechanical` page into its
  sections. A `mechanical` project with no tool falls into Concept & Product Design.

`slug` must be unique; it is the React key and the accordion's expansion key. Within a
single page, [`partitionByCategory`](src/lib/projects.ts) assigns each project to the
first matching section, so a multi-category project is never listed twice on one page.

`src/data/leadership.json` has its own `categories` of `design` or `leadership`, which
splits the two sections of `/design`.

Image paths point into `public/projects/`. See
[`public/projects/README.md`](public/projects/README.md) for adding images and for the
optional `imageLayout` field that controls how an entry's images are arranged.

The hero's page-index counts and preview images are derived from the data, so they
update on their own. Certifications and Skills are the two exceptions — their content
is inline in [`Certifications.tsx`](src/components/sections/Certifications.tsx) and
[`Skills.tsx`](src/components/sections/Skills.tsx).

## Design system

Neumorphism: a soft grey `#F2F4F6` surface, deep navy `#1A2B4A`, blue accent
`#3B82F6`, and paired light/dark box-shadows for depth. Tokens are CSS custom
properties in [`src/index.css`](src/index.css), alongside `.neu-card`, `.neu-button`,
`.neu-pill`, and `.neu-tag` component classes.

Note that `cursor: none` is set globally, because
[`CustomCursor`](src/components/ui/CustomCursor.tsx) draws a replacement that expands
and shows the label from any `data-cursor` attribute it hovers. Both are reverted
under `(hover: none) and (pointer: coarse)` so touch devices keep the native cursor.

## Performance notes

Worth knowing before changing the image or loading paths:

- Images are served as WebP, generated by `scripts/convert-to-webp.mjs`. The referenced
  set is 63 files / 3.8 MB, none over 200 kB.
- Every image carries intrinsic `width`/`height` from `src/data/imageSizes.json`
  (`npm run sizes:images`). This is load-bearing: `ProjectImageGrid` lays images out as
  `w-full h-auto`, so without the attributes the container starts at zero height and the
  page jumps as each image lands — and the skeleton, being `absolute inset-0`, has no box
  to fill and never shows. **Re-run the script after adding images.**
- Fonts are self-hosted latin subsets in `public/fonts/`, with the `@font-face` rules at
  the top of `src/index.css`. Not cosmetic: loading them from Google meant a
  render-blocking request to `fonts.googleapis.com`, then a second round trip to
  `fonts.gstatic.com` once the CSS was parsed, and that stylesheet is served with
  `max-age=86400` — so returning visitors re-paid it daily. IBM Plex Sans is the variable
  cut, so one file covers weights 400-700; IBM Plex Mono ships as three static weights.
- `index.html` inlines a splash skeleton, which React replaces on mount, and preloads
  the portrait.
- Project cards are an accordion, and a collapsed card never mounts its
  `ProjectImageGrid`. This is the biggest loading win on `/mechanical`: the old
  always-expanded CAD view requested all 29 of its images up front.
- `Lightbox` and `ImageCarousel` are `lazy()` + `Suspense` at every call site, as is
  every route except the home page.
- `OptimizedImage` reveals cached images before first paint via `useLayoutEffect` +
  `img.complete`, so only genuinely-uncached images get a shimmer and a fade.
- `EngineeredGridBackground` skips itself entirely on small touch devices, renders
  its static grid once offscreen, and only runs its RAF loop while the mouse moves.
- `vite.config.ts` splits `framer-motion`, `lenis`, and `lucide-react` into separate
  chunks. `react-router-dom` is deliberately *not* split — every route needs it on
  first paint, so a separate chunk would only add a request.

Route splitting is not a large first-paint win here, and it is worth being clear about
why: the shared cost (React, Framer Motion at 139 kB, Lenis, the UI primitives) loads
on every route regardless, and the per-route chunks are 1–11 kB. The reasons for the
split are per-URL SEO, linkable pages, and the image behaviour above.

## Deployment

Pushes to `main` deploy to Vercel.

[`vercel.json`](vercel.json) rewrites all paths to `/index.html`. Without it every
deep link 404s on refresh — client-side routes do not exist as files. Static assets
take precedence over the rewrite on Vercel, so `/projects/*` and `/sitemap.xml` are
unaffected. Relatedly, `base` in `vite.config.ts` must stay `'/'`: a relative base
resolves assets against the current document, so `/mechanical` would request
`/mechanical/assets/…` and 404.

It also sets a one-year immutable `Cache-Control` on `/assets/*` and `/fonts/*`. The
font files are **not** content-hashed, so replacing one in place would be served stale —
give a new font file a new name.

Per-page titles, descriptions, canonicals, and Open Graph tags are set at runtime by
[`useDocumentMeta`](src/hooks/useDocumentMeta.ts); `index.html` carries the home
page's values as the static baseline. `public/sitemap.xml` lists all five routes and
is maintained by hand.
