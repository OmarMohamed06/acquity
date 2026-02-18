"use client";

import { ListingFormData } from "../types";
import { COUNTRIES, COUNTRY_CODES } from "@/app/constants/options";

type Props = {
  formData: ListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ListingFormData>>;
};

export default function SellerInfo({ formData, setFormData }: Props) {
  return (
    <section className="flex justify-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* SECTION TITLE */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Seller Identity
            </h2>
            <p className="text-sm text-gray-600">
              Help buyers know who they're dealing with. All information is
              required for verification and communication.
            </p>
          </div>

          {/* SELLER IDENTITY SECTION */}
          <div className="space-y-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Information
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.seller_full_name ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({
                    ...v,
                    seller_full_name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Please enter a valid email address"
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.seller_email ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({ ...v, seller_email: e.target.value }))
                }
              />
            </div>

            {/* Phone Number with Country Code */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Country Code *
                </label>
                <select
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.seller_phone_country_code ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      seller_phone_country_code: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Code</option>
                  {COUNTRY_CODES.map(({ code, country }) => (
                    <option key={`${code}-${country}`} value={code}>
                      {code} ({country})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="1234567890"
                  pattern="[0-9]{7,15}"
                  title="Please enter 7-15 digits only"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.seller_phone ?? ""}
                  onChange={(e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((v) => ({ ...v, seller_phone: value }));
                  }}
                  maxLength={15}
                />
              </div>
            </div>

            {/* Country of Residence */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Country of Residence *
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.seller_country ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({ ...v, seller_country: e.target.value }))
                }
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SELLER ROLE & RELATIONSHIP SECTION */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Role & Authority
            </h3>

            {/* Relationship to Business */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Relationship to Business *
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.seller_relationship ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({
                    ...v,
                    seller_relationship: e.target.value as any,
                  }))
                }
              >
                <option value="">Select Your Role</option>
                <option value="owner">Owner</option>
                <option value="cofounder">Co-founder</option>
                <option value="shareholder">Majority Shareholder</option>
                <option value="representative">
                  Authorized Representative
                </option>
                <option value="broker">Broker / Advisor</option>
              </select>
            </div>

            {/* Ownership Percentage (if applicable) */}
            {["owner", "cofounder", "shareholder"].includes(
              formData.seller_relationship || "",
            ) && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Ownership Percentage
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Enter percentage"
                    className="flex-1 border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.seller_ownership_percentage ?? ""}
                    onChange={(e) =>
                      setFormData((v) => ({
                        ...v,
                        seller_ownership_percentage: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                  <span className="text-gray-600 font-semibold">%</span>
                </div>
              </div>
            )}

            {/* Authority to Sell / Raise Capital */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.seller_authority_to_sell ?? false}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      seller_authority_to_sell: e.target.checked,
                    }))
                  }
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Authority to Sell / Raise Capital
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    I confirm that I have the legal authority to sell this
                    business or raise capital on its behalf.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* INFO BOX */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
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
                <p className="text-xs font-semibold text-amber-900 mb-1">
                  Verification Required
                </p>
                <p className="text-xs text-amber-800">
                  All sellers are verified before buyers can contact them. This
                  helps maintain marketplace trust and security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
