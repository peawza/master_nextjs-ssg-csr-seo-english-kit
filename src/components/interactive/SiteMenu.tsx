'use client';

import { useRef, useState } from 'react';
import { studyNavigation } from '@/content/villa';
import { Icon } from '@/components/ui/Icon';
import styles from '@/styles/villa.module.css';

export function SiteMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const destination = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  function containFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = dialog.current?.querySelectorAll<HTMLElement>('button, a[href]');
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
  function close() { dialog.current?.close(); }
  function finishClose() {
    setOpen(false);
    const target = destination.current;
    destination.current = null;
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    } else {
      trigger.current?.focus();
    }
  }
  function navigate(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname && url.hash) {
      const target = document.getElementById(url.hash.slice(1));
      if (target) {
        event.preventDefault();
        history.pushState(null, '', url.hash);
        // Apply destination focus after the dialog's native restoration in every engine.
        destination.current = target;
      }
    }
    close();
  }
  return (
    <>
      <button ref={trigger} type="button" className={styles.menuButton} aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={() => { destination.current = null; dialog.current?.showModal(); setOpen(true); }}>
        <span className={styles.menuIcon}><Icon name="menu" /></span><span>Discover</span>
      </button>
      <dialog ref={dialog} id="site-menu" className={styles.menu} aria-labelledby="menu-title" onKeyDown={containFocus} onClose={finishClose}>
        <div className={styles.menuTop}>
          <button type="button" className={styles.menuButton} onClick={close} autoFocus><Icon name="close" /><span>Close</span></button>
          <p className={styles.wordmark} id="menu-title">Villa Luma</p>
          <span className={styles.label}>Design study</span>
        </div>
        <nav aria-label="Explore Villa Luma" className={styles.menuGrid}>
          <div><p className={styles.menuHeading}>A slower<br /><em>way of life</em></p>{studyNavigation.slice(0, 3).map(item => <a key={item.href} href={item.href} onClick={event => navigate(event, item.href)}>{item.label}</a>)}</div>
          <div><p className={styles.menuHeading}>A world<br /><em>to wander</em></p>{studyNavigation.slice(3).map(item => <a key={item.href} href={item.href} onClick={event => navigate(event, item.href)}>{item.label}</a>)}</div>
        </nav>
        <p className={styles.menuNote}>An imaginary place. A very real invitation to slow down.</p>
      </dialog>
    </>
  );
}
