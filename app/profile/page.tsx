"use client";

import { formatNumber } from "../lib/formatNumber";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export type Listing = {
  id: string;
  slug?: string;
  ownerId: string; // 🔑 links listing → user
  title: string;
  category: string;
  location: string;
  country?: string;
  type: string;
  plan?: string | null;
  status?: "pending" | "approved" | "rejected" | null;
  price?: number | null;
  revenue?: number | null;
  image?: string | null;
  sold: boolean;
  soldPrice?: number | null;
  dateClosed?: string | null;
  createdAt: number;
  description?: string | null;
};

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [confirmSoldId, setConfirmSoldId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [profile, setProfile] = useState<{
    full_name: string;
    country: string;
  } | null>(null);
  const activeCount = listings.filter((l) => !l.sold).length;
  const soldCount = listings.filter((l) => l.sold).length;

  // Get initials from full name
  const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  // Redirect to login if not authenticated (after auth check completes)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, country")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        // If profile doesn't exist, use data from auth context
        setProfile({
          full_name: user.name || user.email?.split("@")[0] || "User",
          country: "",
        });
        return;
      }

      // Use profile data from database, or fallback to auth context
      setProfile({
        full_name:
          data?.full_name || user.name || user.email?.split("@")[0] || "User",
        country: data?.country || "",
      });
    };

    fetchProfile();

    const fetchListings = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading listings:", error);
        setListings([]);
        return;
      }

      // Fetch financial details for each listing
      const normalized: Listing[] = await Promise.all(
        (data || []).map(async (item: any) => {
          let price = null;
          let revenue = null;

          // Fetch type-specific details
          if (item.type === "business_sale") {
            const { data: details } = await supabase
              .from("business_sale_details")
              .select("asking_price, annual_revenue")
              .eq("listing_id", item.id)
              .maybeSingle();
            price = details?.asking_price ?? null;
            revenue = details?.annual_revenue ?? null;
          } else if (item.type === "franchise_sale") {
            const { data: details } = await supabase
              .from("franchise_sale_details")
              .select("franchise_fee, avg_unit_revenue")
              .eq("listing_id", item.id)
              .maybeSingle();
            price = details?.franchise_fee ?? null;
            revenue = details?.avg_unit_revenue ?? null;
          } else if (item.type === "investment_opportunity") {
            const { data: details } = await supabase
              .from("investment_opportunity_details")
              .select("capital_required, annual_revenue")
              .eq("listing_id", item.id)
              .maybeSingle();
            price = details?.capital_required ?? null;
            revenue = details?.annual_revenue ?? null;
          }

          return {
            id: item.id,
            slug: item.slug,
            ownerId: item.user_id,
            title: item.title || "Untitled Listing",
            category: item.category || "General",
            location: item.location || "",
            country: item.country || "",
            type: item.type || "business_sale",
            plan: item.plan || "free",
            status: item.status || "pending",
            price,
            revenue,
            image: item.image_url ?? null,
            sold: Boolean(item.sold) || false,
            soldPrice: item.sold_price ?? null,
            dateClosed: item.date_closed
              ? new Date(item.date_closed).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : null,
            createdAt: item.created_at
              ? new Date(item.created_at).getTime()
              : Date.now(),
            description: item.description || null,
          };
        }),
      );

      setListings(normalized);
    };

    fetchListings();

    // Fetch buyer inquiries for seller's listings
    const fetchInquiries = async () => {
      console.log("Fetching inquiries for user:", user.id);
      const { data: userListings, error: listingsError } = await supabase
        .from("listings")
        .select("id, title")
        .eq("user_id", user.id);

      if (listingsError) {
        console.error("Error fetching user listings:", listingsError);
      }

      console.log("User listings:", userListings);

      if (!userListings || userListings.length === 0) {
        console.log("No listings found for user");
        setInquiries([]);
        return;
      }

      const listingIds = userListings.map((l) => l.id);
      console.log("Fetching inquiries for listing IDs:", listingIds);

      const { data: contactData, error } = await supabase
        .from("buyer_contact")
        .select("*")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading inquiries:", error);
        setInquiries([]);
        return;
      }

      console.log("Inquiries fetched:", contactData);

      // Enrich with listing title
      const enriched = (contactData || []).map((inquiry) => {
        const listing = userListings.find((l) => l.id === inquiry.listing_id);
        return {
          ...inquiry,
          listing_title: listing?.title || "Unknown Listing",
        };
      });

      setInquiries(enriched);
    };

    fetchInquiries();

    // Subscribe to real-time updates for inquiries
    const inquiriesChannel = supabase
      .channel(`user-inquiries-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "buyer_contact",
        },
        (payload) => {
          console.log("New inquiry received:", payload);
          fetchInquiries();
        },
      )
      .subscribe();

    // Subscribe to real-time updates for user's listings
    const channel = supabase
      .channel(`user-listings-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "listings",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Listing updated:", payload);
          // Refresh listings when status changes
          fetchListings();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(inquiriesChannel);
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login?next=/profile");
    }
  }, [user, router]);

  if (!user) return null;

  async function markAsSold(id: string) {
    const target = listings.find((l) => l.id === id);
    const soldPrice = target?.price ?? null;
    const dateClosedIso = new Date().toISOString();

    // Try with date_closed; fall back if column is missing.
    const attempt = async (withDateClosed: boolean) => {
      const updatePayload = withDateClosed
        ? { sold: true, sold_price: soldPrice, date_closed: dateClosedIso }
        : { sold: true, sold_price: soldPrice };

      return supabase.from("listings").update(updatePayload).eq("id", id);
    };

    let { error } = await attempt(true);

    if (error?.message?.includes("date_closed")) {
      ({ error } = await attempt(false));
    }

    if (error) {
      console.error("Failed to mark as sold:", error.message);
      return;
    }

    // Optimistically update UI
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              sold: true,
              soldPrice,
              dateClosed: new Date(dateClosedIso).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }),
            }
          : l,
      ),
    );
  }

  const visibleListings =
    activeTab === "listings"
      ? listings.filter((l) => !l.sold)
      : listings.filter((l) => l.sold);

  // Show loading state while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <svg
              className="absolute inset-0 w-full h-full animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, return nothing (redirect effect will handle it)
  if (!user) {
    return null;
  }

  return (
    <>
      {confirmSoldId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">
              Mark listing as sold?
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to mark this listing as sold?
              <br />
              <strong>
                This action will remove it from active listings
              </strong>{" "}
              and move it to your sold archive.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmSoldId(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await markAsSold(confirmSoldId!);
                  setConfirmSoldId(null);
                }}
                className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Mark as Sold
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full sm:w-80 lg:w-80 flex flex-col gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-500/10 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profile?.full_name && profile.full_name.trim()
                        ? getInitials(profile.full_name)
                        : user?.name
                          ? getInitials(user.name)
                          : "?"}
                    </span>
                  </div>
                  <span className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {profile?.full_name ||
                      user?.name ||
                      user?.email?.split("@")[0] ||
                      "User"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {profile?.country || "No country set"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/settings")}
              className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 py-3 rounded-lg text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Account Settings
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  User Profile
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Dual-role management for your listings and investment
                  interests.
                </p>
              </div>
              <button
                onClick={() => router.push("/list-business")}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center sm:justify-start gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Listing
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setActiveTab("listings")}
                className={`px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                  activeTab === "listings"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                My Listings ({activeCount})
              </button>

              <button
                onClick={() => setActiveTab("saved")}
                className={`px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                  activeTab === "saved"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined">sell</span>
                Sold Listings ({soldCount})
              </button>

              <button
                onClick={() => setActiveTab("inquiries")}
                className={`px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-1 sm:gap-2 transition-all whitespace-nowrap ${
                  activeTab === "inquiries"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Inquiries ({inquiries.length})
              </button>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === "inquiries" ? (
              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-slate-300 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      No Inquiries Yet
                    </h3>
                    <p className="text-sm text-slate-600">
                      When buyers contact your listings, their inquiries will
                      appear here.
                    </p>
                  </div>
                ) : (
                  inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                            {inquiry.buyer_name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Inquiry for:{" "}
                            <span className="font-semibold text-blue-600">
                              {inquiry.listing_title}
                            </span>
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(inquiry.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${inquiry.buyer_email}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {inquiry.buyer_email}
                          </a>
                        </div>
                        {inquiry.company && (
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                              Company
                            </p>
                            <p className="text-sm text-slate-900 dark:text-white">
                              {inquiry.company}
                            </p>
                          </div>
                        )}
                        {inquiry.budget_range && (
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                              Budget Range
                            </p>
                            <p className="text-sm text-slate-900 dark:text-white">
                              {inquiry.budget_range}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                          Reason for Interest
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {inquiry.reason_interest}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {visibleListings.map((listing) => {
                  // Map listing type to route
                  const typeToRoute: { [key: string]: string } = {
                    business_sale: "businesses-for-sale",
                    franchise_sale: "franchises-for-sale",
                    investment_opportunity: "investments-for-sale",
                  };
                  const route =
                    typeToRoute[listing.type] || "businesses-for-sale";

                  return (
                    <div
                      key={listing.id}
                      onClick={() =>
                        router.push(`/${route}/listing/${listing.slug}`)
                      }
                      className={`className="cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all"
 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:shadow-lg transition-all ${
   listing.sold ? "relative opacity-60" : ""
 }`}
                    >
                      {listing.sold && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                          <div className="bg-red-600 text-white px-6 py-2 text-sm font-black tracking-widest border-2 border-white uppercase">
                            Sold
                          </div>
                        </div>
                      )}

                      <div
                        className={`relative h-48 bg-slate-200 ${
                          listing.sold ? "grayscale" : ""
                        }`}
                      >
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-black uppercase tracking-widest px-2 py-1 rounded">
                            {listing.category}
                          </span>
                        </div>
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${listing.image}')` }}
                        />
                      </div>

                      <div
                        className={`p-5 flex flex-col flex-1 ${
                          listing.sold ? "grayscale" : ""
                        }`}
                      >
                        <h4 className="font-bold text-lg leading-snug">
                          {listing.title}
                        </h4>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[11px] font-black uppercase tracking-wide px-2 py-1 rounded-full ${
                              listing.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : listing.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {listing.status === "approved"
                              ? "Active"
                              : listing.status === "rejected"
                                ? "Rejected"
                                : "Pending Approval"}
                          </span>
                          {listing.plan && (
                            <span className="text-[11px] font-black uppercase tracking-wide px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                              {listing.plan} plan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {listing.location}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-4 border-y border-slate-100 dark:border-slate-800 py-4">
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-600 tracking-wider">
                              {listing.sold ? "Sold Price" : "Asking Price"}
                            </p>
                            <p className="font-bold text-blue-600">
                              {listing.sold
                                ? formatNumber(listing.soldPrice)
                                : formatNumber(listing.price)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase font-bold text-slate-600 tracking-wider">
                              {listing.sold ? "Date Closed" : "Revenue (TTM)"}
                            </p>
                            <p className="font-bold">
                              {listing.sold
                                ? listing.dateClosed
                                : formatNumber(listing.revenue)}
                            </p>
                          </div>
                        </div>

                        {listing.sold ? (
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 uppercase">
                              Status: Archived
                            </span>
                            <button className="text-xs font-bold underline text-slate-600 cursor-not-allowed">
                              View Archive
                            </button>
                          </div>
                        ) : (
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex -space-x-2"></div>
                            <div className="flex gap-2">
                              {(() => {
                                const canMarkSold =
                                  listing.status === "approved";
                                return (
                                  <button
                                    disabled={!canMarkSold}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!canMarkSold) return;
                                      setConfirmSoldId(listing.id);
                                    }}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                      canMarkSold
                                        ? "bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white"
                                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                    }`}
                                    title={
                                      canMarkSold
                                        ? "Mark this active listing as sold"
                                        : "Enabled when listing is Active"
                                    }
                                  >
                                    Mark as Sold
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add New Listing Card */}
                <div
                  onClick={() => router.push("/list-business")}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 bg-slate-50/30 dark:bg-transparent min-h-[400px] group cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-lg">Add New Listing</p>
                  <p className="text-xs text-slate-600 text-center mt-2 max-w-[200px]">
                    List a new business, franchise or investment opportunity
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
