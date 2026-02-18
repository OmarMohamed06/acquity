"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ListingRow = {
  id: string;
  title: string | null;
  type: string | null;
  status: string | null;
  plan: string | null;
  category: string | null;
  location: string | null;
  created_at: string | null;
  sold: boolean | null;
  sold_price?: number | null;
  date_closed?: string | null;
};

type ProfilesRow = { role: string | null };

type SoldFilter = "all" | "active" | "sold";

export default function AdminListingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [search, setSearch] = useState("");
  const [soldFilter, setSoldFilter] = useState<SoldFilter>("all");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setErrorMessage("Failed to get user session.");
          setLoading(false);
          return;
        }

        if (!user) {
          router.push("/login?next=/admin/listings");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle<ProfilesRow>();

        if (profileError) {
          setErrorMessage("Failed to load profile.");
          setLoading(false);
          return;
        }

        if (!profile || profile.role !== "admin") {
          setNotAuthorized(true);
          setLoading(false);
          return;
        }

        await fetchListings();
        setLoading(false);
      } catch (err) {
        console.error("Admin listings init error:", err);
        setErrorMessage(
          "Unable to reach Supabase. Check your network connection and NEXT_PUBLIC_SUPABASE_URL.",
        );
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const fetchListings = async () => {
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from("listings")
        .select(
          "id, title, type, status, plan, category, location, created_at, sold, sold_price, date_closed",
        )
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(
          `Failed to load listings: ${error.message || "Unknown error"}`,
        );
        return;
      }

      setListings(data || []);
    } catch (err) {
      console.error("Admin listings fetch error:", err);
      setErrorMessage(
        "Unable to reach Supabase. Check your network connection and NEXT_PUBLIC_SUPABASE_URL.",
      );
    }
  };

  const filteredListings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch =
        !searchText ||
        listing.title?.toLowerCase().includes(searchText) ||
        listing.location?.toLowerCase().includes(searchText) ||
        listing.category?.toLowerCase().includes(searchText) ||
        listing.type?.toLowerCase().includes(searchText);

      const isSold = Boolean(listing.sold);
      const matchesSold =
        soldFilter === "all" ||
        (soldFilter === "sold" && isSold) ||
        (soldFilter === "active" && !isSold);

      return matchesSearch && matchesSold;
    });
  }, [listings, search, soldFilter]);

  const handleMarkSold = async (id: string) => {
    const priceInput = window.prompt(
      "Sold price (optional). Leave empty to skip:",
      "",
    );
    const parsedPrice = priceInput ? Number(priceInput) : null;
    const soldPrice = Number.isFinite(parsedPrice) ? parsedPrice : null;
    const dateClosedIso = new Date().toISOString();

    try {
      const attempt = async (withDateClosed: boolean) => {
        const payload = withDateClosed
          ? { sold: true, sold_price: soldPrice, date_closed: dateClosedIso }
          : { sold: true, sold_price: soldPrice };
        return supabase.from("listings").update(payload).eq("id", id);
      };

      let { error } = await attempt(true);

      if (error?.message?.includes("date_closed")) {
        ({ error } = await attempt(false));
      }

      if (error) {
        setErrorMessage(`Failed to mark sold: ${error.message}`);
        return;
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                sold: true,
                sold_price: soldPrice,
                date_closed: dateClosedIso,
              }
            : listing,
        ),
      );
    } catch (err) {
      console.error("Mark sold error:", err);
      setErrorMessage(
        "Unable to reach Supabase. Check your network connection and NEXT_PUBLIC_SUPABASE_URL.",
      );
    }
  };

  if (loading) {
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading listings…</p>
        </div>
      </div>
    );
  }

  if (notAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Access denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Manage Listings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Mark listings as sold.
            </p>
          </div>
          <button
            onClick={fetchListings}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, category, location…"
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
          />

          <select
            value={soldFilter}
            onChange={(event) =>
              setSoldFilter(event.target.value as SoldFilter)
            }
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
          >
            <option value="all">All Listings</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-slate-800"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {listing.title || "Untitled Listing"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Type: {listing.type || "-"}</span>
                    <span>Plan: {listing.plan || "-"}</span>
                    <span>Status: {listing.status || "-"}</span>
                    <span>Sold: {listing.sold ? "Yes" : "No"}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {listing.category || "No category"} •{" "}
                    {listing.location || "No location"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.sold ? (
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                      Sold
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkSold(listing.id)}
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-slate-700"
                    >
                      Mark Sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredListings.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-400">
              No listings match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
