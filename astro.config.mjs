// @ts-check
import { defineConfig, fontProviders} from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cartografia.xyz',
  integrations: [mdx(), sitemap()],
})