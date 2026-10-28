'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/sections.module.css';

type NavItem = { readonly label: string; readonly href: string };

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.mobileNav}>
      <button type="button" className={styles.menuToggle} aria-expanded={open}
        aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>
        {open ? 'Close menu' : 'Open menu'}
      </button>
      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!open}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
        ))}
      </nav>
    </div>
  );
}
