// @ts-check
import { defineConfig, fontProviders} from 'astro/config';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mispellingworlds.github.io',
  integrations: [mdx()],
})