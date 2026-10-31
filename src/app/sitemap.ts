import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Required with `output: 'export'`: route handlers must be explicitly static.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.url}/services/`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
