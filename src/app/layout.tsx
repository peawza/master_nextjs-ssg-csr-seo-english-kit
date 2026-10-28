import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [{ url: '/images/lake-1280.webp', width: 1280, height: 853, alt: 'Villa Luma fictional lakeside design study' }],
  },
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.language}>
      <head><link rel="preload" href="/fonts/cormorant-garamond-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
