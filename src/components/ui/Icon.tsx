import styles from '@/styles/villa.module.css';

/**
 * Decorative inline SVG icons. They replace Unicode symbol glyphs (☰ × ✳ ↗ ↓ ↑ ❧), which are not in
 * the page fonts and forced a costly system font-fallback search during the first layout (REV-005).
 * Always decorative: hidden from assistive technology; the surrounding control carries the name.
 */
export type IconName = 'menu' | 'close' | 'crest' | 'arrowUpRight' | 'arrowDown' | 'arrowUp' | 'ornament';

const paths: Record<IconName, React.ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  crest: <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />,
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  arrowDown: <path d="M12 4v16M6 14l6 6 6-6" />,
  arrowUp: <path d="M12 20V4M6 10l6-6 6 6" />,
  ornament: (
    <>
      <path d="M12 18.5c-3.6-2.6-7-5.3-7-8.6a3.6 3.6 0 0 1 7-1.2 3.6 3.6 0 0 1 7 1.2c0 3.3-3.4 6-7 8.6z" fill="currentColor" stroke="none" />
      <path d="M12 18.5c-.4 1.9-2 2.9-3.8 2.5" />
    </>
  ),
};

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={`${styles.icon} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
