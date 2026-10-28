# Animation specification — REV-001
Reference timing UNKNOWN; following timings are chosen defaults, not measured facts.

| Interaction | Trigger/state | Local motion | Fallback |
|---|---|---|---|
| Link | hover/focus | underline/color 180ms | visible focus outline |
| Menu | button → modal open | opacity/translate 250ms | native dialog, keyboard controls |
| Menu close | Escape/button/anchor | immediate semantic close; restore focus | no persistent scroll lock |
| Section | first intersection | translateY(16px→0), opacity(.65→1),400ms | base content always visible |
| Anchor | link | native smooth scroll | reduced motion auto |

Menu state: closed → open on button; open → closed on Escape/close/link. Native dialog confines focus; restore button on dismissal, focus target heading/section after same-page navigation. All listeners/observers cleaned up. No animation on hero/H1. Reduced motion disables animation and scroll effects. If JS/observer unavailable all sections remain visible and footer navigation works. No auto audio/video, custom cursor, scroll hijacking or GSAP.
