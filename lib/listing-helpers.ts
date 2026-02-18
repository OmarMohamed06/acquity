/**
 * Listing Detail Fetcher
 * Utility functions for fetching listing details by slug
 */

import { supabase } from "@/lib/supabase/client";

export interface ListingDetailResponse {
  listing: any;
  operational: any | null;
  financials: any | null;
  error: string | null;
}

/**
 * Fetch complete listing details by slug
 * Includes main listing, operational details, and financial data
 */
export async function fetchListingBySlug(
  slug: string,
): Promise<ListingDetailResponse> {
  try {
    // 1. Fetch main listing by slug
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .single();

    if (listingError || !listing) {
      return {
        listing: null,
        operational: null,
        financials: null,
        error: "Listing not found",
      };
    }

    // 2. Fetch operational details (if available)
    const { data: operational } = await supabase
      .from("listing_operational")
      .select("*")
      .eq("listing_id", listing.id)
      .maybeSingle();

    // 3. Fetch financial details (if available)
    const { data: financials } = await supabase
      .from("listing_financials")
      .select("*")
      .eq("listing_id", listing.id)
      .maybeSingle();

    return {
      listing,
      operational,
      financials,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return {
      listing: null,
      operational: null,
      financials: null,
      error: error.message || "Failed to fetch listing",
    };
  }
}

/**
 * Fetch listing by ID
 */
export async function fetchListingById(
  listingId: string,
): Promise<ListingDetailResponse> {
  try {
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      return {
        listing: null,
        operational: null,
        financials: null,
        error: "Listing not found",
      };
    }

    const { data: operational } = await supabase
      .from("listing_operational")
      .select("*")
      .eq("listing_id", listing.id)
      .maybeSingle();

    const { data: financials } = await supabase
      .from("listing_financials")
      .select("*")
      .eq("listing_id", listing.id)
      .maybeSingle();

    return {
      listing,
      operational,
      financials,
      error: null,
    };
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return {
      listing: null,
      operational: null,
      financials: null,
      error: error.message || "Failed to fetch listing",
    };
  }
}

/**
 * Generate slug for a new listing
 * Format: title-id (first 8 chars of id)
 */
export function generateSlug(title: string, id: string): string {
  const slugTitle = title
    .toLowerCase()
    .trim()
    .replace(/[\s_]/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/\-{2,}/g, "-")
    .replace(/^\-+|\-+$/g, "")
    .substring(0, 100);

  const slugId = id.substring(0, 8).toLowerCase();
  return `${slugTitle}-${slugId}`;
}
