import Link from 'next/link';
import { homeContent } from '@/content/home';
import styles from '@/styles/sections.module.css';

export function HeroSection() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className="container">
        <p className={styles.eyebrow}>{homeContent.hero.eyebrow}</p>
        <h1 id="hero-title">{homeContent.hero.title}</h1>
        <p className={styles.heroLead}>{homeContent.hero.description}</p>
        <Link className={styles.primaryAction} href="/services/">{homeContent.hero.cta}</Link>
      </div>
    </section>
  );
}
