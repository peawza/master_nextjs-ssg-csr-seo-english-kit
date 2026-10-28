import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="container not-found">
      <h1>Page not found</h1>
      <p>We could not find the page you requested.</p>
      <Link href="/">Return to the homepage</Link>
    </main>
  );
}
