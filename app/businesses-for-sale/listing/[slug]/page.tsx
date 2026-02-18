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
  price?: number;
  revenue?: number;
  ebitda?: number;
  cash_flow?: number;
  established_year?: number;
  employees_count?: number;
  owner_involvement?: string;
  reason_for_sale?: string;
  created_at: string;
}

export default function ListingDetailPage() {
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
          .eq("type", "business_sale")
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

        if (data.type === "business_sale") {
          // Fetch business-specific financial details
          const { data: businessDetails } = await supabase
            .from("business_sale_details")
            .select("*")
            .eq("listing_id", data.id)
            .maybeSingle();

          if (businessDetails) {
            enrichedData = {
              ...enrichedData,
              city: parsedCity,
              price: businessDetails.asking_price,
              revenue: businessDetails.annual_revenue,
              ebitda: businessDetails.ebitda,
              cash_flow: businessDetails.annual_cashflow,
              established_year: businessDetails.year_established,
              employees_count: businessDetails.employees_count,
              reason_for_sale: businessDetails.reason_for_sale,
              owner_involvement: businessDetails.owner_involvement,
            };
          }
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
            href="/businesses-for-sale"
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
    "https://via.placeholder.com/1200x600?text=Business+Image";

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
              href="/businesses-for-sale"
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Businesses for Sale
            </Link>
            <span>/</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Link
              href={`/businesses-for-sale/${toSlug(listing.category)}`}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              {listing.category}
            </Link>
            <span>/</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Link
              href={`/businesses-for-sale/${toSlug(listing.category)}/${toSlug(listing.country)}`}
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

            {/* Business Description */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Business Description
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                <p>{listing.description || "No description available."}</p>
              </div>
            </section>

            {/* Value Proposition */}
            {(listing.reason_for_sale || listing.owner_involvement) && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Value Proposition
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listing.reason_for_sale && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600"
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
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          Reason For Sale
                        </h3>
                        <p className="text-xs text-gray-600 capitalize">
                          {listing.reason_for_sale}
                        </p>
                      </div>
                    </div>
                  )}
                  {listing.owner_involvement && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          Owner Involvement
                        </h3>
                        <p className="text-xs text-gray-600 capitalize">
                          {listing.owner_involvement?.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Operational Details */}
            {(listing.established_year || listing.employees_count) && (
              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Operational Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  {listing.established_year && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Year Established</span>
                      <span className="font-semibold text-gray-900">
                        {listing.established_year}
                      </span>
                    </div>
                  )}
                  {listing.employees_count && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Number of Employees</span>
                      <span className="font-semibold text-gray-900">
                        {listing.employees_count}
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
                {listing.price && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Asking Price
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      ${formatNumber(listing.price)}
                    </div>
                  </div>
                )}
                {listing.revenue && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Revenue
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      ${formatNumber(listing.revenue)}
                    </div>
                  </div>
                )}
                {listing.ebitda && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      EBITDA
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      ${formatNumber(listing.ebitda)}
                    </div>
                  </div>
                )}
                {listing.cash_flow && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase mb-1">
                      Cash Flow
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ${formatNumber(listing.cash_flow)}
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
                  CONTACT SELLER
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
                    SERIOUS BUYERS
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This listing is restricted to verified users. Create a buyer
                    profile to view financials and contact sellers.
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
                  <h3 className="font-bold text-sm mb-2">MARKET</h3>
                  <p className="text-xs leading-relaxed opacity-90">
                    Discover promising business opportunities in the
                    marketplace. Connect with sellers and find the perfect
                    acquisition.
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
