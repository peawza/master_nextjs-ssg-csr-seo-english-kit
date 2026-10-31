import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Required with `output: 'export'`: route handlers must be explicitly static.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
