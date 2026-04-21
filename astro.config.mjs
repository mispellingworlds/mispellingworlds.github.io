// @ts-check
import { defineConfig, fontProviders} from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mispellingworlds.github.io',
  integrations: [mdx(), sitemap()],
})