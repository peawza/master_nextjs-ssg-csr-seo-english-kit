import Link from 'next/link';
import { SiteMenu } from '@/components/interactive/SiteMenu';
import { Icon } from '@/components/ui/Icon';
import styles from '@/styles/villa.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <SiteMenu />
      <Link prefetch={false} className={styles.brand} href="/"><span className={styles.crest}><Icon name="crest" /></span><span className={styles.wordmark}>Villa Luma</span><span className={styles.brandNote}>A lakeside reverie</span></Link>
      <Link prefetch={false} className={styles.headerCta} href="/#suites">Explore stays <span><Icon name="arrowUpRight" /></span></Link>
    </header>
  );
}
