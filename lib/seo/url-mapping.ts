/**
 * SEO URL Mapping Utilities
 * Maps between clean SEO-friendly routes and filter parameters
 * Handles canonical URL generation and robots directives
 */

export type ListingType = "businesses" | "franchises" | "investments";

// Map display names to route segments
export const TYPE_SEGMENT_MAP: Record<string, string> = {
  business_sale: "businesses",
  franchise_sale: "franchises",
  investment_opportunity: "investments",
};

// Reverse mapping
export const SEGMENT_TYPE_MAP: Record<string, string> = {
  businesses: "business_sale",
  franchises: "franchise_sale",
  investments: "investment_opportunity",
};

/**
 * Convert filter values to URL-safe slugs
 */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Convert URL slug back to display value
 */
export function fromSlug(slug: string): string {
  return slug.replace(/-/g, " ");
}

/**
 * Generate clean SEO-friendly URL from filters
 * Priority: type > country > industry (hierarchical structure)
 */
export function generateCleanUrl(params: {
  type: string; // business_sale, franchise_sale, investment_opportunity
  country?: string;
  industry?: string;
}): string {
  const { type, country, industry } = params;
  const typeSegment = TYPE_SEGMENT_MAP[type] || "businesses";

  let path = `/listings/${typeSegment}`;

  // Add country segment if present
  if (country) {
    path += `/${toSlug(country)}`;
  }

  // Add industry segment if present AND country is present
  // Industry requires country in URL hierarchy for SEO
  if (country && industry) {
    path += `/${toSlug(industry)}`;
  }

  return path;
}

/**
 * Parse clean URL segments into filter params
 */
export function parseCleanUrl(segments: {
  type: string;
  country?: string;
  industry?: string;
}): {
  type: string;
  country?: string;
  industry?: string;
} {
  const { type, country, industry } = segments;

  return {
    type: SEGMENT_TYPE_MAP[type] || "business_sale",
    country: country ? fromSlug(country) : undefined,
    industry: industry ? fromSlug(industry) : undefined,
  };
}

/**
 * Generate canonical URL for a given page
 * - Clean routes get their own URL as canonical
 * - Query param routes get the closest clean route as canonical
 */
export function generateCanonicalUrl(params: {
  type: string;
  country?: string;
  industry?: string;
  hasQueryParams?: boolean; // e.g., price filters, search query
}): string {
  const { type, country, industry, hasQueryParams } = params;

  // If using query params, canonical should point to clean route
  if (hasQueryParams) {
    return generateCleanUrl({ type, country, industry });
  }

  // Otherwise, canonical is the clean URL itself
  return generateCleanUrl({ type, country, industry });
}

/**
 * Determine robots directive based on URL type
 * - Clean routes: index, follow
 * - Query param routes: noindex, follow (to prevent duplicate content)
 * - Empty pages: noindex, follow
 */
export function getRobotsDirective(params: {
  hasQueryParams?: boolean;
  hasContent?: boolean;
  currentPage?: number;
}): string {
  const { hasQueryParams, hasContent, currentPage } = params;

  // Paginated pages (page 2+): noindex to prevent duplicate content
  if (currentPage && currentPage > 1) {
    return "noindex, follow";
  }

  // Query param filtered pages: noindex to consolidate ranking signals
  if (hasQueryParams) {
    return "noindex, follow";
  }

  // Empty pages: noindex to avoid thin content
  if (hasContent === false) {
    return "noindex, follow";
  }

  // Clean routes with content: index and follow
  return "index, follow";
}

/**
 * Build query string from additional filters (non-SEO filters)
 * Used for price, revenue, search query, etc.
 */
export function buildQueryString(filters: Record<string, any>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Check if URL has non-SEO query parameters
 * SEO params: type, country, industry (handled via path segments)
 * Non-SEO params: price, revenue, search, etc. (handled via query string)
 */
export function hasNonSeoQueryParams(searchParams: URLSearchParams): boolean {
  const seoParams = new Set(["type", "country", "industry"]);

  for (const key of searchParams.keys()) {
    if (!seoParams.has(key)) {
      return true;
    }
  }

  return false;
}

/**
 * Example usage:
 *
 * // Generate clean URL
 * const url = generateCleanUrl({
 *   type: "business_sale",
 *   country: "United Arab Emirates",
 *   industry: "Retail"
 * });
 * // Result: "/listings/businesses/united-arab-emirates/retail"
 *
 * // Parse clean URL
 * const filters = parseCleanUrl({
 *   type: "businesses",
 *   country: "united-arab-emirates",
 *   industry: "retail"
 * });
 * // Result: { type: "business_sale", country: "United Arab Emirates", industry: "Retail" }
 *
 * // Get robots directive
 * const robots = getRobotsDirective({
 *   hasQueryParams: true,
 *   hasContent: true
 * });
 * // Result: "noindex, follow" (because of query params)
 */
