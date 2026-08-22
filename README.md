# mispelling worlds / cartografia.xyz

Personal art & writing site, built with [Next.js](https://nextjs.org) (App Router) and
Tailwind CSS, deployed to GitHub Pages as a static export at
[cartografia.xyz](https://cartografia.xyz).

## Project structure

```text
/
├── app/                  # routes (App Router) + layout.tsx + globals.css
│   ├── posts/[slug]/      # blog posts rendered from content/posts/*.mdx
│   ├── drawings/ screenshots/   # lightbox galleries (images from public/images)
│   └── about/ images/ other/ inspiration/ contact/
├── components/           # FluidText, Gallery, PostImage, Vimeo, HomeLink, fonts…
├── content/posts/        # MDX blog posts (frontmatter: title, pubDate, description)
├── lib/                  # build-time helpers (images.ts, image-manifest.ts, posts.ts)
├── public/               # images, fonts, favicons, CNAME, .nojekyll
│   └── _img/              # generated derivatives (gitignored, see below)
├── scripts/              # optimize-images.mjs (responsive image generation)
└── mdx-components.tsx     # MDX component map (PostImage, Vimeo)
```

## Commands

| Command         | Action                                            |
| :-------------- | :------------------------------------------------ |
| `npm install`   | Install dependencies                              |
| `npm run dev`   | Start the dev server at `localhost:3000`          |
| `npm run build` | Build the static site to `./out/`                 |
| `npm run lint`  | Run ESLint                                         |
| `npm run images`| Regenerate responsive image derivatives            |

## Images

GitHub Pages has no image server, so `next/image` optimization is off and whatever
sits in `public/` is what visitors download — the originals here are multi-megabyte
scans and screenshots. `scripts/optimize-images.mjs` closes that gap: it runs
automatically before `dev` and `build`, and for every file under `public/images`
(plus a couple of loose ones) it writes a ladder of WebP derivatives to
`public/_img/` along with a 20px blur placeholder, recording everything in
`.image-manifest.json`.

`PostImage` and `Gallery` read that manifest and emit `srcset`/`sizes`, intrinsic
`width`/`height` (so nothing reflows as images arrive) and the placeholder as a
background, so a post ships ~100 KB of images instead of several megabytes. The
image at the top of a post takes `priority`, which preloads it in `<head>` and skips
lazy loading — everything below the fold stays lazy.

Both `public/_img/` and `.image-manifest.json` are gitignored and regenerated on
demand; re-runs reuse derivatives whose source hasn't changed. Add a new image by
dropping it in `public/images/…` as usual. The originals are still deployed, so
existing `/images/...` URLs keep working — nothing on the site links to them.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm run build`
(Next.js static export, `output: 'export'`) and publishes `./out` to GitHub Pages. The
custom domain is set via `public/CNAME`.
