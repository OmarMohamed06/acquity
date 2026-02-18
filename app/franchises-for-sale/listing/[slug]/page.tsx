"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase/client";
import { formatNumber } from "@/app/lib/formatNumber";
import { useAuth } from "@/app/context/AuthContext";

const ContactModal = dynamic(() => import("@/components/ContactModal"), {
  ssr: false,
  loading: () => null,
});

interface ListingDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  location: string;
  country: string;
  city: string;
  type: string;
  image_url?: string;
  image?: string;
  franchiseFee?: number;
  royaltyFee?: number;
  unitRevenue?: number;
  unitProfit?: number;
  unitCashFlow?: number;
  supportProvided?: string;
  yearEstablished?: number;
  totalUnits?: number;
  targetSegment?: string;
  totalSetupCost?: number;
  created_at: string;
}

export default function FranchiseListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { slug } = useParams<{ slug: string }>();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch listing by slug
        const { data, error: fetchError } = await supabase
          .from("listings")
          .select("*")
          .eq("slug", slug)
          .eq("type", "franchise_sale")
          .single();

        if (fetchError || !data) {
          setError("Listing not found");
          setLoading(false);
          return;
        }

        // Fetch additional details based on listing type
        let enrichedData = { ...data };

        // Parse city from location (format: "city, country")
        const locationParts = (data.location || "").split(",");
        const parsedCity = locationParts[0]?.trim() || "";

        enrichedData = {
          ...enrichedData,
          city: parsedCity,
        };

        if (data.type === "franchise_sale") {
          // Fetch franchise-specific details (new table)
          const { data: franchiseDetails } = await supabase
            .from("franchise_sale_details")
            .select("*")
            .eq("listing_id", data.id)
            .maybeSingle();

          // Fallback to legacy table if needed
          const { data: legacyDetails } = franchiseDetails
            ? { data: null }
            : await supabase
                .from("franchise_details")
                .select("*")
                .eq("listing_id", data.id)
                .maybeSingle();

          const details = franchiseDetails || legacyDetails || {};

          enrichedData = {
            ...enrichedData,
            franchiseFee:
              details.franchise_fee ??
              details.franchiseFee ??
              enrichedData.franchiseFee,
            royaltyFee:
              details.royalty_fee_percent ??
              details.royalty_fee ??
              details.royaltyFee ??
              enrichedData.royaltyFee,
            unitRevenue:
              details.avg_unit_revenue ??
              details.unit_revenue ??
              details.unitRevenue ??
              enrichedData.unitRevenue,
            unitProfit:
              details.avg_unit_profit ??
              details.unit_profit ??
              details.unitProfit ??
              enrichedData.unitProfit,
            unitCashFlow:
              details.avg_unit_cash_flow ??
              details.unit_cash_flow ??
              details.unitCashFlow ??
              enrichedData.unitCashFlow,
            supportProvided:
              details.support_provided ??
              details.supportProvided ??
              enrichedData.supportProvided,
            yearEstablished:
              details.year_founded ??
              details.year_established ??
              details.yearEstablished ??
              enrichedData.yearEstablished,
            totalUnits:
              details.total_units ??
              details.totalUnits ??
              enrichedData.totalUnits,
            targetSegment:
              details.target_customer ??
              details.targetSegment ??
              enrichedData.targetSegment,
            totalSetupCost:
              details.total_setup_cost ??
              details.totalSetupCost ??
              enrichedData.totalSetupCost,
          };
        }

        setListing(enrichedData);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Listing not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The listing you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/franchises-for-sale"
            className="inline-block bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl =
    listing.image_url ||
    listing.image ||
    "https://via.placeholder.com/1200x600?text=Franchise+Image";

  // Convert to URL-friendly slug
  const toSlug = (str: string) =>
    str
      ?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters first
      .replace(/\s+/g, "-") // Convert spaces to hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim() || "";

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 overflow-x-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Link
              href="/"
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Home
            </Link>
            <span>/</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Link
              href="/franchises-for-sale"
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Franchises for Sale
            </Link>
            <span>/</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Link
              href={`/franchises-for-sale/${toSlug(listing.category)}`}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              {listing.category}
            </Link>
            <span>/</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Link
              href={`/franchises-for-sale/${toSlug(listing.category)}/${toSlug(listing.country)}`}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              {listing.country}
            </Link>
            <span>/</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-medium text-gray-900">{listing.title}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {listing.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {listing.city}, {listing.country}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                  {listing.category}
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="h-[420px] rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Franchise Description */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Franchise Description
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                <p>{listing.description || "No description available."}</p>
                {listing.targetSegment && (
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <p className="text-xs text-gray-500 uppercase mb-2">
                      Target Customer
                    </p>
                    <p className="text-gray-700 capitalize">
                      {listing.targetSegment}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Support & Details */}
            {listing.supportProvided && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Support Provided
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(listing.supportProvided)
                    ? listing.supportProvided
                    : listing.supportProvided.split(",").map((s) => s.trim())
                  ).map((support, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md"
                    >
                      <svg
                        className="w-4 h-4 text-blue-600 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-gray-700 capitalize">
                        {support}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Franchise Details */}
            {(listing.yearEstablished || listing.totalUnits) && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Franchise Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  {listing.yearEstablished && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Year Established</span>
                      <span className="font-semibold text-gray-900">
                        {listing.yearEstablished}
                      </span>
                    </div>
                  )}
                  {listing.totalUnits && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Total Units</span>
                      <span className="font-semibold text-gray-900">
                        {listing.totalUnits}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Unit Cash Flow Details */}
            {(listing.unitCashFlow || listing.totalSetupCost) && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Unit Economics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  {listing.totalSetupCost && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Total Setup Cost</span>
                      <span className="font-semibold text-gray-900">
                        ${formatNumber(listing.totalSetupCost)}
                      </span>
                    </div>
                  )}
                  {listing.unitCashFlow && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">
                        Average Unit Cash Flow
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${formatNumber(listing.unitCashFlow)}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT: sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Financial Summary Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {listing.franchiseFee && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Franchise Fee
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      ${formatNumber(listing.franchiseFee)}
                    </div>
                  </div>
                )}
                {listing.royaltyFee && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Royalty Fee
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {listing.royaltyFee}%
                    </div>
                  </div>
                )}
                {listing.unitRevenue && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Avg Unit Revenue
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      ${formatNumber(listing.unitRevenue)}
                    </div>
                  </div>
                )}
                {listing.unitProfit && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Avg Unit Profit
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ${formatNumber(listing.unitProfit)}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gray-900 text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  CONTACT FRANCHISOR
                </button>
              </div>
            </div>

            {/* Serious Buyers Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <svg
                  className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">
                    SERIOUS FRANCHISEES
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This listing is restricted to verified users. Create a buyer
                    profile to view financials and contact franchisors.
                  </p>
                </div>
              </div>
            </div>

            {/* Market Info Card */}
            <div className="bg-blue-900 text-white rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-sm mb-2">MARKETPLACE</h3>
                  <p className="text-xs leading-relaxed opacity-90">
                    Discover promising franchise opportunities in the
                    marketplace. Connect with franchisors and grow your
                    business.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          listing={listing}
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          requiredAuth={!user}
        />
      )}
    </main>
  );
}
