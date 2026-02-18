import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Buy a Business | Complete Guide – Acquity",
  description:
    "Complete step-by-step guide to acquiring your first business, from finding opportunities to closing the deal.",
};

export default function HowToBuyABusinessPage() {
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
            How to Buy a Business
          </h1>
          <p className="text-xl text-gray-600">
            Complete step-by-step guide to acquiring your first business, from
            finding opportunities to closing the deal.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            Buying a business is one of the most significant financial decisions
            you'll ever make. Whether you're a first-time buyer or an
            experienced entrepreneur, understanding the process is crucial for
            success.
          </p>

          <h2>Step 1: Define Your Criteria</h2>
          <p>
            Before you start searching, determine what type of business aligns
            with your:
          </p>
          <ul>
            <li>Budget and financial capacity</li>
            <li>Industry experience and interests</li>
            <li>Geographic preferences</li>
            <li>Time commitment availability</li>
            <li>Growth and exit strategy goals</li>
          </ul>

          <h2>Step 2: Search for Opportunities</h2>
          <p>
            Use platforms like Acquity to browse verified business listings.
            Filter by industry, location, price range, and revenue to find
            matches that meet your criteria.
          </p>

          <h2>Step 3: Initial Evaluation</h2>
          <p>When you find a promising business, review:</p>
          <ul>
            <li>Financial statements (profit & loss, balance sheet)</li>
            <li>Revenue trends and customer base</li>
            <li>Competitive positioning</li>
            <li>Operational requirements</li>
            <li>Reason for sale</li>
          </ul>

          <h2>Step 4: Make an Offer</h2>
          <p>
            Based on your valuation, submit a Letter of Intent (LOI) outlining:
          </p>
          <ul>
            <li>Proposed purchase price</li>
            <li>Payment terms and structure</li>
            <li>Due diligence period</li>
            <li>Contingencies and conditions</li>
          </ul>

          <h2>Step 5: Conduct Due Diligence</h2>
          <p>
            This is the most critical phase. Thoroughly investigate the business
            including:
          </p>
          <ul>
            <li>Financial records verification</li>
            <li>Legal compliance and contracts</li>
            <li>Customer and supplier relationships</li>
            <li>Operational systems and processes</li>
            <li>Employee agreements and culture</li>
          </ul>

          <h2>Step 6: Secure Financing</h2>
          <p>Options for financing your business acquisition include:</p>
          <ul>
            <li>SBA loans (Small Business Administration)</li>
            <li>Traditional bank financing</li>
            <li>Seller financing</li>
            <li>Private investors or partners</li>
            <li>Personal savings and assets</li>
          </ul>

          <h2>Step 7: Negotiate Final Terms</h2>
          <p>
            Work with your attorney and accountant to finalize the purchase
            agreement, addressing:
          </p>
          <ul>
            <li>Asset vs. stock purchase structure</li>
            <li>Non-compete agreements</li>
            <li>Transition and training period</li>
            <li>Allocation of purchase price</li>
            <li>Warranties and representations</li>
          </ul>

          <h2>Step 8: Close the Deal</h2>
          <p>Final steps to complete the acquisition:</p>
          <ul>
            <li>Review and sign all legal documents</li>
            <li>Transfer ownership and licenses</li>
            <li>Notify employees, customers, and suppliers</li>
            <li>Update business registrations</li>
            <li>Begin the transition process</li>
          </ul>

          <h2>Post-Acquisition Success Tips</h2>
          <ul>
            <li>Maintain consistency during the transition</li>
            <li>Build relationships with key stakeholders</li>
            <li>Implement improvements gradually</li>
            <li>Track performance metrics closely</li>
            <li>Seek advice from mentors and advisors</li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Find Your Business?
          </h3>
          <p className="text-gray-600 mb-6">
            Browse our curated listings of businesses for sale across multiple
            industries and locations.
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
