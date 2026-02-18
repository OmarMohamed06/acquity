"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "../lib/formatNumber";
import { INDUSTRIES, COUNTRIES } from "@/app/constants/options";
import { supabase } from "@/lib/supabase/client";
import WaitlistBanner from "@/components/WaitlistBanner";
import { LAUNCH_MODE, MOCK_INVESTMENT_LISTINGS } from "@/app/constants/launch";

// Helper function to convert text to URL slug
const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
};

type Listing = {
  id: string;
  slug?: string;
  type: "business_sale" | "franchise_sale" | "investment_opportunity";
  badge?: string;
  title: string;
  location: string;
  country?: string;
  category?: string;
  subCategory?: string;
  image?: string;
  price?: string;
  revenue?: string;
  ebitda?: string;
  equity?: string;
  plan?: "basic" | "standard" | "premium";
};

export default function InvestmentsForSalePage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [industryExpanded, setIndustryExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [countryExpanded, setCountryExpanded] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const buildFilterUrl = (industry?: string, country?: string): string => {
    const basePath = "/investments-for-sale";
    if (industry && country) {
      return `${basePath}/${toSlug(industry)}/${toSlug(country)}`;
    }
    if (industry) {
      return `${basePath}/${toSlug(industry)}`;
    }
    if (country) {
      return `${basePath}/${toSlug(country)}`;
    }
    return basePath;
  };

  const resetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/investments-for-sale");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceMin, priceMax]);

  useEffect(() => {
    // Skip fetching if in launch mode - use mock data instead
    if (LAUNCH_MODE) {
      setListings(MOCK_INVESTMENT_LISTINGS);
      return;
    }

    const fetchListings = async () => {
      try {
        console.log("Starting to fetch investment listings...");
        // Try fetching with type filter first
        let { data, error } = await supabase
          .from("listings")
          .select(
            `
            *,
            investment_opportunity_details (*)
          `,
          )
          .eq("type", "investment_opportunity");

        console.log("Supabase response:", { dataCount: data?.length, error });

        if (error) {
          console.error("Supabase error:", error);
          return;
        }

        // If no results with investment_opportunity type, try fetching all and filter by investment_details existence
        if (!data || data.length === 0) {
          console.warn(
            "No investment_opportunity type found, fetching all listings with investment_details...",
          );
          const { data: allData, error: allError } = await supabase
            .from("listings")
            .select(
              `
              *,
              investment_details (*)
            `,
            );

          if (allError) {
            console.error("Error fetching all listings:", allError);
            setListings([]);
            return;
          }

          // Filter to only listings that have investment_details
          data =
            allData?.filter(
              (item: any) =>
                item.investment_details && item.investment_details.length > 0,
            ) || [];
          console.log("Found listings with investment_details:", data?.length);
        }

        if (!data || data.length === 0) {
          console.warn("No investment listings found");
          setListings([]);
          return;
        }

        console.log("Processing listings:", data.length);

        const parsed: Listing[] = data.map((listing: any) => {
          const title =
            listing.title ||
            listing.business_name ||
            listing.brand_name ||
            listing.company_name ||
            "Untitled Listing";

          const locationParts = (listing.location || "").split(",");
          const country =
            locationParts.length > 1 ? locationParts[1].trim() : "";

          const details =
            listing.investment_opportunity_details ||
            listing.investment_details ||
            null;

          return {
            id: listing.id,
            slug: listing.slug,
            type: listing.type as "investment_opportunity",
            category: listing.category || listing.industry,
            country: listing.country || country,
            subCategory: "Investment",
            title,
            location: listing.location || "",
            image: listing.image_url || listing.image,
            badge: listing.badge,
            plan: listing.plan,
            price: details?.capital_required || listing.price,
            revenue: details?.annual_revenue || listing.revenue,
            ebitda: listing.ebitda,
            equity: details?.equity_offered_percent || listing.equity,
          };
        });

        setListings(parsed);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const query = searchQuery.toLowerCase();
    const title = listing.title ?? "";
    const location = listing.location ?? "";

    const matchesSearch =
      title.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query);

    const price = Number(listing.price ?? 0);
    const matchesPriceMin = !priceMin || price >= Number(priceMin);
    const matchesPriceMax = !priceMax || price <= Number(priceMax);

    return matchesSearch && matchesPriceMin && matchesPriceMax;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    const planOrder = { premium: 0, standard: 1, basic: 2 };
    const planA = planOrder[a.plan as keyof typeof planOrder] ?? 2;
    const planB = planOrder[b.plan as keyof typeof planOrder] ?? 2;

    if (planA !== planB) return planA - planB;

    switch (sortBy) {
      case "price_low":
        return Number(a.price || 0) - Number(b.price || 0);
      case "price_high":
        return Number(b.price || 0) - Number(a.price || 0);
      case "newest":
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedListings.length / ITEMS_PER_PAGE);
  const paginatedListings = sortedListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white overflow-x-hidden antialiased z-0">
      <header className="sticky top-0 z-40 flex flex-col gap-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:flex-row lg:items-center lg:justify-between lg:whitespace-nowrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <label className="flex flex-col flex-1 !h-10 rounded">
            <div className="flex w-full flex-1 items-stretch rounded h-full">
              <div className="text-gray-500 flex border-none bg-gray-100 dark:bg-gray-800 items-center justify-center pl-3 rounded-l border-r-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-gray-800 focus:border-none h-full placeholder:text-gray-500 px-3 rounded-l-none border-l-0 text-sm font-normal leading-normal"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-screen relative">
        {/* Mobile Filter Overlay */}
        {mobileFilterOpen && (
          <div
            className="fixed inset-0 bg-black/30 lg:hidden z-30"
            onClick={() => setMobileFilterOpen(false)}
          />
        )}

        {/* Sidebar - Desktop visible, Mobile drawer */}
        <aside
          className={`fixed lg:relative lg:z-auto z-40 top-0 left-0 h-full lg:h-auto w-64 lg:w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${
            mobileFilterOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } transition-transform lg:transition-none lg:sticky lg:top-[65px] overflow-y-auto lg:overflow-visible`}
        >
          <div className="p-5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 dark:text-white text-base font-bold">
                Filters
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-blue-600 text-xs font-medium hover:underline"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setIndustryExpanded(!industryExpanded)}
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Industry
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform ${
                    industryExpanded ? "" : "rotate-180"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              {industryExpanded && (
                <div className="flex flex-col gap-1 pl-1">
                  {INDUSTRIES.map((item) => (
                    <Link
                      key={item}
                      href={buildFilterUrl(item, undefined)}
                      className="text-sm py-1 transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            <div className="flex flex-col gap-3">
              <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setCountryExpanded(!countryExpanded)}
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Country
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform ${
                    countryExpanded ? "" : "rotate-180"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              {countryExpanded && (
                <div className="flex flex-col gap-1 pl-1 max-h-60 overflow-y-auto">
                  {COUNTRIES.map((item) => (
                    <Link
                      key={item}
                      href={buildFilterUrl(undefined, item)}
                      className="text-sm py-1 transition-colors text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            <div className="flex flex-col gap-3">
              <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setPriceExpanded(!priceExpanded)}
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Min Investment (USD)
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform ${
                    priceExpanded ? "" : "rotate-180"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              {priceExpanded && (
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      $
                    </span>
                    <input
                      className="w-full pl-5 pr-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-600 focus:ring-0"
                      placeholder="Min"
                      type="number"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative w-full">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      $
                    </span>
                    <input
                      className="w-full pl-5 pr-2 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-600 focus:ring-0"
                      placeholder="Max"
                      type="number"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 lg:bg-gray-50 lg:dark:bg-black">
          {/* Waitlist Banner - Only shown in launch mode */}
          {LAUNCH_MODE && <WaitlistBanner />}

          <div
            className={`px-4 py-6 md:px-6 md:py-8 lg:px-10 max-w-[1400px] mx-auto w-full flex flex-col gap-4 md:gap-6 ${LAUNCH_MODE ? "blur-md pointer-events-none select-none" : ""}`}
          >
            <div className="flex flex-col gap-1 md:gap-2">
              <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-black tracking-tight">
                Investment Opportunities
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Explore high-potential investment opportunities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 lg:gap-3">
              <button
                onClick={() => router.push("/businesses-for-sale")}
                className="h-9 md:h-10 px-3 md:px-6 lg:px-8 rounded text-xs md:text-sm font-bold transition-colors bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 whitespace-nowrap"
              >
                Full Business
              </button>

              <button
                onClick={() => router.push("/franchises-for-sale")}
                className="h-9 md:h-10 px-3 md:px-6 lg:px-8 rounded text-xs md:text-sm font-bold transition-colors bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 whitespace-nowrap"
              >
                Franchises
              </button>

              <button
                onClick={() => router.push("/investments-for-sale")}
                className="h-9 md:h-10 px-3 md:px-6 lg:px-8 rounded text-xs md:text-sm font-bold transition-colors bg-blue-600 text-white shadow-md whitespace-nowrap"
              >
                Investments
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-800 shadow-sm min-w-0">
              <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm font-medium truncate min-w-0 flex-1">
                Showing {sortedListings.length} opportunities
              </p>
              <div className="flex items-center gap-2 xs:gap-3 shrink-0">
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden xs:block"></div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-8 px-2 xs:px-3 rounded text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Low Min</option>
                  <option value="price_high">High Min</option>
                  <option value="revenue_high">Return</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() =>
                    router.push(`/investments-for-sale/listing/${listing.slug}`)
                  }
                >
                  {listing.badge && (
                    <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      {listing.badge}
                    </div>
                  )}
                  {listing.plan === "premium" && (
                    <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-gray-900/30 backdrop-blur-sm text-white text-xs font-bold rounded">
                      EXCLUSIVE
                    </div>
                  )}

                  <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                    {listing.image ? (
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {listing.category && (
                      <div className="inline-flex w-fit">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                          {listing.category}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 line-clamp-1">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                        {listing.country && listing.location
                          ? `${listing.location}, ${listing.country}`
                          : listing.location}
                      </p>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {listing.price && (
                        <div>
                          <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                            Capital Required
                          </p>
                          <p className="font-bold text-blue-700 dark:text-blue-300 truncate">
                            ${formatNumber(Number(listing.price))}
                          </p>
                        </div>
                      )}
                      {listing.revenue && (
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                            Revenue
                          </p>
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            ${formatNumber(Number(listing.revenue))}
                          </p>
                        </div>
                      )}
                      {listing.equity && (
                        <div>
                          <p className="text-green-600 dark:text-green-400 text-xs font-semibold">
                            Equity Offered
                          </p>
                          <p className="font-bold text-green-700 dark:text-green-300 truncate">
                            {listing.equity}%
                          </p>
                        </div>
                      )}
                    </div>

                    <button className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedListings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No investment opportunities found matching your criteria.
                </p>
                <Link
                  href="/investments-for-sale"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Clear all filters
                </Link>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
