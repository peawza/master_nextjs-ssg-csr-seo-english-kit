import Link from 'next/link';
import { studyNavigation } from '@/content/villa';
import { Icon } from '@/components/ui/Icon';
import styles from '@/styles/villa.module.css';

export function Footer() {
  return (
    <footer id="about-project" tabIndex={-1} className={styles.footer}>
      <span className={styles.crest}><Icon name="crest" /></span>
      <h2>A little more time.<br /><em>A little more wonder.</em></h2>
      <nav aria-label="Footer navigation">{studyNavigation.map(item => <Link prefetch={false} key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <div className={styles.footerBottom}><Link prefetch={false} href="/" className={styles.wordmark}>Villa Luma</Link><p>Independent design study · Fictional destination<br />No reservations or services are offered. Photographs are illustrative.</p><Link prefetch={false} href="/#main-content">Back to the beginning <Icon name="arrowUp" /></Link></div>
    </footer>
  );
}
