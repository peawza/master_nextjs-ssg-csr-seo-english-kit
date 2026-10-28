'use client';
import { useEffect } from 'react';

/** Animate visible server content; never depend on hydration to reveal it. */
export function MotionEnhancer() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate([{ opacity: 0.65, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: 'ease-out' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    const cancel = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener('change', cancel);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener('change', cancel); };
  }, []);
  return null;
}
