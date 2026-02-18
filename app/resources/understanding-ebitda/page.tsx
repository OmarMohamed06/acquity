import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Understanding EBITDA | Business Financial Metrics Guide – Acquity",
  description:
    "Master EBITDA and other financial metrics crucial for evaluating business profitability and value.",
};

export default function UnderstandingEBITDAPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
            Back to Resources
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Understanding EBITDA
          </h1>
          <p className="text-xl text-gray-600">
            Master EBITDA and other financial metrics crucial for evaluating
            business profitability and value.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2>What is EBITDA?</h2>
          <p>
            EBITDA stands for{" "}
            <strong>
              Earnings Before Interest, Taxes, Depreciation, and Amortization
            </strong>
            . It's a financial metric used to evaluate a company's operating
            performance by focusing on earnings from core business operations.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-bold text-gray-900 mt-0">
              EBITDA Formula
            </h3>
            <p className="font-mono text-sm mb-2">
              EBITDA = Net Income + Interest + Taxes + Depreciation +
              Amortization
            </p>
            <p className="text-sm text-gray-700 mb-0">Or alternatively:</p>
            <p className="font-mono text-sm m-0">
              EBITDA = Operating Income + Depreciation + Amortization
            </p>
          </div>

          <h2>Why EBITDA Matters</h2>

          <h3>1. Focuses on Operating Performance</h3>
          <p>
            EBITDA removes the effects of financing and accounting decisions,
            allowing you to see how well the business itself performs,
            regardless of its capital structure or tax situation.
          </p>

          <h3>2. Enables Comparison</h3>
          <p>
            By excluding interest, taxes, depreciation, and amortization, you
            can compare businesses of different sizes, capital structures, and
            tax jurisdictions more easily.
          </p>

          <h3>3. Business Valuation</h3>
          <p>
            EBITDA multiples are the most common valuation method for small to
            mid-sized businesses. A typical multiple ranges from 2-5x EBITDA
            depending on industry and business characteristics.
          </p>

          <h3>4. Cash Flow Proxy</h3>
          <p>
            While not the same as cash flow, EBITDA provides a good indication
            of a company's ability to generate cash from operations.
          </p>

          <h2>Breaking Down the Components</h2>

          <h3>Interest</h3>
          <p>
            Costs related to debt financing. Excluded because capital structure
            varies between businesses and new owners may have different
            financing arrangements.
          </p>

          <h3>Taxes</h3>
          <p>
            Corporate income taxes. Excluded because tax situations differ based
            on jurisdiction, entity structure, and other factors unrelated to
            operational performance.
          </p>

          <h3>Depreciation</h3>
          <p>
            Non-cash expense that allocates the cost of tangible assets over
            time. Excluded because it's an accounting convention that doesn't
            reflect actual cash outflow.
          </p>

          <h3>Amortization</h3>
          <p>
            Similar to depreciation but for intangible assets like patents or
            goodwill. Also excluded as a non-cash expense.
          </p>

          <h2>EBITDA vs Other Metrics</h2>

          <h3>EBITDA vs Net Income</h3>
          <p>
            Net income includes all expenses and is affected by financing,
            taxes, and accounting methods. EBITDA focuses purely on operational
            profitability.
          </p>

          <h3>EBITDA vs Operating Income (EBIT)</h3>
          <p>
            Operating income (EBIT) includes depreciation and amortization.
            EBITDA adds these back, providing an even purer measure of cash
            generation potential.
          </p>

          <h3>EBITDA vs Cash Flow</h3>
          <p>
            Cash flow from operations accounts for working capital changes,
            which EBITDA doesn't. However, EBITDA is easier to calculate and
            commonly used for quick comparisons.
          </p>

          <h3>EBITDA vs SDE (Seller's Discretionary Earnings)</h3>
          <p>
            SDE is similar but adds back owner's salary and discretionary
            expenses. It's more commonly used for smaller businesses where the
            owner is heavily involved.
          </p>

          <h2>EBITDA Example Calculation</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
            <p className="font-semibold mb-4">Sample Income Statement:</p>
            <ul className="space-y-2 font-mono text-sm">
              <li>Revenue: $2,000,000</li>
              <li>Cost of Goods Sold: $800,000</li>
              <li className="font-semibold pt-2 border-t">
                Gross Profit: $1,200,000
              </li>
              <li>Operating Expenses: $600,000</li>
              <li>Depreciation: $100,000</li>
              <li>Amortization: $50,000</li>
              <li className="font-semibold pt-2 border-t">
                Operating Income (EBIT): $450,000
              </li>
              <li>Interest Expense: $80,000</li>
              <li className="font-semibold pt-2 border-t">
                Earnings Before Tax: $370,000
              </li>
              <li>Taxes (25%): $92,500</li>
              <li className="font-semibold pt-2 border-t">
                Net Income: $277,500
              </li>
            </ul>
            <p className="font-semibold mt-6 pt-4 border-t">
              EBITDA Calculation:
            </p>
            <ul className="space-y-1 font-mono text-sm mt-2">
              <li>Net Income: $277,500</li>
              <li>+ Interest: $80,000</li>
              <li>+ Taxes: $92,500</li>
              <li>+ Depreciation: $100,000</li>
              <li>+ Amortization: $50,000</li>
              <li className="font-bold pt-2 border-t text-blue-600">
                = EBITDA: $600,000
              </li>
            </ul>
          </div>

          <h2>EBITDA Margins</h2>
          <p>
            EBITDA margin is calculated as EBITDA divided by revenue. It shows
            what percentage of revenue converts to operating profit.
          </p>

          <p className="font-mono bg-gray-50 p-4 rounded">
            EBITDA Margin = (EBITDA / Revenue) × 100
          </p>

          <p>
            Using our example: ($600,000 / $2,000,000) × 100 ={" "}
            <strong>30% EBITDA Margin</strong>
          </p>

          <h3>Industry Benchmarks</h3>
          <ul>
            <li>SaaS/Software: 20-40%</li>
            <li>Manufacturing: 10-20%</li>
            <li>Retail: 5-15%</li>
            <li>Restaurants: 10-15%</li>
            <li>Professional Services: 20-30%</li>
            <li>E-commerce: 5-20%</li>
          </ul>

          <h2>Using EBITDA for Valuation</h2>
          <p>
            Business valuations often use EBITDA multiples. The multiple depends
            on:
          </p>
          <ul>
            <li>Industry and sector</li>
            <li>Company size</li>
            <li>Growth rate</li>
            <li>Customer concentration</li>
            <li>Market conditions</li>
            <li>Competitive advantages</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
            <h3 className="text-lg font-bold text-gray-900 mt-0">
              Valuation Example
            </h3>
            <p className="text-sm">
              If a business has EBITDA of $600,000 and the industry multiple is
              3.5x:
            </p>
            <p className="font-mono text-sm font-semibold text-blue-600 m-0">
              Business Value = $600,000 × 3.5 = $2,100,000
            </p>
          </div>

          <h2>Limitations of EBITDA</h2>

          <h3>1. Ignores Capital Expenditures</h3>
          <p>
            EBITDA doesn't account for the cash needed to maintain or replace
            assets. A business might have strong EBITDA but require significant
            ongoing capital investment.
          </p>

          <h3>2. Doesn't Reflect Working Capital Changes</h3>
          <p>
            Growth often requires increased working capital (inventory,
            receivables). EBITDA doesn't capture these cash requirements.
          </p>

          <h3>3. Can Mask Debt Issues</h3>
          <p>
            By excluding interest, EBITDA can make highly leveraged companies
            look better than they are. Always consider debt levels separately.
          </p>

          <h3>4. Non-GAAP Measure</h3>
          <p>
            EBITDA isn't a GAAP (Generally Accepted Accounting Principles)
            measure, so companies may calculate it differently. Always verify
            the calculation method.
          </p>

          <h3>5. Quality of Earnings</h3>
          <p>
            EBITDA doesn't distinguish between sustainable and one-time
            earnings. Always analyze the components to ensure quality.
          </p>

          <h2>Adjusted EBITDA</h2>
          <p>Many business valuations use "Adjusted EBITDA" which adds back:</p>
          <ul>
            <li>One-time expenses (litigation, restructuring)</li>
            <li>Owner's excessive salary</li>
            <li>Personal expenses run through the business</li>
            <li>Non-recurring costs</li>
            <li>Below-market rent (if owner owns the property)</li>
          </ul>

          <h2>Key Takeaways</h2>
          <ul>
            <li>
              EBITDA measures operational profitability without financing and
              accounting effects
            </li>
            <li>It's the primary metric used for small business valuations</li>
            <li>
              EBITDA multiples typically range from 2-5x depending on industry
            </li>
            <li>
              Higher EBITDA margins indicate better operational efficiency
            </li>
            <li>
              Always use EBITDA alongside other metrics like cash flow and net
              income
            </li>
            <li>
              Verify what's included in EBITDA calculations - adjustments matter
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Find Businesses with Strong EBITDA
          </h3>
          <p className="text-gray-600 mb-6">
            Browse businesses with verified financial metrics including EBITDA,
            revenue, and profit margins.
          </p>
          <Link
            href="/businesses-for-sale"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Browse Businesses for Sale
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </article>
    </main>
  );
}
