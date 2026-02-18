"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PricingModal from "./PricingModal";

type Props = {
  formData: any;
  setStep: (step: number) => void;
  onSubmit: (plan: "basic" | "standard" | "premium") => Promise<void>;
  submitting?: boolean;
};

export default function Review({
  formData,
  setStep,
  onSubmit,
  submitting,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [showPricingModal, setShowPricingModal] = useState(false);

  const handleSubmitClick = () => {
    if (submitting) return;
    onSubmit("basic");
  };

  const handleSelectPlan = async (plan: "basic" | "standard" | "premium") => {
    try {
      await onSubmit(plan);
      setShowPricingModal(false);
    } catch (error) {
      console.error("Error submitting listing:", error);
      // Error handling is done in the parent component
    }
  };

  const getDocuments = () => {
    if (!formData.documents) return [];
    return Object.entries(formData.documents)
      .filter(([_, file]) => file)
      .map(([key, file]: [string, any]) => ({
        name: file.name || key,
        size: file.size ? `${Math.round(file.size / 1024)} KB` : "Unknown",
      }));
  };

  const docs = getDocuments();

  return (
    <section className="flex justify-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-2xl h-auto">
        <section className="space-y-4">
          {/* BASIC INFORMATION */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Basic Information</h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={submitting}
                className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-6 py-5">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Business Name
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.business_name ||
                    formData.brand_name ||
                    formData.company_name ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Industry</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.industry || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Location</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.city && formData.country
                    ? `${formData.city}, ${formData.country}`
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* FINANCIAL PERFORMANCE */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">
                Financial Performance{" "}
                {formData.financial_year ? `(${formData.financial_year})` : ""}
              </h3>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={submitting}
                className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-6 py-5">
              {formData.listing_type === "business_sale" && (
                <>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Asking Price
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.asking_price || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Annual Revenue
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.annual_revenue || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      EBITDA
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.ebitda || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Cash Flow
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.annual_net_cash_flow || "-"}
                    </p>
                  </div>
                </>
              )}

              {formData.listing_type === "franchise_sale" && (
                <>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Franchise Fee
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.franchise_fee || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Avg Unit Revenue
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.avg_unit_revenue || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Royalty Fee %
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.royalty_fee_percentage
                        ? `${formData.royalty_fee_percentage}%`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Avg Unit Profit
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.avg_unit_net_profit || "-"}
                    </p>
                  </div>
                </>
              )}

              {formData.listing_type === "investment_opportunity" && (
                <>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Capital Required
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.capital_required || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Annual Revenue
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.annual_revenue || "Pre-Revenue"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Equity Offered
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {formData.equity_offered_percentage
                        ? `${formData.equity_offered_percentage}%`
                        : "-"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* THE BUSINESS STORY */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">The Business Story</h3>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={submitting}
                className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                {formData.business_description ||
                  formData.franchise_concept ||
                  formData.business_overview ||
                  "No story provided yet."}
              </p>
            </div>
          </div>

          {/* LISTING IMAGE */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Listing Image</h3>
              <button
                type="button"
                onClick={() => setStep(5)}
                disabled={submitting}
                className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="px-6 py-5">
              {formData.listing_image ? (
                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden bg-gray-100 h-48">
                    <img
                      src={URL.createObjectURL(formData.listing_image)}
                      alt="Listing preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-green-600 font-medium">
                    ✓ {formData.listing_image.name}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No image uploaded yet.</p>
              )}
            </div>
          </div>

          {/* VERIFICATION DOCUMENTS */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">
                Verification Documents
              </h3>
              <button
                type="button"
                onClick={() => setStep(5)}
                disabled={submitting}
                className="text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏️ Edit
              </button>
            </div>
            <div className="px-6 py-5">
              {docs.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {docs.map((doc, idx) => (
                    <div key={idx} className="text-center">
                      <div className="bg-blue-50 rounded-lg p-4 mb-2">
                        <svg
                          className="w-12 h-12 text-blue-600 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 mb-1 truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No documents uploaded yet
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT SECTION */}
          <div className="bg-white border border-gray-200 rounded-lg px-6 py-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>Notice:</strong> Once submitted, our team of
                  professional business analysts will review your listing data.
                  We will be in contact within 48 hours to verify all the
                  information provided and to finalize your listing on the
                  marketplace.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "▶ Submit — Free during beta"}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              Free for a limited beta period. Founding listings receive early
              access.
            </p>
          </div>
        </section>

        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onSelectPlan={handleSelectPlan}
          listingType={formData.listing_type}
          isSubmitting={submitting}
        />
      </div>
    </section>
  );
}
