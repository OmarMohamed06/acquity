/**
 * FOUNDATIONAL TYPE DEFINITIONS
 * 
 * These types are used consistently across routing, slugs, filters, and API endpoints.
 * Changing these types requires a data migration.
 */

/** 
 * Listing types supported by the marketplace
 * These values are used in URLs, database fields, and filters
 * DO NOT CHANGE existing values after launch - only append new types
 */
export const LISTING_TYPES = {
  BUSINESS_SALE: "business_sale",
  FRANCHISE_SALE: "franchise_sale",
  INVESTMENT_OPPORTUNITY: "investment_opportunity",
} as const;

export type ListingType = typeof LISTING_TYPES[keyof typeof LISTING_TYPES];

/**
 * Listing tiers (pricing plans)
 * Used for homepage display, search ranking, and visibility
 */
export const LISTING_PLANS = {
  BASIC: "basic",
  STANDARD: "standard",
  PREMIUM: "premium",
} as const;

export type ListingPlan = typeof LISTING_PLANS[keyof typeof LISTING_PLANS];

/**
 * Core listing data structure
 * Used for creating, storing, and displaying listings
 */
export interface Listing {
  id: string; // Unique identifier (UUID or custom)
  slug: string; // SEO-friendly URL slug (generated once, never changed)
  type: ListingType;
  plan: ListingPlan;
  
  // Core fields
  title: string;
  description?: string;
  category: string;
  
  // Location
  location: string; // Format: "City, Country"
  country: string;
  city: string;
  
  // Pricing/Financial (type-specific)
  price?: number; // business_sale, franchise_sale
  revenue?: number; // business_sale, investment_opportunity
  ebitda?: number; // business_sale
  franchiseFee?: number; // franchise_sale
  unitRevenue?: number; // franchise_sale
  unitProfit?: number; // franchise_sale
  capitalRequired?: number; // investment_opportunity
  equityOffered?: number; // investment_opportunity
  
  // Metadata
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  publishedAt?: string; // When listing became public
  
  // SEO/Visibility
  indexed: boolean; // Whether search engines should index this listing
  featured: boolean; // Whether listing is featured on homepage (premium only)
}

/**
 * Slug generation request
 * Used to create consistent, stable slugs
 */
export interface SlugGenerationRequest {
  listingTitle: string;
  listingType: ListingType;
  listingId: string;
}

/**
 * Route segment patterns
 * Used for validation and type safety
 */
export interface RouteSegments {
  type: ListingType;
  slug: string;
  category?: string;
  filter?: string;
}
