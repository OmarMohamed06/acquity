"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Listing = {
  id: string;
  title: string | null;
  category: string | null;
  location: string | null;
  created_at: string | null;
  status: string | null;
  rejection_reason: string | null;
};

type ListingDetail = Listing & {
  description?: string | null;
  country?: string | null;
  type?: string | null;
  plan?: string | null;
  user_id?: string | null;
  image_url?: string | null;
  seller_full_name?: string | null;
  seller_email?: string | null;
  seller_phone?: string | null;
  seller_phone_country_code?: string | null;
  seller_country?: string | null;
  seller_relationship?: string | null;
  seller_authority_to_sell?: boolean | null;
};

type SellerDetails = {
  seller_full_name: string | null;
  seller_email: string | null;
  seller_phone: string | null;
  seller_phone_country_code: string | null;
  seller_country: string | null;
  seller_relationship: string | null;
  seller_authority_to_sell: boolean | null;
};

type BusinessSaleDetails = {
  year_established: number | null;
  employees_count: number | null;
  asking_price: number | null;
  annual_revenue: number | null;
  ebitda: number | null;
  annual_cashflow: number | null;
  reason_for_sale: string | null;
  owner_involvement: string | null;
};

type FranchiseSaleDetails = {
  year_founded: number | null;
  total_units: number | null;
  franchise_fee: number | null;
  royalty_fee_percent: number | null;
  avg_unit_revenue: number | null;
  avg_unit_profit: number | null;
  avg_unit_cash_flow: number | null;
  support_provided: string | null;
  target_customer: string | null;
};

type InvestmentDetails = {
  company_stage: string | null;
  capital_required: number | null;
  equity_offered_percent: number | null;
  annual_revenue: number | null;
  annual_profit: number | null;
  implied_valuation: number | null;
  scalability_reason: string | null;
};

type ListingDocument = {
  id: string;
  listing_id: string;
  document_type: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string | null;
};

type ProfilesRow = {
  role: string | null;
};

