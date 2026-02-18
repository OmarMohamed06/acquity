/**
 * SLUG GENERATION LOGIC
 * 
 * Generates stable, unique, SEO-friendly slugs for listings.
 * Slugs are generated once at listing creation and NEVER changed.
 * This ensures URLs remain permanent and don't break SEO.
 * 
 * Format: {listing-title}-{unique-id}
 * Example: "enterprise-payment-gateway-abc123def456"
 */

import {SlugGenerationRequest } from "./types";
import { customAlphabet } from "nanoid";

/**
 * Converts text to URL-safe slug
 * Rules:
 * - Lowercase
 * - Replace spaces and special characters with hyphens
 * - Remove multiple consecutive hyphens
 * - Remove leading/trailing hyphens
 * - Max length 100 characters (leaves room for type + id)
 */
function sanitizeSlugSegment(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces, underscores, and special characters with hyphens
    .replace(/[\s_]/g, "-")
    .replace(/[^\w\-]/g, "")
    // Remove multiple consecutive hyphens
    .replace(/\-{2,}/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^\-+|\-+$/g, "")
    .substring(0, 100);
}


/**
 * Generates a stable, unique slug for a listing
 * 
 * @param request - Slug generation request containing title, type, and ID
 * @returns SEO-friendly slug (e.g., "enterprise-payment-gateway-business-sale-abc123")
 * 
 * IMPORTANT:
 * - Slugs are immutable. Once created, never regenerate or change.
 * - Store the slug in the database at listing creation
 * - Use this slug as the permanent URL identifier
 * - If you need to change a slug, set up a 301 redirect from old to new
 */
export function generateListingSlug(request: SlugGenerationRequest): string {
  const titleSegment = sanitizeSlugSegment(request.listingTitle);
  
  // Extract first 8 characters of ID for brevity
  // Full ID stored separately for uniqueness verification
  const idSegment = request.listingId.substring(0, 8).toLowerCase();

const slug = `${titleSegment}-${idSegment}`;
return slug.substring(0, 120);

}

/**
 * Validates that a slug matches expected format
 * Used to ensure consistency when reading from database
 */
export function validateSlugFormat(slug: string): boolean {
  // Basic format check: should contain hyphens and be URL-safe
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

  return slugRegex.test(slug);
}

/**
 * Parses a slug to extract components
 * Returns null if slug format is invalid
 */
export function parseSlug(slug: string): { title: string; id: string } | null {
  const parts = slug.split("-");
  if (parts.length < 2) return null;

  const id = parts[parts.length - 1];
  const title = parts.slice(0, -1).join(" ");

  return { title, id };
}


/**
 * Generates a deterministic ID for testing
 * In production, use UUID or database auto-increment
 */
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export function generateListingId(): string {
  return nanoid();
}