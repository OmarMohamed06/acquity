import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export type ListingType =
  | "business_sale"
  | "franchise_sale"
  | "investment_opportunity";

export type ListingRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  country: string | null;
  type: ListingType;
  status: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export const getListingBySlug = cache(
  async (
    type: ListingType,
    slug: string,
    options?: { includePending?: boolean; allowAnyType?: boolean },
  ) => {
    const query = supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .eq("type", type);

    if (!options?.includePending) {
      query.eq("status", "approved");
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) return data as ListingRecord;

    if (options?.allowAnyType) {
      const fallbackQuery = supabase
        .from("listings")
        .select("*")
        .eq("slug", slug);

      if (!options?.includePending) {
        fallbackQuery.eq("status", "approved");
      }

      const { data: fallbackData, error: fallbackError } =
        await fallbackQuery.maybeSingle();

      if (!fallbackError && fallbackData) {
        return fallbackData as ListingRecord;
      }
    }

    return null;
  },
);

export const getListingCached = cache(getListingBySlug);

export const getListingFinancials = cache(
  async (type: ListingType, listingId: string) => {
    if (type === "business_sale") {
      const { data } = await supabase
        .from("business_sale_details")
        .select("asking_price, annual_revenue, ebitda")
        .eq("listing_id", listingId)
        .maybeSingle();
      return data || null;
    }

    if (type === "franchise_sale") {
      const { data } = await supabase
        .from("franchise_sale_details")
        .select("franchise_fee, avg_unit_revenue, avg_unit_profit")
        .eq("listing_id", listingId)
        .maybeSingle();
      return data || null;
    }

    const { data } = await supabase
      .from("investment_opportunity_details")
      .select("capital_required, annual_revenue, equity_offered_percent")
      .eq("listing_id", listingId)
      .maybeSingle();
    return data || null;
  },
);
