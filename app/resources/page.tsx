import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Business Acquisition Resources | Buy Businesses Smarter – Acquity",
  description:
    "Learn how to buy a business, evaluate franchises, understand EBITDA, and perform due diligence with Acquity's acquisition resources.",
};

export default function ResourcesPage() {
  const guides = [
    {
      title: "How to Sell Your Business",
      description:
        "Practical guide to preparing, valuing, and selling a small business with confidence.",
      icon: "sell",
      href: "/resources/how-to-sell-my-business",
      listingType: "businesses-for-sale",
    },
    {
      title: "How to Buy a Business",
      description:
        "Complete step-by-step guide to acquiring your first business, from finding opportunities to closing the deal.",
      icon: "store",
      href: "/resources/how-to-buy-a-business",
      listingType: "businesses-for-sale",
    },
    {
      title: "Business Valuation Explained",
      description:
        "Learn the fundamentals of business valuation, key metrics, and how to determine fair market value.",
      icon: "assessment",
      href: "/resources/business-valuation",
      listingType: "businesses-for-sale",
    },
    {
      title: "Due Diligence Checklist",
      description:
        "Essential checklist for investigating a business before purchase. Avoid costly mistakes and hidden liabilities.",
      icon: "fact_check",
      href: "/resources/due-diligence-checklist",
      listingType: "businesses-for-sale",
    },
    {
      title: "Franchise vs Business Acquisition",
      description:
        "Compare the pros and cons of buying a franchise versus an independent business to make the right choice.",
      icon: "compare_arrows",
      href: "/resources/franchise-vs-business",
      listingType: "franchises-for-sale",
    },
    {
      title: "Understanding EBITDA",
      description:
        "Master EBITDA and other financial metrics crucial for evaluating business profitability and value.",
      icon: "analytics",
      href: "/resources/understanding-ebitda",
      listingType: "businesses-for-sale",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Business Acquisition Resources & Guides
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're buying your first business, evaluating a franchise,
              or seeking investment opportunities, our comprehensive guides will
              help you make informed decisions. Learn the fundamentals of
              business acquisition, understand valuation methods, master due
              diligence, and discover the key differences between franchises and
              independent businesses. Our resources are designed to equip both
              first-time buyers and experienced investors with the knowledge
              needed to succeed in today's marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <article
              key={guide.href}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  {guide.icon}
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {guide.title}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {guide.description}
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href={guide.href}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
                >
                  Read Guide
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>

                <Link
                  href={`/${guide.listingType}`}
                  className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-primary transition-colors"
                >
                  Browse Relevant Listings
                  <span className="material-symbols-outlined text-[16px]">
                    open_in_new
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Ready to Find Your Next Opportunity?
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Explore thousands of businesses, franchises, and investment
              opportunities across emerging markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/businesses-for-sale"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Businesses
                <span className="material-symbols-outlined">trending_up</span>
              </Link>
              <Link
                href="/franchises-for-sale"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
              >
                Explore Franchises
                <span className="material-symbols-outlined">store</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