export default function AdminApprovalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [actionListingId, setActionListingId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(
    null,
  );
  const [sellerDetails, setSellerDetails] = useState<SellerDetails | null>(
    null,
  );
  const [businessDetails, setBusinessDetails] =
    useState<BusinessSaleDetails | null>(null);
  const [franchiseDetails, setFranchiseDetails] =
    useState<FranchiseSaleDetails | null>(null);
  const [investmentDetails, setInvestmentDetails] =
    useState<InvestmentDetails | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<ListingDocument[]>(
    [],
  );
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedListings = useMemo(
    () =>
      [...pendingListings].sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      }),
    [pendingListings],
  );

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setErrorMessage(null);

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
        router.push("/login?next=/admin/approvals");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

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

      const { data, error } = await supabase
        .from("listings")
        .select(
          "id, title, category, location, created_at, status, rejection_reason",
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Pending listings fetch error:", error);
        setErrorMessage(
          `Failed to load pending listings: ${error.message || "Unknown error"}`,
        );
        setLoading(false);
        return;
      }

      setPendingListings(data || []);
      setLoading(false);
    };

    init();
  }, [router]);

  const handleApprove = async (id: string) => {
    setActionListingId(id);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("listings")
      .update({ status: "approved", rejection_reason: null })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Approve error:", error);
      setErrorMessage(
        `Failed to approve listing: ${error.message || JSON.stringify(error)}`,
      );
    } else if (data && data.length > 0) {
      console.log("Successfully approved listing:", data);
      // Email sent automatically via database trigger

      setPendingListings((prev) => prev.filter((l) => l.id !== id));
    } else {
      console.error("No data returned after approval");
      setErrorMessage("Failed to approve listing: No data returned");
    }

    setActionListingId(null);
  };

  const handleReject = async (id: string) => {
    const reason = rejectionReasons[id]?.trim();
    if (!reason) {
      setErrorMessage("Rejection reason is required.");
      return;
    }

    setActionListingId(id);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("listings")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Reject error:", error);
      setErrorMessage(
        `Failed to reject listing: ${error.message || JSON.stringify(error)}`,
      );
    } else if (data && data.length > 0) {
      console.log("Successfully rejected listing:", data);
      // Email sent automatically via database trigger

      setPendingListings((prev) => prev.filter((l) => l.id !== id));
      setRejectionReasons((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      console.error("No data returned after rejection");
      setErrorMessage("Failed to reject listing: No data returned");
    }

    setActionListingId(null);
  };

  const handleViewDetails = async (id: string) => {
    setActionListingId(id);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Fetch listing detail error:", error);
      setErrorMessage(
        `Failed to load listing details: ${error.message || "Unknown error"}`,
      );
      setSelectedListing(null);
    } else {
      setSelectedListing(data as ListingDetail);

      setSellerDetails({
        seller_full_name: data?.seller_full_name ?? null,
        seller_email: data?.seller_email ?? null,
        seller_phone: data?.seller_phone ?? null,
        seller_phone_country_code: data?.seller_phone_country_code ?? null,
        seller_country: data?.seller_country ?? null,
        seller_relationship: data?.seller_relationship ?? null,
        seller_authority_to_sell: data?.seller_authority_to_sell ?? null,
      });

      // Fetch type-specific details
      if (data?.type === "business_sale") {
        const { data: bizDetails, error: bizError } = await supabase
          .from("business_sale_details")
          .select("*")
          .eq("listing_id", id)
          .maybeSingle();
        if (bizError) {
          console.error("Business details error:", bizError);
        }
        setBusinessDetails(bizDetails);
        setFranchiseDetails(null);
        setInvestmentDetails(null);
      } else if (data?.type === "franchise_sale") {
        const { data: franDetails, error: franError } = await supabase
          .from("franchise_sale_details")
          .select("*")
          .eq("listing_id", id)
          .maybeSingle();
        if (franError) {
          console.error("Franchise details error:", franError);
        }
        setFranchiseDetails(franDetails);
        setBusinessDetails(null);
        setInvestmentDetails(null);
      } else if (data?.type === "investment_opportunity") {
        const { data: invDetails, error: invError } = await supabase
          .from("investment_opportunity_details")
          .select("*")
          .eq("listing_id", id)
          .maybeSingle();
        if (invError) {
          console.error("Investment details error:", invError);
        }
        setInvestmentDetails(invDetails);
        setBusinessDetails(null);
        setFranchiseDetails(null);
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const apiResponse = await fetch(
          `/api/admin/listing-documents?listingId=${id}`,
          {
            headers: session?.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : undefined,
          },
        );

        if (!apiResponse.ok) {
          const payload = await apiResponse.json().catch(() => null);
          if (
            payload?.message ===
            "Server is missing Supabase admin configuration."
          ) {
            throw new Error("admin_config_missing");
          }
          throw new Error(payload?.message || "Failed to load documents");
        }

        const payload = await apiResponse.json();
        setSelectedDocuments(payload?.documents || []);
      } catch (apiError: any) {
        if (apiError?.message !== "admin_config_missing") {
          console.error("Fetch documents error:", apiError);
        }

        const { data: docs, error: docsError } = await supabase
          .from("listing_documents")
          .select(
            "id, listing_id, document_type, file_name, file_path, file_size, mime_type, created_at",
          )
          .eq("listing_id", id)
          .order("created_at", { ascending: false });

        if (docsError) {
          console.error("Fetch documents error (fallback):", docsError);
          setSelectedDocuments([]);
          setErrorMessage(
            `Failed to load documents: ${docsError.message || "Unknown error"}`,
          );
        } else {
          setSelectedDocuments(docs || []);
        }
      }
    }

    setActionListingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        Loading...
      </div>
    );
  }

  if (notAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-red-600">
        Not authorized
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Admin Approvals</h1>
          <p className="text-sm text-slate-600">
            Review and moderate pending marketplace listings.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {sortedListings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No pending listings.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedListings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold leading-snug">
                    {listing.title || "Untitled Listing"}
                  </h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    ID: {listing.id}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {listing.category || "Uncategorized"}
                  </p>
                  <p className="text-xs text-slate-600">
                    {listing.location || "Location not provided"}
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  {listing.created_at
                    ? new Date(listing.created_at).toLocaleString()
                    : ""}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  Rejection reason
                </label>
                <textarea
                  value={rejectionReasons[listing.id] || ""}
                  onChange={(e) =>
                    setRejectionReasons((prev) => ({
                      ...prev,
                      [listing.id]: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter reason if rejecting"
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => handleViewDetails(listing.id)}
                  className="px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApprove(listing.id)}
                  disabled={actionListingId === listing.id}
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {actionListingId === listing.id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(listing.id)}
                  disabled={actionListingId === listing.id}
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {actionListingId === listing.id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSelectedListing(null);
                setSellerDetails(null);
                setBusinessDetails(null);
                setFranchiseDetails(null);
                setInvestmentDetails(null);
                setSelectedDocuments([]);
              }}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-2xl w-8 h-8 flex items-center justify-center z-10"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black mb-1">
              {selectedListing.title || "Untitled Listing"}
            </h2>
            <p className="text-xs font-mono text-slate-500 mb-2">
              Listing ID: {selectedListing.id}
            </p>
            <p className="text-sm text-slate-600 mb-6">
              {selectedListing.category || "Uncategorized"} ·{" "}
              {selectedListing.location || "Location not provided"}
            </p>

            {/* Seller Information Section */}
            {sellerDetails && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-lg font-bold mb-3 text-blue-900">
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-700 font-semibold">Full Name</p>
                    <p className="text-blue-900">
                      {sellerDetails.seller_full_name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Email</p>
                    <p className="text-blue-900">
                      {sellerDetails.seller_email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Phone</p>
                    <p className="text-blue-900">
                      {sellerDetails.seller_phone_country_code &&
                      sellerDetails.seller_phone
                        ? `${sellerDetails.seller_phone_country_code} ${sellerDetails.seller_phone}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Country</p>
                    <p className="text-blue-900">
                      {sellerDetails.seller_country || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-semibold">Relationship</p>
                    <p className="text-blue-900 capitalize">
                      {sellerDetails.seller_relationship?.replace(/_/g, " ") ||
                        "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-blue-700 font-semibold">
                      Authority to Sell
                    </p>
                    <p className="text-blue-900">
                      {sellerDetails.seller_authority_to_sell === true
                        ? "✓ Yes"
                        : sellerDetails.seller_authority_to_sell === false
                          ? "✗ No"
                          : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-bold mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-600 font-semibold">Status</p>
                  <p className="text-slate-900 capitalize">
                    {selectedListing.status || "pending"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Plan</p>
                  <p className="text-slate-900 capitalize">
                    {selectedListing.plan || "free"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Type</p>
                  <p className="text-slate-900 capitalize">
                    {selectedListing.type?.replace(/_/g, " ") ||
                      "business sale"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Country</p>
                  <p className="text-slate-900">
                    {selectedListing.country || "Not provided"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-600 font-semibold">Created</p>
                  <p className="text-slate-900">
                    {selectedListing.created_at
                      ? new Date(selectedListing.created_at).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Description</h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 border border-slate-200">
                {selectedListing.description || "No description provided."}
              </p>
            </div>

            {/* Business Sale Details */}
            {businessDetails && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="text-lg font-bold mb-3 text-green-900">
                  Business Sale Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-green-700 font-semibold">
                      Year Established
                    </p>
                    <p className="text-green-900">
                      {businessDetails.year_established || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Employees</p>
                    <p className="text-green-900">
                      {businessDetails.employees_count || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">Asking Price</p>
                    <p className="text-green-900 font-bold">
                      {businessDetails.asking_price
                        ? `$${businessDetails.asking_price.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">
                      Annual Revenue
                    </p>
                    <p className="text-green-900">
                      {businessDetails.annual_revenue
                        ? `$${businessDetails.annual_revenue.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">EBITDA</p>
                    <p className="text-green-900">
                      {businessDetails.ebitda
                        ? `$${businessDetails.ebitda.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">
                      Annual Cashflow
                    </p>
                    <p className="text-green-900">
                      {businessDetails.annual_cashflow
                        ? `$${businessDetails.annual_cashflow.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold">
                      Owner Involvement
                    </p>
                    <p className="text-green-900 capitalize">
                      {businessDetails.owner_involvement?.replace(/_/g, "-") ||
                        "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-green-700 font-semibold">
                      Reason for Sale
                    </p>
                    <p className="text-green-900">
                      {businessDetails.reason_for_sale || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Franchise Sale Details */}
            {franchiseDetails && (
              <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h3 className="text-lg font-bold mb-3 text-purple-900">
                  Franchise Sale Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-purple-700 font-semibold">
                      Year Founded
                    </p>
                    <p className="text-purple-900">
                      {franchiseDetails.year_founded || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">Total Units</p>
                    <p className="text-purple-900">
                      {franchiseDetails.total_units || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">
                      Franchise Fee
                    </p>
                    <p className="text-purple-900 font-bold">
                      {franchiseDetails.franchise_fee
                        ? `$${franchiseDetails.franchise_fee.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">Royalty Fee</p>
                    <p className="text-purple-900">
                      {franchiseDetails.royalty_fee_percent
                        ? `${franchiseDetails.royalty_fee_percent}%`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">
                      Avg Unit Revenue
                    </p>
                    <p className="text-purple-900">
                      {franchiseDetails.avg_unit_revenue
                        ? `$${franchiseDetails.avg_unit_revenue.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">
                      Avg Unit Profit
                    </p>
                    <p className="text-purple-900">
                      {franchiseDetails.avg_unit_profit
                        ? `$${franchiseDetails.avg_unit_profit.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">
                      Avg Unit Cashflow
                    </p>
                    <p className="text-purple-900">
                      {franchiseDetails.avg_unit_cash_flow
                        ? `$${franchiseDetails.avg_unit_cash_flow.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 font-semibold">
                      Support Provided
                    </p>
                    <p className="text-purple-900 capitalize">
                      {franchiseDetails.support_provided || "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-purple-700 font-semibold">
                      Target Customer
                    </p>
                    <p className="text-purple-900">
                      {franchiseDetails.target_customer || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Opportunity Details */}
            {investmentDetails && (
              <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <h3 className="text-lg font-bold mb-3 text-orange-900">
                  Investment Opportunity Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-orange-700 font-semibold">
                      Company Stage
                    </p>
                    <p className="text-orange-900 capitalize">
                      {investmentDetails.company_stage || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-700 font-semibold">
                      Capital Required
                    </p>
                    <p className="text-orange-900 font-bold">
                      {investmentDetails.capital_required
                        ? `$${investmentDetails.capital_required.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-700 font-semibold">
                      Equity Offered
                    </p>
                    <p className="text-orange-900">
                      {investmentDetails.equity_offered_percent
                        ? `${investmentDetails.equity_offered_percent}%`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-700 font-semibold">
                      Annual Revenue
                    </p>
                    <p className="text-orange-900">
                      {investmentDetails.annual_revenue
                        ? `$${investmentDetails.annual_revenue.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-700 font-semibold">
                      Annual Profit
                    </p>
                    <p className="text-orange-900">
                      {investmentDetails.annual_profit
                        ? `$${investmentDetails.annual_profit.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-700 font-semibold">
                      Implied Valuation
                    </p>
                    <p className="text-orange-900">
                      {investmentDetails.implied_valuation
                        ? `$${investmentDetails.implied_valuation.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-orange-700 font-semibold">
                      Scalability Reason
                    </p>
                    <p className="text-orange-900">
                      {investmentDetails.scalability_reason || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <h3 className="text-lg font-bold mb-3">Documents</h3>
              {selectedDocuments.length === 0 ? (
                <p className="text-sm text-slate-600">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {selectedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded border border-slate-200 bg-white px-3 py-2"
                    >
                      <div>
                        <p className="font-semibold text-sm">{doc.file_name}</p>
                        <p className="text-xs text-slate-600">
                          <span className="capitalize">
                            {doc.document_type?.replace(/_/g, " ") ||
                              "document"}
                          </span>
                          {doc.file_size
                            ? ` · ${(doc.file_size / 1024).toFixed(1)} KB`
                            : ""}
                          {doc.mime_type ? ` · ${doc.mime_type}` : ""}
                        </p>
                      </div>
                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View / Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
