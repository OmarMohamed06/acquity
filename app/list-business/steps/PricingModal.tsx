"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: "basic" | "standard" | "premium") => void;
  listingType?: "business_sale" | "franchise_sale" | "investment_opportunity";
  isSubmitting?: boolean;
};

const PRICING = {
  business_sale: {
    basic: { regular: 75, monthly: null },
    standard: { regular: 100, monthly: 100 },
    premium: { regular: 400, monthly: 400 },
  },
  franchise_sale: {
    basic: { regular: 60, monthly: null },
    standard: { regular: 85, monthly: 85 },
    premium: { regular: 300, monthly: 300 },
  },
  investment_opportunity: {
    basic: { regular: 40, monthly: null },
    standard: { regular: 65, monthly: 65 },
    premium: { regular: 250, monthly: 250 },
  },
};

export default function PricingModal({
  isOpen,
  onClose,
  onSelectPlan,
  listingType = "business_sale",
  isSubmitting = false,
}: Props) {
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "standard" | "premium" | null
  >(null);

  const handleSelect = (plan: "basic" | "standard" | "premium") => {
    setSelectedPlan(plan);
  };

  return (
    <div
      className={`${
        isOpen ? "" : "hidden"
      } fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f6f6f8]/85`}
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#101622] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#111318] dark:hover:text-white transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#111318] dark:text-white mb-2">
              Founding Listings — Free During Beta
            </h2>
            <p className="text-sm text-[#616f89] dark:text-gray-400 max-w-xl mx-auto">
              Early access benefits apply during the limited beta period.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* BASIC PLAN */}
            <div
              onClick={() => handleSelect("basic")}
              className={`flex flex-col border p-6 bg-white dark:bg-[#1a202c] cursor-pointer transition-all ${
                selectedPlan === "basic"
                  ? "border-[#0f49bd] border-2"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#616f89] mb-1 block">
                  Entry Level
                </span>
                <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-2">
                  Basic
                </h3>
                <div className="flex items-baseline gap-1 mt-3 flex-wrap">
                  <span className="text-3xl font-black tracking-tighter">
                    Free
                  </span>
                  <span className="text-xs text-red-600 font-bold ml-2">
                    Free during beta
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  <span className="line-through">
                    ${PRICING[listingType].basic.regular}/month
                  </span>{" "}
                  <span className="text-green-600 font-bold">100% off</span>
                </p>
              </div>

              <div className="space-y-3 mb-6 flex-grow text-sm">
                <div className="flex items-start gap-2 text-[#111318] dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Standard listing</span>
                </div>
                <div className="flex items-start gap-2 text-[#111318] dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Normal ranking</span>
                </div>
                <div className="flex items-start gap-2 text-[#111318] dark:text-gray-300">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Limited exposure</span>
                </div>
              </div>

              <button
                className={`w-full py-3 border-2 font-bold text-sm tracking-widest uppercase transition-all ${
                  selectedPlan === "basic"
                    ? "border-[#111318] bg-[#111318] text-white dark:border-white dark:bg-white dark:text-[#111318]"
                    : "border-[#111318] text-[#111318] hover:bg-[#111318] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#111318]"
                }`}
              >
                {selectedPlan === "basic" ? "✓ Selected" : "Free during beta"}
              </button>
            </div>

            {/* STANDARD PLAN */}
            <div
              onClick={() => handleSelect("standard")}
              className={`flex flex-col border p-6 bg-white dark:bg-[#1a202c] cursor-pointer transition-all ${
                selectedPlan === "standard"
                  ? "border-[#7c3aed] border-2"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7c3aed] mb-1 block">
                  Early Access
                </span>
                <h3 className="text-xl font-bold text-[#111318] dark:text-white mb-2">
                  Standard
                </h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-3xl font-black tracking-tighter">
                    ${PRICING[listingType].standard.monthly}
                  </span>
                  <span className="text-xs text-[#616f89] uppercase tracking-wider">
                    /month
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-grow text-sm">
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#7c3aed] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Enhanced ranking</span>
                </div>
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#7c3aed] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Increased visibility</span>
                </div>
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#7c3aed] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Priority support</span>
                </div>
              </div>

              <button
                className={`w-full py-3 border-2 font-bold text-sm tracking-widest uppercase transition-all ${
                  selectedPlan === "standard"
                    ? "border-[#7c3aed] bg-[#7c3aed] text-white"
                    : "border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white dark:hover:bg-[#7c3aed]"
                }`}
              >
                {selectedPlan === "standard" ? "✓ Selected" : "Early access"}
              </button>
            </div>

            {/* PREMIUM PLAN */}
            <div
              onClick={() => handleSelect("premium")}
              className={`relative flex flex-col p-6 bg-white dark:bg-[#1a202c] shadow-lg cursor-pointer transition-all border-2 ${
                selectedPlan === "premium"
                  ? "border-[#0f49bd]"
                  : "border-[#0f49bd]"
              }`}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0a192f] text-white text-[9px] font-black uppercase tracking-[0.15em] py-1 px-4">
                Founding Listings
              </div>

              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0f49bd] mb-1 block">
                  Professional
                </span>
                <h3 className="text-xl font-bold text-[#0f49bd] mb-2">
                  Premium
                </h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-3xl font-black tracking-tighter">
                    ${PRICING[listingType].premium.monthly}
                  </span>
                  <span className="text-xs text-[#616f89] uppercase tracking-wider">
                    /month
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-grow text-sm">
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Boosted ranking</span>
                </div>
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Homepage placement</span>
                </div>
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Visual badge</span>
                </div>
                <div className="flex items-start gap-2 font-medium text-[#111318] dark:text-gray-200">
                  <svg
                    className="w-4 h-4 text-[#0f49bd] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Increased buyer visibility</span>
                </div>
              </div>

              <button
                className={`w-full py-3 font-bold text-sm tracking-widest uppercase transition-all shadow-lg ${
                  selectedPlan === "premium"
                    ? "bg-[#0f49bd] text-white"
                    : "bg-[#0f49bd] text-white hover:bg-blue-800"
                }`}
              >
                {selectedPlan === "premium"
                  ? "✓ Selected"
                  : "Founding listings"}
              </button>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="px-6 pb-8">
          <div className="max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => selectedPlan && onSelectPlan(selectedPlan)}
              disabled={!selectedPlan || isSubmitting}
              className={`w-full py-3 font-bold text-sm tracking-widest uppercase transition-all border-2 ${
                selectedPlan && !isSubmitting
                  ? "bg-[#0f49bd] border-[#0f49bd] text-white hover:bg-blue-800"
                  : "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Submitting..."
                : selectedPlan
                  ? "Choose Plan"
                  : "Select a Plan to Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
