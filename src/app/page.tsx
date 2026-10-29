import { VillaSections } from '@/components/sections/VillaSections';
import { StudyImage } from '@/components/ui/StudyImage';
import { Icon } from '@/components/ui/Icon';
import { MotionEnhancer } from '@/components/interactive/MotionEnhancer';
import { media } from '@/content/villa';
import { serializeJsonLd } from '@/lib/seo/json-ld';
import { siteConfig } from '@/config/site';
import styles from '@/styles/villa.module.css';

export default function HomePage() {
  const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: siteConfig.name, description: siteConfig.description, url: siteConfig.url };
  return (
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }} />
      <section className={styles.hero} aria-labelledby="hero-title">
        <StudyImage image={media.lake} priority sizes="100vw" />
        <div className={styles.heroContent}><p className={styles.label}>Villa Luma · An imagined escape</p><h1 id="hero-title">Stay a little.<br /><em>Dream a little.</em></h1><p>A slower kind of beautiful.</p></div>
        <a className={styles.heroScroll} href="#about" aria-label="Discover the villa"><Icon name="arrowDown" /></a>
      </section>
      <VillaSections />
      <MotionEnhancer />
    </main>
  );
}
