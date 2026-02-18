"use client";

import { ListingFormData } from "../types";
import { COUNTRIES, INDUSTRIES } from "@/app/constants/options";

type Props = {
  formData: ListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ListingFormData>>;
};

export default function BasicInfo({ formData, setFormData }: Props) {
  const listingType = formData.listing_type;

  return (
    <section className="flex justify-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-2xl">
        {/* LISTING TYPE CARDS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Listing Type</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() =>
                setFormData((v) => ({ ...v, listing_type: "business_sale" }))
              }
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                listingType === "business_sale"
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-xs font-medium">BUSINESS SALE</span>
            </button>

            <button
              onClick={() =>
                setFormData((v) => ({ ...v, listing_type: "franchise_sale" }))
              }
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                listingType === "franchise_sale"
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
              <span className="text-xs font-medium">FRANCHISE</span>
            </button>

            <button
              onClick={() =>
                setFormData((v) => ({
                  ...v,
                  listing_type: "investment_opportunity",
                }))
              }
              className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
                listingType === "investment_opportunity"
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium">INVESTMENT</span>
            </button>
          </div>
        </div>

        {/* FORM FIELDS */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Common fields for all listing types */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Industry
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500"
                value={formData.industry ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({ ...v, industry: e.target.value }))
                }
              >
                <option value="">Select Industry</option>

                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Country
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500"
                value={formData.country ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({ ...v, country: e.target.value }))
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                City
              </label>
              <input
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Dubai"
                value={formData.city ?? ""}
                onChange={(e) =>
                  setFormData((v) => ({ ...v, city: e.target.value }))
                }
              />
            </div>
          </div>
          {/* BUSINESS SALE ONLY */}
          {listingType === "business_sale" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Business Name
                </label>
                <input
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Al-Futtaim Logistics Hub"
                  value={formData.business_name ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      business_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Employees */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Number of Employees
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 50"
                    value={formData.employees_count ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = Number(val);
                      if (
                        val === "" ||
                        (!isNaN(num) && Number.isInteger(num) && num >= 0)
                      ) {
                        setFormData((v) => ({
                          ...v,
                          employees_count: val === "" ? undefined : num,
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "-" ||
                        e.key === "." ||
                        e.key === "e" ||
                        e.key === "E"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>

                {/* Year Established */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                    Year Established
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2015"
                    value={formData.year_established ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const year = Number(val);
                      if (
                        val === "" ||
                        (!isNaN(year) && Number.isInteger(year))
                      ) {
                        setFormData((v) => ({
                          ...v,
                          year_established: val === "" ? undefined : year,
                        }));
                      }
                    }}
                    onBlur={() => {
                      const year = Number(formData.year_established || 0);
                      if (
                        year &&
                        (year < 1900 || year > new Date().getFullYear())
                      ) {
                        setFormData((v) => ({
                          ...v,
                          year_established: undefined,
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "-" ||
                        e.key === "." ||
                        e.key === "e" ||
                        e.key === "E"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* FRANCHISE ONLY */}
          {listingType === "franchise_sale" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Brand Name
                </label>
                <input
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand name"
                  value={formData.brand_name ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      brand_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Year Founded
                </label>
                <input
                  type="number"
                  min={1800}
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 2010"
                  value={formData.year_founded ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      year_founded: Number(e.target.value) || undefined,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Total Units
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter total units"
                  value={formData.total_units ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      total_units: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* INVESTMENT ONLY */}
          {listingType === "investment_opportunity" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Company Name
                </label>
                <input
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  value={formData.company_name ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      company_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Year Founded
                </label>
                <input
                  type="number"
                  min={1800}
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 2018"
                  value={formData.year_founded ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      year_founded: Number(e.target.value) || undefined,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                  Company Stage
                </label>
                <select
                  className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                  value={formData.company_stage ?? ""}
                  onChange={(e) =>
                    setFormData((v) => ({
                      ...v,
                      company_stage: e.target.value as any,
                    }))
                  }
                >
                  <option value="">Stage</option>
                  <option value="mvp">MVP</option>
                  <option value="revenue">Revenue</option>
                  <option value="profitable">Profitable</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
