import { HeroSection } from '@/components/sections/HeroSection';
import { HomeSections } from '@/components/sections/HomeSections';
import { serializeJsonLd } from '@/lib/seo/json-ld';
import { siteConfig } from '@/config/site';

export default function HomePage() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }} />
      <HeroSection />
      <HomeSections />
    </main>
  );
}
