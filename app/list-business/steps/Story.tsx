"use client";

import { ListingFormData, SupportProvided } from "../types";

type Props = {
  formData: ListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ListingFormData>>;
};

export default function Story({ formData, setFormData }: Props) {
  const type = formData.listing_type;

    return (
      <section className="flex justify-center bg-gray-50 min-h-screen py-8">
        <div className="w-full max-w-2xl">
          <section className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">The Story</h3>
              <p className="text-sm text-gray-600">
                Provide a compelling narrative to attract serious investors and
                explain the unique value of your business in the MENA/Asia
                market.
              </p>
            </div>

            {/* BUSINESS SALE */}
            {type === "business_sale" && (
              <>
                <TextArea
                  label="What the Business Does"
                  placeholder="Detail your products, services, market position, and core operations..."
                  max={300}
                  value={formData.business_description}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, business_description: v }))
                  }
                />

                <TextArea
                  label="Reason for Sale"
                  placeholder="Explain why you are exiting. Transparency builds trust with potential investors..."
                  max={300}
                  value={formData.reason_for_sale}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, reason_for_sale: v }))
                  }
                />

                <Select
                  label="Owner Involvement"
                  subtitle="How much time does the current owner spend on daily operations?"
                  value={formData.owner_involvement}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, owner_involvement: v }))
                  }
                  options={[
                    { value: "active", label: "Active", subtitle: "Full-Time" },
                    {
                      value: "semi_passive",
                      label: "Semi-passive",
                      subtitle: "Part-Time",
                    },
                    {
                      value: "passive",
                      label: "Passive",
                      subtitle: "Hands-Off",
                    },
                  ]}
                />
              </>
            )}

            {/* FRANCHISE */}
            {type === "franchise_sale" && (
              <>
                <TextArea
                  label="Franchise Concept"
                  max={300}
                  value={formData.franchise_concept}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, franchise_concept: v }))
                  }
                />

                <TextInput
                  label="Target Customer"
                  max={150}
                  value={formData.target_customer}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, target_customer: v }))
                  }
                />

                <MultiSelect
                  label="Support Provided"
                  values={formData.support_provided ?? []}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, support_provided: v }))
                  }
                  options={["training", "operations", "marketing"]}
                />
              </>
            )}

            {/* INVESTMENT */}
            {type === "investment_opportunity" && (
              <>
                <TextArea
                  label="Business Overview"
                  max={300}
                  value={formData.business_overview}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, business_overview: v }))
                  }
                />

                <TextArea
                  label="Why This Scales"
                  max={300}
                  value={formData.scalability_reason}
                  onChange={(v) =>
                    setFormData((d) => ({ ...d, scalability_reason: v }))
                  }
                />
              </>
            )}
          </section>
        </div>
      </section>
    );
}

/* ---------- Helpers ---------- */

function TextInput({
  label,
  value,
  max,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  max: number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold uppercase tracking-wide">
          {label}
        </label>
        <span className="text-xs text-gray-400">
          Max. {max} words recommended
        </span>
      </div>
      <input
        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
        value={value ?? ""}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  max,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  max: number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold uppercase tracking-wide">
          {label}
        </label>
        <span className="text-xs text-gray-400">
          Max. {max} words recommended
        </span>
      </div>
      <textarea
        className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={4}
        placeholder={placeholder}
        value={value ?? ""}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  subtitle,
  value,
  options,
  onChange,
}: {
  label: string;
  subtitle?: string;
  value?: string;
  options: { value: string; label: string; subtitle?: string }[];
  onChange: (v: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold uppercase tracking-wide mb-1">
        {label}
      </label>
      {subtitle && <p className="text-sm text-gray-600 mb-3">{subtitle}</p>}
      <div className="grid grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-4 py-3 rounded-md border-2 text-center transition-all ${
              value === o.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="font-semibold">{o.label}</div>
            {o.subtitle && (
              <div
                className={`text-xs mt-1 ${
                  value === o.value ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {o.subtitle}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelect({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  values: SupportProvided[];
  options: SupportProvided[];
  onChange: (v: SupportProvided[]) => void;
}) {
  const toggle = (val: SupportProvided) =>
    values.includes(val)
      ? onChange(values.filter((v) => v !== val))
      : onChange([...values, val]);

  return (
    <div>
      <label className="block text-sm font-semibold uppercase tracking-wide mb-3">
        {label}
      </label>
      <div className="flex gap-3 flex-wrap">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-md border-2 text-sm font-medium capitalize transition-all ${
              values.includes(opt)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
