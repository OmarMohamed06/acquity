/**
 * FILTER & QUERY UTILITIES
 * 
 * Standardizes how listing types, filters, and queries are handled
 * across routes, forms, and API endpoints.
 */

import { ListingType, LISTING_TYPES } from "./types";
import { SEGMENT_TO_TYPE, getSegmentFromType } from "./routes";

/**
 * Filter parameters for listings
 * Used in query strings and API calls
 */
export interface ListingFilters {
  type?: ListingType;
  category?: string;
  country?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: "newest" | "price_low" | "price_high" | "relevance";
  page?: number;
}

/**
 * Serializes filters to URL query string
 * 
 * @param filters - Filter object
 * @returns URL query string (without leading ?)
 * 
 * Example: "type=business&country=US&minPrice=100000"
 */
export function serializeFilters(filters: ListingFilters): string {
  const params = new URLSearchParams();
  
  if (filters.type) {
    params.set("type", filters.type);
  }
  if (filters.category) {
    params.set("category", filters.category);
  }
  if (filters.country) {
    params.set("country", filters.country);
  }
  if (filters.city) {
    params.set("city", filters.city);
  }
  if (filters.minPrice !== undefined) {
    params.set("minPrice", filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", filters.maxPrice.toString());
  }
  if (filters.searchQuery) {
    params.set("q", filters.searchQuery);
  }
  if (filters.sortBy) {
    params.set("sort", filters.sortBy);
  }
  if (filters.page) {
    params.set("page", filters.page.toString());
  }
  
  return params.toString();
}

/**
 * Parses URL query string to filter object
 * 
 * @param queryString - URL query string (without leading ?)
 * @returns Parsed filters object
 */
export function deserializeFilters(queryString: string): ListingFilters {
  const params = new URLSearchParams(queryString);
  
  const type = params.get("type");
  const typeValue = type
    ? SEGMENT_TO_TYPE[type as keyof typeof SEGMENT_TO_TYPE]
    : undefined;
  
  return {
    type: typeValue,
    category: params.get("category") || undefined,
    country: params.get("country") || undefined,
    city: params.get("city") || undefined,
    minPrice: params.get("minPrice") ? parseInt(params.get("minPrice")!) : undefined,
    maxPrice: params.get("maxPrice") ? parseInt(params.get("maxPrice")!) : undefined,
    searchQuery: params.get("q") || undefined,
    sortBy: (params.get("sort") as any) || undefined,
    page: params.get("page") ? parseInt(params.get("page")!) : undefined,
  };
}

/**
 * Validates that a listing type is valid
 */
export function isValidListingType(value: any): value is ListingType {
  return Object.values(LISTING_TYPES).includes(value);
}

/**
 * Validates that a type segment is valid
 * Example: "business" is valid, "invalid-type" is not
 */
export function isValidTypeSegment(segment: string): boolean {
  return segment in SEGMENT_TO_TYPE;
}

/**
 * Normalizes listing type from various formats
 * 
 * @param value - Listing type in any format (segment or full type)
 * @returns Normalized ListingType or null if invalid
 * 
 * Examples:
 * - "business" => "business_sale"
 * - "business_sale" => "business_sale"
 * - "invalid" => null
 */
export function normalizeListingType(value: string): ListingType | null {
  // Try direct match first
  if (isValidListingType(value)) {
    return value as ListingType;
  }
  
  // Try segment lookup
  const typeFromSegment = SEGMENT_TO_TYPE[value as keyof typeof SEGMENT_TO_TYPE];
  if (typeFromSegment) {
    return typeFromSegment;
  }
  
  return null;
}

/**
 * Builds a filter URL
 * 
 * @param baseUrl - Base route (e.g., "/listings")
 * @param filters - Filter object
 * @returns Full URL with query string
 * 
 * Example: buildFilterUrl("/listings", { type: "business_sale" })
 * => "/listings?type=business"
 */
export function buildFilterUrl(baseUrl: string, filters: ListingFilters): string {
  const query = serializeFilters(filters);
  return query ? `${baseUrl}?${query}` : baseUrl;
}

/**
 * Creates a filter preset
 * Useful for common filter combinations
 */
export const FILTER_PRESETS = {
  allListings: (): ListingFilters => ({}),
  businessOnly: (): ListingFilters => ({
    type: LISTING_TYPES.BUSINESS_SALE,
  }),
  franchiseOnly: (): ListingFilters => ({
    type: LISTING_TYPES.FRANCHISE_SALE,
  }),
  investmentOnly: (): ListingFilters => ({
    type: LISTING_TYPES.INVESTMENT_OPPORTUNITY,
  }),
  newestFirst: (): ListingFilters => ({
    sortBy: "newest",
  }),
  lowestPrice: (): ListingFilters => ({
    sortBy: "price_low",
  }),
} as const;
