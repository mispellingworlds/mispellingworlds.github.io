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
├── lib/                  # build-time helpers (images.ts, posts.ts)
├── public/               # images, fonts, favicons, CNAME, .nojekyll
└── mdx-components.tsx     # MDX component map (PostImage, Vimeo)
```

## Commands

| Command         | Action                                            |
| :-------------- | :------------------------------------------------ |
| `npm install`   | Install dependencies                              |
| `npm run dev`   | Start the dev server at `localhost:3000`          |
| `npm run build` | Build the static site to `./out/`                 |
| `npm run lint`  | Run ESLint                                         |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs `npm run build`
(Next.js static export, `output: 'export'`) and publishes `./out` to GitHub Pages. The
custom domain is set via `public/CNAME`.
