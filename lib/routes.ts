/**
 * ROUTE DEFINITIONS
 * 
 * Defines all public (indexable) and private (noindex) routes for the marketplace.
 * SEO strategy:
 * - Public routes: Listings, categories, filters (indexable by search engines)
 * - Private routes: Admin, account, checkout (noindex via robots.txt or meta tag)
 */

import { ListingType, LISTING_TYPES, LISTING_PLANS } from "./types";

/**
 * ROUTE STRUCTURE
 * 
 * Public Routes (Indexable by search engines):
 * - /listings
 * - /listings/:type (filtered by type)
 * - /listings/:type/:slug (individual listing detail)
 * - /category/:name (category page)
 * - /search?q=...&type=...&category=...
 * 
 * Private Routes (Should have noindex meta tag):
 * - /login
 * - /signup
 * - /account
 * - /account/listings
 * - /account/saved
 * - /list-business (form starts, not indexed)
 * - /checkout
 * - /admin/*
 */



/**
 * Type to route segment mapping
 * Used to generate consistent URLs across the app
 */
export const TYPE_TO_SEGMENT = {
  [LISTING_TYPES.BUSINESS_SALE]: "business",
  [LISTING_TYPES.FRANCHISE_SALE]: "franchise",
  [LISTING_TYPES.INVESTMENT_OPPORTUNITY]: "investment",
} as const;

/**
 * Segment to type mapping (reverse lookup)
 * Used to parse URLs back to types
 */
export const SEGMENT_TO_TYPE = {
  business: LISTING_TYPES.BUSINESS_SALE,
  franchise: LISTING_TYPES.FRANCHISE_SALE,
  investment: LISTING_TYPES.INVESTMENT_OPPORTUNITY,
} as const;

export const PUBLIC_ROUTES = {
  // Homepage
  HOME: "/",
  
  // Listings
  LISTINGS_INDEX: "/listings",
  LISTINGS_BY_TYPE: (type: ListingType) =>
  `/listings/${TYPE_TO_SEGMENT[type]}`,
  LISTING_DETAIL: (type: ListingType, slug: string) =>
  `/listings/${TYPE_TO_SEGMENT[type]}/${slug}`,

  
  // Categories (future)
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: (categoryName: string) => `/category/${categoryName}`,
  
  // Search
  SEARCH: "/search",
  SEARCH_WITH_QUERY: (query: string, type?: ListingType) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (type) params.set("type", type);
    return `/search?${params.toString()}`;
  },
} as const;

export const PRIVATE_ROUTES = {
  // Authentication
  LOGIN: "/login",
  SIGNUP: "/signup",
  
  // User Account
  ACCOUNT: "/account",
  ACCOUNT_LISTINGS: "/account/listings",
  ACCOUNT_SAVED: "/account/saved",
  ACCOUNT_SETTINGS: "/account/settings",
  
  // Listing Creation
  LIST_BUSINESS: "/list-business",
  LIST_BUSINESS_STEP: (step: number) => `/list-business?step=${step}`,
  
  // Checkout
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  CHECKOUT_CANCEL: "/checkout/cancel",
  
  // Admin
  ADMIN: "/admin",
  ADMIN_LISTINGS: "/admin/listings",
  ADMIN_USERS: "/admin/users",
} as const;

/**
 * Type-friendly display names
 * Used in UI and breadcrumbs
 */
export const TYPE_DISPLAY_NAMES = {
  [LISTING_TYPES.BUSINESS_SALE]: "Full Business",
  [LISTING_TYPES.FRANCHISE_SALE]: "Franchise",
  [LISTING_TYPES.INVESTMENT_OPPORTUNITY]: "Investment Seeking",
} as const;

/**
 * Plan-friendly display names
 */
export const PLAN_DISPLAY_NAMES = {
  [LISTING_PLANS.BASIC]: "Basic",
  [LISTING_PLANS.STANDARD]: "Standard",
  [LISTING_PLANS.PREMIUM]: "Premium",
} as const;

/**
 * API ROUTES (Server-side)
 * These are only used for API calls, not public URLs
 */
export const API_ROUTES = {
  // Listings
  GET_LISTING: (id: string) => `/api/listings/${id}`,
  GET_LISTINGS: (type?: ListingType) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    return `/api/listings?${params.toString()}`;
  },
  CREATE_LISTING: "/api/listings",
  UPDATE_LISTING: (id: string) => `/api/listings/${id}`,
  DELETE_LISTING: (id: string) => `/api/listings/${id}`,
  
  // Search
  SEARCH_LISTINGS: "/api/search",
  
  // Categories
  GET_CATEGORIES: "/api/categories",
  
  // Auth
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  
  // User
  GET_CURRENT_USER: "/api/user/me",
  UPDATE_USER: "/api/user",
  GET_USER_LISTINGS: "/api/user/listings",
} as const;

/**
 * Validates that a route is public (indexable)
 * Used for SEO meta tag generation
 */
export function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;

  const publicPrefixes = [
    "/listings",
    "/categories",
    "/category/",
    "/search",
  ];

  return publicPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
}
/**
 * Validates that a route is private (noindex)
 * Used for SEO meta tag generation
 */
export function isPrivateRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

/**
 * Gets the type from a URL segment
 * Example: "business" => LISTING_TYPES.BUSINESS_SALE
 */
export function getTypeFromSegment(segment: string): ListingType | null {
  return SEGMENT_TO_TYPE[segment as keyof typeof SEGMENT_TO_TYPE] || null;
}

/**
 * Gets the URL segment from a type
 * Example: LISTING_TYPES.BUSINESS_SALE => "business"
 */
export function getSegmentFromType(type: ListingType): string {
  return TYPE_TO_SEGMENT[type];
}
