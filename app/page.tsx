"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { formatNumber } from "@/app/lib/formatNumber";
import { supabase } from "@/lib/supabase/client";
import WaitlistBanner from "@/components/WaitlistBanner";
import { LAUNCH_MODE, MOCK_BUSINESS_LISTINGS } from "@/app/constants/launch";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [premiumListings, setPremiumListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const SHOW_RECENT_LISTINGS_BETA = true;

  useEffect(() => {
    // Skip fetching if in launch mode - use mock data instead
    if (LAUNCH_MODE) {
      setPremiumListings(MOCK_BUSINESS_LISTINGS.slice(0, 6));
      setLoading(false);
      return;
    }

    const fetchFeaturedListings = async () => {
      try {
        setLoading(true);
        // Beta mode: show most recent 6 approved listings
        const listingsQuery = supabase
          .from("listings")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        const { data: listingsData, error: listingsError } =
          SHOW_RECENT_LISTINGS_BETA
            ? await listingsQuery.limit(6)
            : await listingsQuery.eq("plan", "premium");

        if (listingsError) {
          console.error("Error fetching premium listings:", listingsError);
          setPremiumListings([]);
          return;
        }

        // Enrich with financial details based on listing type
        const enrichedListings = await Promise.all(
          (listingsData || []).map(async (listing: any) => {
            let raw = {} as any;

            if (listing.type === "business_sale") {
              const { data: details } = await supabase
                .from("business_sale_details")
                .select("asking_price, annual_revenue, ebitda")
                .eq("listing_id", listing.id)
                .maybeSingle();
              raw = details || {};
              console.log(
                `[Business] Listing ${listing.id}: ${JSON.stringify(raw)}`,
              );
            } else if (listing.type === "franchise_sale") {
              const { data: details } = await supabase
                .from("franchise_sale_details")
                .select(
                  "franchise_fee, avg_unit_revenue, avg_unit_profit, support_provided",
                )
                .eq("listing_id", listing.id)
                .maybeSingle();
              raw = details || {};
              console.log(
                `[Franchise] Listing ${listing.id}: ${JSON.stringify(raw)}`,
              );
            } else if (listing.type === "investment_opportunity") {
              const { data: details } = await supabase
                .from("investment_opportunity_details")
                .select(
                  "capital_required, annual_revenue, equity_offered_percent",
                )
                .eq("listing_id", listing.id)
                .maybeSingle();
              raw = details || {};
              console.log(
                `[Investment] Listing ${listing.id}: ${JSON.stringify(raw)}`,
              );
            }

            return {
              ...listing,
              raw,
            };
          }),
        );

        setPremiumListings(enrichedListings);
      } catch (error) {
        console.error("Error fetching premium listings:", error);
        setPremiumListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  const handleListBusiness = () => {
    if (!user) {
      router.push("/login?next=/list-business");
    } else {
      router.push("/list-business");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full bg-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Global Marketplace
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] tracking-tight leading-[1.1] mb-6">
              Buy. Sell. Invest in <br />
              <span className="text-primary">Businesses Globally.</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-slate max-w-2xl mb-10 leading-relaxed font-light">
              Verified business, franchise, and investment listings across
              emerging markets. Connect with serious buyers and vetted sellers
              in MENA, GCC, Africa, Asia, and the Americas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={handleListBusiness}
                className="flex items-center justify-center rounded-sm bg-primary text-white text-base font-bold h-12 px-8 shadow-premium hover:shadow-premium-hover hover:bg-primary-dark transition-all"
              >
                List Your Business
              </button>
              <Link href="/businesses-for-sale">
                <button className="flex items-center justify-center rounded-sm bg-white border border-gray-200 text-gray-800 text-base font-bold h-12 px-8 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  Browse Opportunities
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <section className="py-24 bg-background-off">
        {/* Waitlist Banner - Only shown in launch mode */}
        {LAUNCH_MODE && <WaitlistBanner />}

        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${LAUNCH_MODE ? "mt-12" : ""}`}
        >
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Featured Opportunities
              </h2>
              <p className="text-neutral-slate mt-2">
                {premiumListings.length > 0
                  ? SHOW_RECENT_LISTINGS_BETA
                    ? "Free for a limited beta period — showing the 6 most recent listings."
                    : `${premiumListings.length} premium listing${
                        premiumListings.length !== 1 ? "s" : ""
                      } featured on our marketplace.`
                  : "Hand-picked high-value listings verified by our team."}
              </p>
            </div>
            <Link
              href="/businesses-for-sale"
              className="hidden sm:flex items-center text-primary font-semibold hover:text-primary-dark group"
            >
              View all listings
              <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          {/* Blur the entire listing grid when in launch mode */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${LAUNCH_MODE ? "blur-md pointer-events-none select-none" : ""}`}
          >
            {premiumListings.length > 0 ? (
              premiumListings.map((listing) => {
                // Map listing type to route
                const typeToRoute: { [key: string]: string } = {
                  business_sale: "businesses-for-sale",
                  franchise_sale: "franchises-for-sale",
                  investment_opportunity: "investments-for-sale",
                };
                const route =
                  typeToRoute[listing.type] || "businesses-for-sale";
                const href = `/${route}/listing/${listing.slug}`;

                return (
                  <Link
                    key={listing.id}
                    href={href}
                    className="group bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-premium-hover transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                      {listing.image_url ? (
                        <img
                          src={listing.image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl opacity-10">
                            {listing.type === "business_sale"
                              ? "🏢"
                              : listing.type === "franchise_sale"
                                ? "🍽️"
                                : "📈"}
                          </span>
                        </div>
                      )}
                      <span
                        className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          listing.type === "business_sale"
                            ? "bg-blue-50 text-blue-700"
                            : listing.type === "franchise_sale"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {listing.type === "business_sale" && (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                            Full Business
                          </>
                        )}
                        {listing.type === "franchise_sale" && (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
                            </svg>
                            Franchise
                          </>
                        )}
                        {listing.type === "investment_opportunity" && (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                            </svg>
                            Investment
                          </>
                        )}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {listing.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <svg
                          className="w-4 h-4"
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
                        {listing.location}
                        {listing.country && `, ${listing.country}`}
                      </div>

                      {/* BUSINESS SALE - Price, Revenue, EBITDA */}
                      {listing.type === "business_sale" && (
                        <div className="grid grid-cols-3 gap-3 border-y border-gray-100 py-4 mb-4 flex-1">
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">
                              Price
                            </p>
                            <p className="text-base font-bold text-primary">
                              $
                              {formatNumber(
                                Number(listing.raw?.asking_price || 0),
                              )}
                            </p>
                          </div>
                          <div className="pl-3 border-l border-gray-100">
                            <p className="text-[10px] uppercase text-gray-400 font-bold">
                              Revenue
                            </p>
                            <p className="text-base font-semibold text-gray-900">
                              $
                              {formatNumber(
                                Number(listing.raw?.annual_revenue || 0),
                              )}
                            </p>
                          </div>
                          <div className="pl-3 border-l border-gray-100">
                            <p className="text-[10px] uppercase text-green-600 font-bold">
                              EBITDA
                            </p>
                            <p className="text-green-600 font-semibold">
                              ${formatNumber(Number(listing.raw?.ebitda || 0))}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* FRANCHISE - Fee, Unit Revenue, Unit Profit */}
                      {listing.type === "franchise_sale" && (
                        <div className="grid grid-cols-3 gap-3 border-y border-gray-100 py-4 mb-4 flex-1">
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">
                              Franchise Fee
                            </p>
                            <p className="text-base font-bold text-primary">
                              $
                              {formatNumber(
                                Number(listing.raw?.franchise_fee || 0),
                              )}
                            </p>
                          </div>
                          <div className="pl-3 border-l border-gray-100">
                            <p className="text-[10px] uppercase text-gray-400 font-bold">
                              Unit Revenue
                            </p>
                            <p className="text-base font-semibold text-gray-900">
                              $
                              {formatNumber(
                                Number(listing.raw?.avg_unit_revenue || 0),
                              )}
                            </p>
                          </div>
                          <div className="pl-3 border-l border-gray-100">
                            <p className="text-[10px] uppercase text-green-600 font-bold">
                              Unit Profit
                            </p>
                            <p className="text-green-600 font-semibold">
                              $
                              {formatNumber(
                                Number(listing.raw?.avg_unit_profit || 0),
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* INVESTMENT - Capital Seeking, Revenue, Equity */}
                      {listing.type === "investment_opportunity" && (
                        <div className="grid grid-cols-3 gap-3 border-y border-gray-100 py-4 mb-4 flex-1">
                          <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">
                              Seeking
                            </p>
                            <p className="text-base font-bold text-primary">
                              $
                              {formatNumber(
                                Number(listing.raw?.capital_required || 0),
                              )}
                            </p>
                          </div>
                          <div className="pl-3 border-l border-gray-100">
                            <p className="text-[10px] uppercase text-gray-400 font-bold">
                              Revenue
                            </p>
                            <p className="text-base font-semibold text-gray-900">
                              $
                              {formatNumber(
                                Number(listing.raw?.annual_revenue || 0),
                              )}
                            </p>
                          </div>
                          <div className="pl-3 border-l border-gray-100">
                            <p className="text-[10px] uppercase text-blue-600 font-bold">
                              Equity
                            </p>
                            <p className="text-blue-600 font-semibold">
                              {listing.raw?.equity_offered_percent || "-"}%
                            </p>
                          </div>
                        </div>
                      )}

                      <button className="w-full py-2.5 rounded-sm bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                        View Details
                      </button>
                    </div>
                  </Link>
                );
              })
            ) : !loading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No premium listings available at the moment.
                </p>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading premium listings...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Market Insights
            </h2>
            <p className="text-[11px] text-gray-400 mt-2">
              Figures shown are directional estimates compiled from industry
              sources and may vary by sector and region.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Insight 1 */}
            <div className="p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Avg. Exit Multiples
                </h4>
                <span className="material-symbols-outlined text-green-500">
                  trending_up
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">3.7x</span>
                <span className="text-sm font-medium text-gray-500">
                  Stable YoY
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Median EBITDA multiple for lower middle-market private
                businesses globally (2024 industry estimate).
              </p>
              <div className="h-24 w-full flex items-end justify-between gap-1">
                <div className="w-full bg-blue-50 h-[40%] rounded-t-sm relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Q1
                  </div>
                </div>
                <div className="w-full bg-blue-100 h-[55%] rounded-t-sm relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Q2
                  </div>
                </div>
                <div className="w-full bg-blue-200 h-[45%] rounded-t-sm relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Q3
                  </div>
                </div>
                <div className="w-full bg-blue-300 h-[65%] rounded-t-sm relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Q4
                  </div>
                </div>
                <div className="w-full bg-primary h-[80%] rounded-t-sm relative group">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Q1
                  </div>
                </div>
              </div>
            </div>

            {/* Insight 2 */}
            <div className="p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Active Investor Capital
                </h4>
                <span className="material-symbols-outlined text-blue-500">
                  pie_chart
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">$2T+</span>
                <span className="text-sm font-medium text-gray-500">
                  Deployable
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Estimated private capital actively targeting lower middle-market
                acquisitions (global estimate).
              </p>
              <div className="h-24 w-full flex flex-col gap-2 justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-12">
                    North America
                  </span>
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-12">
                    Europe
                  </span>
                  <div
                    className="h-2 bg-blue-400 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-12">
                    Asia
                  </span>
                  <div
                    className="h-2 bg-blue-200 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Insight 3 */}
            <div className="p-6 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Cross-Border Interest
                </h4>
                <span className="material-symbols-outlined text-purple-500">
                  public
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">60%</span>
                <span className="text-sm font-medium text-green-600">
                  High Demand
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Share of mid-market transactions involving cross-border buyers
                (global industry estimate).
              </p>
              <div
                className="h-24 w-full bg-gray-50 rounded-sm relative overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(#cbd5e1 1px, transparent 1px)",
                  backgroundSize: "8px 8px",
                }}
              >
                <svg
                  className="absolute bottom-0 left-0 w-full h-full text-purple-500"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 50"
                >
                  <path
                    d="M0 40 Q 25 20, 50 30 T 100 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 40 Q 25 20, 50 30 T 100 10 V 50 H 0 Z"
                    fill="currentColor"
                    opacity="0.1"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Platform */}
      <section className="py-20 bg-background-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Dealmakers Choose Acquity
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We prioritize trust, confidentiality, and data integrity to
              facilitate high-value transactions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl text-primary-light">
                  verified_user
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">Manually Verified</h3>
              <p className="text-gray-400 leading-relaxed">
                Every listing undergoes a rigorous manual review process to
                ensure authenticity and financial accuracy before going live.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl text-primary-light">
                  lock
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">Total Confidentiality</h3>
              <p className="text-gray-400 leading-relaxed">
                Maintain discretion throughout the process. Public summaries
                attract interest, while detailed information can be shared
                privately with vetted buyers.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl text-primary-light">
                  hub
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Verified Investor Network
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Connect directly with a curated network of private equity firms,
                family offices, and HNWIs actively seeking deployment.
              </p>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-gray-800 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6">
              Ready to list your business?
            </h3>
            <button
              onClick={handleListBusiness}
              className="flex items-center justify-center rounded-sm bg-primary text-white text-base font-bold h-12 px-10 shadow-lg hover:bg-blue-600 transition-colors"
            >
              List Your Business Today
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
