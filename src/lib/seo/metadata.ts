import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

/**
 * Next.js shallow-merges metadata: a route that sets `openGraph` replaces the
 * parent's object, and a route that omits it inherits the parent's url/title.
 * Every route therefore builds a complete, route-specific Open Graph object
 * from this shared base. Twitter tags are derived from it by Next.
 */
export const openGraphBase = {
  type: 'website',
  siteName: siteConfig.name,
  locale: siteConfig.locale,
  images: [{ url: '/images/lake-1280.webp', width: 1280, height: 853, alt: 'Villa Luma fictional lakeside design study' }],
} satisfies NonNullable<Metadata['openGraph']>;

/** Absolute URL for a site path such as `/` or `/services/`. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

type PageMetadataInput = {
  /** Short page title; the layout template appends the site name. */
  title: string;
  description: string;
  /** Route path with trailing slash, matching `trailingSlash: true`. */
  path: string;
};

export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphBase,
      // og:title mirrors the rendered <title>, which uses the layout template.
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(path),
    },
  };
}
