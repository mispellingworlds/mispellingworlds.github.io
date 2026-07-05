import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Self-hosted @font-face families defined in app/globals.css.
        nohemi: ['Nohemi', 'sans-serif'],
        cursive: ['CursiveDisplay', 'cursive'],
        google: ['GoogleSansFlex', 'sans-serif'],
        stars: ['Stars90', 'sans-serif'],
      },
      colors: {
        // The site is white-on-grey; these are the exact greys the Astro
        // version used for nav, links and meta text.
        ink: '#000000',
        paper: '#ffffff',
        grey: {
          nav: '#808080', // rgb(128,128,128) — nav + home link
          link: '#5f5f5f', // rgb(95,95,95) — post titles
          alt: '#7d7d7d', // rgb(125,125,125) — list links
          meta: '#b7b7b7', // rgb(183,183,183) — dates
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
