# Motion & Interaction Guidelines

- Motion must clarify hierarchy or interaction; it must not delay access to core content.
- Default to CSS transitions and browser-native smoothness; GSAP is optional and should be justified by a real design brief.
- If GSAP is installed, isolate it in `src/components/interactive/` and clean up listeners/timelines on unmount.
- Prefer transforms/opacity over layout-triggering animation; avoid scroll-bound animation loops where possible.
- `prefers-reduced-motion: reduce`: minimize or remove non-essential movement.
- Do not delay visible H1, CTA or SEO content until after JS hydration.
- Focus, hover and active states must remain visible without motion.
