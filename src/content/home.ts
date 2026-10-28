export const navigation = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Contact', href: '/#contact' },
] as const;

export const homeContent = {
  hero: {
    eyebrow: 'Web design & development',
    title: 'Fast, accessible websites built to be found.',
    description: 'An example SSG-first marketing website. Replace this sample copy with verified business content before publishing.',
    cta: 'Explore our services',
  },
  services: [
    { title: 'Web Design', description: 'Responsive, maintainable interfaces with a clear visual system.' },
    { title: 'Frontend Development', description: 'Accessible Next.js pages with lightweight client interactions.' },
    { title: 'Technical SEO', description: 'Semantic HTML, metadata and crawlable static content.' },
  ],
  steps: ['Discover objectives and search intent', 'Define design tokens and page structure', 'Build and verify the static website'],
  questions: [
    { question: 'Can this website use animations?', answer: 'Yes. Client-side animations can enhance static HTML without delaying the main content.' },
    { question: 'Does this need a server?', answer: 'The sample pages are static. Features needing runtime APIs should use an explicitly separate service.' },
  ],
} as const;
