import type { Metadata } from 'next';
import Link from 'next/link';

// A 404 must not canonicalise to, or preview as, another page. Next.js injects
// <meta name="robots" content="noindex">, so the inherited robots tag is cleared.
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The requested page does not exist in this design study.',
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
  robots: null,
};

export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <h1>Page not found</h1>
      <p>We could not find the page you requested.</p>
      <Link href="/">Return to the homepage</Link>
    </main>
  );
}
