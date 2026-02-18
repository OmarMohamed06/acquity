import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Due Diligence Checklist | Business Acquisition Guide – Acquity",
  description:
    "Essential checklist for investigating a business before purchase. Avoid costly mistakes and hidden liabilities.",
};

export default function DueDiligenceChecklistPage() {
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
            Due Diligence Checklist
          </h1>
          <p className="text-xl text-gray-600">
            Essential checklist for investigating a business before purchase.
            Avoid costly mistakes and hidden liabilities.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2>What is Due Diligence?</h2>
          <p>
            Due diligence is the comprehensive investigation of a business
            before finalizing a purchase. It's your opportunity to verify
            everything the seller has told you and uncover any potential issues
            that could affect the value or viability of the business.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-8">
            <p className="text-sm text-yellow-900 font-semibold mb-2">
              ⚠️ Important
            </p>
            <p className="text-sm text-yellow-800 m-0">
              Never skip due diligence, even if you trust the seller. This
              process protects your investment and can save you from financial
              disaster.
            </p>
          </div>

          <h2>Financial Due Diligence</h2>

          <h3>Financial Statements Review</h3>
          <ul>
            <li>3-5 years of profit & loss statements</li>
            <li>Balance sheets</li>
            <li>Cash flow statements</li>
            <li>Tax returns (personal and business)</li>
            <li>Bank statements</li>
            <li>Accounts receivable aging reports</li>
            <li>Accounts payable</li>
          </ul>

          <h3>Revenue Verification</h3>
          <ul>
            <li>Sales records and invoices</li>
            <li>Customer contracts and agreements</li>
            <li>Revenue concentration analysis</li>
            <li>Seasonal patterns and trends</li>
            <li>Payment terms and collection history</li>
          </ul>

          <h3>Expenses Analysis</h3>
          <ul>
            <li>Operating expense breakdown</li>
            <li>Fixed vs. variable costs</li>
            <li>Owner discretionary expenses</li>
            <li>Vendor contracts and pricing</li>
            <li>Rent or lease agreements</li>
          </ul>

          <h2>Legal Due Diligence</h2>

          <h3>Business Structure & Ownership</h3>
          <ul>
            <li>Articles of incorporation/organization</li>
            <li>Operating agreements or bylaws</li>
            <li>Stock certificates and cap table</li>
            <li>Partnership agreements</li>
            <li>Shareholder records</li>
          </ul>

          <h3>Contracts & Agreements</h3>
          <ul>
            <li>Customer contracts (assignability clause)</li>
            <li>Supplier and vendor agreements</li>
            <li>Lease agreements (real estate and equipment)</li>
            <li>Employment contracts</li>
            <li>Non-compete agreements</li>
            <li>Franchise agreements (if applicable)</li>
            <li>Partnership or joint venture agreements</li>
          </ul>

          <h3>Intellectual Property</h3>
          <ul>
            <li>Trademarks and service marks</li>
            <li>Patents and pending applications</li>
            <li>Copyrights</li>
            <li>Domain names and websites</li>
            <li>Trade secrets and proprietary processes</li>
            <li>Licensing agreements</li>
          </ul>

          <h3>Licenses & Permits</h3>
          <ul>
            <li>Business licenses</li>
            <li>Professional certifications</li>
            <li>Health and safety permits</li>
            <li>Zoning compliance</li>
            <li>Environmental permits</li>
            <li>Industry-specific licenses</li>
          </ul>

          <h3>Litigation & Compliance</h3>
          <ul>
            <li>Pending or past lawsuits</li>
            <li>Regulatory compliance issues</li>
            <li>Insurance claims history</li>
            <li>Tax disputes or liens</li>
            <li>OSHA violations</li>
            <li>Environmental liabilities</li>
          </ul>

          <h2>Operational Due Diligence</h2>

          <h3>Customers</h3>
          <ul>
            <li>Top customer list and revenue contribution</li>
            <li>Customer retention rates</li>
            <li>Customer satisfaction surveys/reviews</li>
            <li>Customer acquisition cost</li>
            <li>Lifetime customer value</li>
          </ul>

          <h3>Suppliers & Vendors</h3>
          <ul>
            <li>Key supplier relationships</li>
            <li>Supply chain dependencies</li>
            <li>Pricing agreements and terms</li>
            <li>Alternative supplier options</li>
            <li>Inventory management practices</li>
          </ul>

          <h3>Employees</h3>
          <ul>
            <li>Organization chart</li>
            <li>Employee roster with compensation</li>
            <li>Key employee retention plans</li>
            <li>Employment contracts</li>
            <li>Benefits and retirement plans</li>
            <li>Worker's compensation claims</li>
            <li>Turnover rates and reasons</li>
            <li>Union agreements (if applicable)</li>
          </ul>

          <h3>Operations & Systems</h3>
          <ul>
            <li>Standard operating procedures</li>
            <li>Technology infrastructure</li>
            <li>Software licenses and subscriptions</li>
            <li>Equipment condition and maintenance</li>
            <li>Facility condition assessment</li>
            <li>Inventory valuation and turnover</li>
          </ul>

          <h2>Market & Competitive Analysis</h2>
          <ul>
            <li>Industry trends and outlook</li>
            <li>Competitive landscape</li>
            <li>Market share and positioning</li>
            <li>Growth opportunities and threats</li>
            <li>Barriers to entry</li>
            <li>Technological disruption risks</li>
          </ul>

          <h2>Real Estate (if included)</h2>
          <ul>
            <li>Property title search</li>
            <li>Survey and boundary verification</li>
            <li>Environmental assessment (Phase I & II)</li>
            <li>Building inspections</li>
            <li>Zoning compliance</li>
            <li>Property tax assessment</li>
            <li>Utility agreements</li>
          </ul>

          <h2>Insurance Review</h2>
          <ul>
            <li>Current insurance policies</li>
            <li>Coverage adequacy</li>
            <li>Claims history</li>
            <li>Premium costs</li>
            <li>Transferability of policies</li>
          </ul>

          <h2>Red Flags to Watch For</h2>
          <ul>
            <li>Reluctance to provide information</li>
            <li>Inconsistent financial records</li>
            <li>Undisclosed liabilities</li>
            <li>Pending lawsuits</li>
            <li>Key customer or employee departures</li>
            <li>Declining sales trends</li>
            <li>Deferred maintenance</li>
            <li>Regulatory violations</li>
            <li>Excessive owner involvement</li>
          </ul>

          <h2>Professional Advisors</h2>
          <p>Engage qualified professionals to assist with due diligence:</p>
          <ul>
            <li>
              <strong>CPA:</strong> Financial statement review and tax analysis
            </li>
            <li>
              <strong>Attorney:</strong> Legal documents and contracts review
            </li>
            <li>
              <strong>Business Broker/Advisor:</strong> Overall guidance and
              negotiation
            </li>
            <li>
              <strong>Industry Expert:</strong> Operational and market
              assessment
            </li>
            <li>
              <strong>Environmental Consultant:</strong> Property assessment (if
              applicable)
            </li>
          </ul>

          <h2>Timeline</h2>
          <p>
            Typical due diligence periods range from 30-90 days depending on
            business complexity. Larger transactions may require more time.
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Find Your Next Acquisition
          </h3>
          <p className="text-gray-600 mb-6">
            Browse verified business listings with comprehensive financial
            information to start your due diligence process.
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
