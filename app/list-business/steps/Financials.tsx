"use client";

import { ListingFormData } from "../types";
import { useEffect } from "react";

type Props = {
  formData: ListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ListingFormData>>;
};

export default function Financials({ formData, setFormData }: Props) {
  const type = formData.listing_type;

  // auto-calc for investment
  const impliedValuation =
    type === "investment_opportunity" &&
    formData.capital_required &&
    formData.equity_offered_percentage
      ? formData.capital_required / (formData.equity_offered_percentage / 100)
      : undefined;

  useEffect(() => {
    if (type === "investment_opportunity" && impliedValuation) {
      setFormData((d) => ({
        ...d,
        implied_valuation: impliedValuation,
      }));
    }
  }, [impliedValuation, type]);

  return (
    <section className="flex justify-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-2xl h-auto">
        {/* BUSINESS SALE */}
        {type === "business_sale" && (
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Financial Details</h3>
              <p className="text-sm text-gray-600">
                Provide accurate financial metrics to attract qualified
                institutional and private buyers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Annual Revenue (USD)"
                placeholder="e.g. 1,000,000"
                value={formData.annual_revenue}
                onChange={(v) =>
                  setFormData((d) => ({ ...d, annual_revenue: v }))
                }
                info
              />

              <NumberInput
                label="Net Profit (USD)"
                placeholder="e.g. 250,000"
                value={formData.net_profit}
                onChange={(v) => setFormData((d) => ({ ...d, net_profit: v }))}
                info
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="EBITDA (USD)"
                placeholder="e.g. 300,000"
                value={formData.ebitda}
                onChange={(v) => setFormData((d) => ({ ...d, ebitda: v }))}
                info
              />

              <NumberInput
                label="Annual Net Cash Flow (USD)"
                placeholder="e.g. 200,000"
                value={formData.annual_net_cash_flow}
                onChange={(v) =>
                  setFormData((d) => ({ ...d, annual_net_cash_flow: v }))
                }
                info
              />
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 mb-4 w-310">
                <NumberInput
                  label="Asking Price (USD)"
                  placeholder="e.g. 5,000,000"
                  value={formData.asking_price}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, asking_price: v }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* FRANCHISE */}
        {type === "franchise_sale" && (
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Franchise Unit Economics
              </h3>
              <p className="text-sm text-gray-600">
                Detailed financial transparency builds trust with investors.
                Provide your average unit performance data from the last fiscal
                year.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-800">
                    Operating Performance (Annual Average)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <NumberInput
                    label="Average Unit Revenue (AUR)"
                    placeholder="$ 0.00"
                    value={formData.avg_unit_revenue}
                    onChange={(v) =>
                      setFormData((d) => ({ ...d, avg_unit_revenue: v }))
                    }
                    info
                  />

                  <NumberInput
                    label="Average Unit Net Profit"
                    placeholder="$ 0.00"
                    value={formData.avg_unit_net_profit}
                    onChange={(v) =>
                      setFormData((d) => ({ ...d, avg_unit_net_profit: v }))
                    }
                    info
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <NumberInput
                    label="Average Unit Net Cash Flow"
                    placeholder="$ 0.00"
                    value={formData.avg_unit_net_cash_flow}
                    onChange={(v) =>
                      setFormData((d) => ({
                        ...d,
                        avg_unit_net_cash_flow: v,
                      }))
                    }
                    info
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                  <span className="font-semibold text-gray-800">
                    Investment & Fees
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <NumberInput
                    label="Initial Franchise Fee"
                    placeholder="$ 0.00"
                    value={formData.franchise_fee}
                    onChange={(v) =>
                      setFormData((d) => ({ ...d, franchise_fee: v }))
                    }
                  />

                  <NumberInput
                    label="Total Setup Cost"
                    placeholder="$ Including equipment & fit-out"
                    value={formData.total_setup_cost}
                    onChange={(v) =>
                      setFormData((d) => ({ ...d, total_setup_cost: v }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <NumberInput
                    label="Royalty Fee (%)"
                    placeholder="e.g. 5"
                    suffix="%"
                    value={formData.royalty_fee_percentage}
                    onChange={(v) =>
                      setFormData((d) => ({
                        ...d,
                        royalty_fee_percentage: v,
                      }))
                    }
                    helperText="Percentage of gross revenue, where applicable (franchise)."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVESTMENT */}
        {type === "investment_opportunity" && (
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Investment Opportunity</h3>
              <p className="text-sm text-gray-600">
                Provide high-fidelity financial projections and equity
                structures. This information is secured and shared only with
                verified institutional investors in M&NA/Asia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Annual Revenue (USD)"
                placeholder="$ e.g. 1,000,000"
                value={formData.annual_revenue}
                onChange={(v) =>
                  setFormData((d) => ({ ...d, annual_revenue: v }))
                }
                info
              />

              <NumberInput
                label="Annual Profit (USD)"
                placeholder="$ e.g. 500,000"
                value={formData.annual_profit}
                onChange={(v) =>
                  setFormData((d) => ({ ...d, annual_profit: v }))
                }
                info
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberInput
                label="Capital Required (USD)"
                placeholder="$ e.g. 5,000,000"
                value={formData.capital_required}
                onChange={(v) =>
                  setFormData((d) => ({ ...d, capital_required: v }))
                }
                info
              />

              <NumberInput
                label="Equity Offered (%)"
                placeholder="e.g. 15"
                suffix="%"
                value={formData.equity_offered_percentage}
                onChange={(v) =>
                  setFormData((d) => ({
                    ...d,
                    equity_offered_percentage: v,
                  }))
                }
                info
              />
            </div>

            {impliedValuation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-semibold text-gray-800">
                    Implied Post-Money Valuation
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ${Math.round(impliedValuation).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Small helper ---------- */
function NumberInput({
  label,
  placeholder,
  value,
  onChange,
  info,
  suffix,
  helperText,
}: {
  label: string;
  placeholder?: string;
  value?: number;
  onChange: (v: number) => void;
  info?: boolean;
  suffix?: string;
  helperText?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase flex items-center gap-1">
        {label}
        {info && (
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </label>
      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            // Only update if it's a valid positive number or empty
            if (val === "" || (!isNaN(Number(val)) && Number(val) >= 0)) {
              onChange(val === "" ? 0 : Number(val));
            }
          }}
          onKeyDown={(e) => {
            // Prevent negative sign and 'e' (scientific notation)
            if (e.key === "-" || e.key === "e" || e.key === "E") {
              e.preventDefault();
            }
          }}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
