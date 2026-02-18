/**
 * SEO & METADATA UTILITIES
 *
 * Generates SEO-compliant metadata for public and private routes.
 * Does NOT include content copy or OG images (focus is structure only).
 */

import { Listing, ListingType } from "./types";
import { TYPE_DISPLAY_NAMES } from "./routes";

/**
 * SEO Metadata for a page
 * Minimal structure focusing on indexing and canonicals
 */
export interface SEOMetadata {
  // Core metadata
  title: string;
  description?: string;
  canonical: string;

  // Indexing
  robots: {
    index: boolean; // true for public routes, false for private
    follow: boolean; // true for all routes
    nosnippet?: boolean; // false by default
    noarchive?: boolean; // false by default
  };

  // Structure
  ogType: "website" | "article" | "product";
  schema?: Record<string, any>; // JSON-LD structured data
}

/**
 * Generates SEO metadata for a listing detail page
 *
 * @param listing - The listing object
 * @param baseUrl - Domain URL (e.g., "https://example.com")
 * @returns SEO metadata object
 */
export function getListingSEOMetadata(
  listing: Listing,
  baseUrl: string
): SEOMetadata {
  const url = `${baseUrl}/listings/${listing.type}/${listing.slug}`;

  return {
    title: listing.title,
    description:
      listing.description ||
      `Explore this ${TYPE_DISPLAY_NAMES[listing.type]} opportunity.`,
    canonical: url,
    robots: {
      index: listing.indexed, // Respect listing's indexing preference
      follow: true,
    },
    ogType: "article",
    schema: {
      "@context": "https://schema.org",
      "@type": "Offer",
      itemOffered: {
        "@type": "Organization",
        name: listing.title,
      },

      name: listing.title,
      description: listing.description,
      priceCurrency: "USD",
      price: listing.price || listing.franchiseFee || listing.capitalRequired,
      availabilityUrl: url,
      areaServed: listing.country,
    },
  };
}

/**
 * Generates SEO metadata for a listings index page
 *
 * @param type - Listing type filter (optional)
 * @param baseUrl - Domain URL
 * @returns SEO metadata object
 */
export function getListingsIndexSEOMetadata(
  type?: ListingType,
  baseUrl?: string
): SEOMetadata {
  const typeName = type ? TYPE_DISPLAY_NAMES[type] : "All Listings";
  const url = type ? `${baseUrl}/listings/${type}` : `${baseUrl}/listings`;

  return {
    title: `Browse ${typeName}`,
    description: `Explore ${typeName.toLowerCase()} on our marketplace`,
    canonical: url,
    robots: {
      index: false,
      follow: true,
    },

    ogType: "website",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${typeName} Listings`,
      url,
    },
  };
}

/**
 * Generates SEO metadata for a search results page
 *
 * @param query - Search query
 * @param baseUrl - Domain URL
 * @returns SEO metadata object
 */
export function getSearchSEOMetadata(
  query: string,
  baseUrl: string
): SEOMetadata {
  const url = `${baseUrl}/search?q=${encodeURIComponent(query)}`;

  return {
    title: `Search: "${query}"`,
    canonical: url,
    robots: {
      index: false,
      follow: true,
    },
    ogType: "website",
    schema: {
      "@context": "https://schema.org",
      "@type": "SearchResultsPage",
      url,
    },
  };
}

/**
 * Generates SEO metadata for private routes
 * All private routes should have noindex
 */
export function getPrivateRouteSEOMetadata(
  pathname: string,
  title: string
): SEOMetadata {
  return {
    title,
    canonical: pathname,
    robots: {
      index: false, // Private routes should NOT be indexed
      follow: false,
    },
    ogType: "website",
  };
}

/**
 * Generates robots.txt directives
 * Tells search engines which routes to crawl/index
 */
export function getRobotsTxtContent(baseUrl: string): string {
  return `# Robots.txt
# Generated for marketplace SEO

User-agent: *
Allow: /
Allow: /listings
Allow: /search
Allow: /category/
Allow: /categories

# Disallow private/admin routes
Disallow: /admin/
Disallow: /account/
Disallow: /login
Disallow: /signup
Disallow: /list-business
Disallow: /checkout
Disallow: /api/

# Crawl delay (optional - adjust as needed)
Crawl-delay: 1

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * Generates a sitemap entry for a listing
 * Used to build dynamic sitemaps
 */
export interface SitemapEntry {
  loc: string; // URL
  lastmod: string; // ISO 8601 date
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number; // 0.0 to 1.0
}

export function getListingSitemapEntry(
  listing: Listing,
  baseUrl: string
): SitemapEntry {
  return {
    loc: `${baseUrl}/listings/${listing.type}/${listing.slug}`,
    lastmod: new Date(listing.updatedAt).toISOString().split("T")[0],
    changefreq: "weekly",
    priority: listing.plan === "premium" ? 0.9 : 0.7,
  };
}

export function getListingsIndexSitemapEntry(baseUrl: string): SitemapEntry {
  return {
    loc: `${baseUrl}/listings`,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "daily",
    priority: 1.0,
  };
}

/**
 * Validates canonical URLs to prevent duplicate content
 * Returns true if the canonical URL is valid and properly formatted
 */
export function validateCanonicalUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
