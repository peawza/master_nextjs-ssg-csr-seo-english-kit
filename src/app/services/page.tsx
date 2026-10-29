import type { Metadata } from 'next';
import Link from 'next/link';
import { homeContent } from '@/content/home';
import { pageMetadata } from '@/lib/seo/metadata';
import styles from '@/styles/sections.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Services',
  description: 'Explore web design, frontend development and technical SEO services.',
  path: '/services/',
});

export default function ServicesPage() {
  return (
    <main id="main-content" className={styles.pageMain}>
      <div className="container">
        <h1>Our services</h1>
        <p>Every service page should answer one clear search intent with accurate, substantive information.</p>
        <div className={styles.cards}>
          {homeContent.services.map((service) => (
            <article className={styles.card} key={service.title}>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
        <Link className={styles.textLink} href="/">Back to home</Link>
      </div>
    </main>
  );
}
