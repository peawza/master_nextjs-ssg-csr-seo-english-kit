import Link from 'next/link';
import { navigation } from '@/content/home';
import { siteConfig } from '@/config/site';
import { MobileNav } from '@/components/interactive/MobileNav';
import styles from '@/styles/sections.module.css';

export function Header() {
  return (
    <header className={styles.siteHeader}>
      <div className="container" data-header-inner>
        <Link className={styles.brand} href="/" aria-label={`${siteConfig.name}, home`}>
          {siteConfig.name}
        </Link>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <MobileNav items={navigation} />
      </div>
    </header>
  );
}
