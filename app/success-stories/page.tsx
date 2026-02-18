import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Acquisition Success Stories | Acquity Marketplace",
  description:
    "Realistic business acquisition scenarios showing how buyers evaluate, acquire, and grow businesses using Acquity.",
  openGraph: {
    title: "Business Acquisition Success Stories | Acquity Marketplace",
    description:
      "Realistic business acquisition scenarios showing how buyers evaluate, acquire, and grow businesses using Acquity.",
    type: "website",
    url: "https://acquity.com/success-stories",
  },
};

export default function SuccessStoriesPage() {
  const useCases = [
    {
      title: "Acquiring a Profitable Tech Business",
      summary: "How a software engineer acquired a profitable SaaS company",
      challenge:
        "Marcus, a software engineer with 10 years of experience, wanted to move from employment to entrepreneurship. He searched for established tech businesses that generated consistent revenue but lacked strategic growth initiatives.",
      solution:
        "Through Acquity, Marcus found a 5-year-old web design and development agency with $450K annual revenue, 12 employees, and strong client retention. The owner was ready to retire and offered detailed financial records, client contracts, and employee agreements. Marcus signed an NDA to review sensitive information including the client list and project pipeline.",
      outcome:
        "Marcus negotiated a price of $850K based on 1.9x revenue multiple. Post-acquisition, he implemented new project management systems, expanded the service offering to include digital marketing, and grew revenue to $680K within 18 months. He retained all employees and attracted new high-value clients through his network.",
      metrics: [
        { label: "Acquisition Price", value: "$850K" },
        { label: "Revenue Multiple", value: "1.9x" },
        { label: "Post-Acquisition Growth", value: "+50% in 18 months" },
        { label: "Employees Retained", value: "12/12" },
      ],
    },
    {
      title: "Buying an Established Franchise",
      summary: "How a former corporate executive became a franchise owner",
      challenge:
        "Sarah, a former operations director, wanted to own a business with proven systems and brand recognition. She needed a business acquisition example that showed manageable risk with clear operational frameworks.",
      solution:
        "Sarah identified a fast-food franchise opportunity on Acquity with 8 years of operational history. The franchisor provided audited financial statements, equipment costs, training requirements, and ongoing support details. Sarah performed thorough due diligence, including speaking with other franchise owners and analyzing local demographics.",
      outcome:
        "Sarah invested $320K to acquire the franchise (initial investment: $280K, working capital: $40K). She completed the franchisor's training program and maintained the operational standards. The franchise generated $95K EBITDA in year one and $140K in year two, exceeding initial projections by 20%.",
      metrics: [
        { label: "Initial Investment", value: "$320K" },
        { label: "Year 1 EBITDA", value: "$95K" },
        { label: "Year 2 EBITDA", value: "$140K" },
        { label: "ROI (Year 2)", value: "43.75%" },
      ],
    },
    {
      title: "Minority Investment in a Growing SME",
      summary:
        "How an investor partnered in a high-growth small business acquisition",
      challenge:
        "David, an accredited investor, sought a buying a small business case study where he could provide capital and strategic guidance without full operational responsibility. He needed exposure to growth-stage companies with experienced management.",
      solution:
        "David found a specialty manufacturing company on Acquity with $2.2M revenue, strong margins (22% EBITDA), and a 5-year growth plan. The owner sought a minority investment partner to fund expansion into new markets. David negotiated a 30% equity stake for $550K, with clear governance terms and exit provisions.",
      outcome:
        "Over 3 years, the company expanded to 3 new territories, grew revenue to $4.1M, and achieved 28% EBITDA margins. David's equity stake increased in value, and he received annual dividend distributions. The exit opportunity emerged when a larger competitor offered to acquire the company, valuing David's stake at $2.1M.",
      metrics: [
        { label: "Initial Investment", value: "$550K" },
        { label: "Equity Stake", value: "30%" },
        { label: "Revenue Growth", value: "$2.2M → $4.1M" },
        { label: "Exit Valuation (Stake)", value: "$2.1M (382% ROI)" },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white overflow-x-hidden antialiased">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">
            Business Acquisition Success Stories & Use Cases
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Realistic business acquisition scenarios showing how buyers
            evaluate, acquire, and grow businesses using Acquity. Learn from
            real-world examples of successful acquisitions across different
            business types and investment structures.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 lg:px-10 py-12 max-w-4xl mx-auto">
        <div className="space-y-16">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-6 py-8 lg:px-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Use Case {index + 1}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {useCase.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {useCase.summary}
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-8 lg:px-8 space-y-6">
                {/* Challenge */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-600">📋</span>
                    The Challenge
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {useCase.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-600">🎯</span>
                    The Solution
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {useCase.solution}
                  </p>
                </div>

                {/* Outcome */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-600">✅</span>
                    The Outcome
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {useCase.outcome}
                  </p>
                </div>

                {/* Metrics */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {useCase.metrics.map((metric, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-800 rounded p-4 text-center"
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {metric.label}
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="px-6 lg:px-10 py-16 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 mt-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Common Patterns Across Successful Acquisitions
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              Thorough Due Diligence
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Successful buyers review financial records, contracts, employee
              agreements, and market positioning before committing capital.
              Acquity's document verification system supports this process.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              Clear Value Drivers
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Buyers identify specific opportunities for growth, cost savings,
              or market expansion post-acquisition. This drives pricing and
              post-acquisition strategy.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              Realistic Financial Modeling
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Conservative projections and clear assumptions lead to better
              outcomes. Successful acquisitions typically meet or exceed
              projections when based on realistic data.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              Transparent Communication
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Open dialogue with sellers about expectations, timelines, and
              concerns accelerates negotiations and builds trust in the
              transaction.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-10 py-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Explore verified business listings, evaluate opportunities, and find
            your next acquisition on Acquity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/businesses-for-sale"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Businesses
            </a>
            <a
              href="/franchises-for-sale"
              className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Franchises
            </a>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="px-6 lg:px-10 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Learn More About Business Acquisitions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/resources"
            className="block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>📚</span>
              Acquisition Guides
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Deep-dive guides on business valuation, due diligence, and
              acquisition strategies.
            </p>
          </a>
          <a
            href="/help-center"
            className="block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>❓</span>
              Help Center & FAQs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Answers to common questions about the acquisition process and
              marketplace.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
