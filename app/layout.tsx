import type { Metadata } from 'next';
import ReactDOM from 'react-dom';
import './globals.css';

// Fonts needed above the fold — preloaded to avoid the HTML → CSS → font
// request waterfall (and the fallback-font flash). Nohemi powers the titles,
// GoogleSansFlex the body. Before The Rain (nav and "home" links) isn't here:
// it's embedded as a data URI in globals.css, so there's nothing to fetch.
const PRELOAD_FONTS = [
  { href: '/fonts/Nohemi-Medium.woff2', type: 'font/woff2' },
  { href: '/fonts/GoogleSansFlex.woff2', type: 'font/woff2' },
];

export const metadata: Metadata = {
  metadataBase: new URL('https://cartografia.xyz'),
  title: {
    default: 'cartografia',
    template: '%s — cartografia',
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'mispelling worlds',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Preload (React 19 hoists these into <head>) so the fonts download in
  // parallel with the HTML instead of after the CSS is parsed.
  PRELOAD_FONTS.forEach(({ href, type }) =>
    ReactDOM.preload(href, {
      as: 'font',
      type,
      crossOrigin: 'anonymous',
    }),
  );

  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
