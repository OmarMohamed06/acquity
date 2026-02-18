import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Acquisition Help Center & FAQs | Acquity",
  description:
    "Answers to common questions about buying businesses, franchises, and investment opportunities on Acquity.",
  openGraph: {
    title: "Business Acquisition Help Center & FAQs | Acquity",
    description:
      "Answers to common questions about buying businesses, franchises, and investment opportunities on Acquity.",
    type: "website",
    url: "https://acquity.com/help-center",
  },
};

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "How does a business acquisition marketplace work?",
      answer:
        "Acquity connects business buyers with verified sellers in a secure, transparent marketplace. Sellers list their businesses with detailed financial information and documentation, while buyers can browse, filter, and contact sellers directly. Our platform handles confidentiality agreements, verification, and facilitates the due diligence process to ensure safe transactions for all parties.",
    },
    {
      question: "Is Acquity a business broker?",
      answer:
        "No, Acquity is not a traditional business broker. Instead, we operate as a marketplace platform that connects buyers directly with sellers. We don't represent either party, but we provide the infrastructure, tools, and resources to facilitate transparent business transactions. Our role is to verify listings, maintain confidentiality, and ensure both buyers and sellers have the information they need to make informed decisions.",
    },
    {
      question: "How do I contact sellers?",
      answer:
        "Once you create a verified Acquity account, you can browse listings and express interest in any business. You can message sellers directly through our secure messaging system within the platform. For serious inquiries, you may need to sign an NDA before gaining access to additional confidential information. Sellers typically respond within 24-48 hours to qualified inquiries.",
    },
    {
      question: "What is a serious buyer?",
      answer:
        "A serious buyer is someone who has the financial capacity, motivation, and intent to complete a business acquisition. On Acquity, we identify serious buyers by verifying their financial credentials, understanding their industry experience, and assessing their timeline for acquisition. This helps sellers focus their time on qualified prospects and protects both parties from time-wasting inquiries.",
    },
    {
      question: "Are listings confidential?",
      answer:
        "Yes, confidentiality is a core feature of Acquity. Business owners can control what information is public and what requires an NDA to access. Many sellers keep sensitive financial data, client lists, and supplier information confidential until a serious buyer signs a Non-Disclosure Agreement. This protects business operations from competitors and maintains the privacy of stakeholders.",
    },
    {
      question: "How do NDAs work?",
      answer:
        "A Non-Disclosure Agreement (NDA) is a legal contract that protects sensitive business information from unauthorized disclosure. On Acquity, sellers can require buyers to sign an NDA before accessing confidential financial details, customer information, or operational data. Once you sign, you gain access to restricted information but are legally bound to keep it confidential. NDAs are essential for protecting business value during the sales process.",
    },
    {
      question: "How are businesses verified?",
      answer:
        "Acquity verifies listings through a multi-step process that includes ownership validation, financial documentation review, and information accuracy checks. Sellers must provide proof of ownership, tax returns, and business records. Our team reviews this documentation to ensure listings are legitimate and that the information presented is accurate. This verification process protects buyers from fraudulent or misleading listings.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white overflow-x-hidden antialiased">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">
            Acquity Help Center & Buyer FAQs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about buying businesses,
            franchises, and investment opportunities on Acquity. Learn how our
            marketplace works and what you need to know to make informed
            acquisition decisions.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 lg:px-10 py-12 max-w-4xl mx-auto">
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-start gap-3">
                <span className="flex-shrink-0 text-blue-600 font-semibold text-lg">
                  Q.
                </span>
                {faq.question}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-10 py-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Next Business?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse verified business listings, franchises, and investment
            opportunities on Acquity. Sign up today to start your acquisition
            journey.
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
              Explore Franchises
            </a>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="px-6 lg:px-10 py-16 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Need More Help?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Contact our support team at support@acquity.com for assistance
              with your questions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Resources
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check out our{" "}
              <a
                href="/resources"
                className="text-blue-600 hover:underline font-semibold"
              >
                acquisition guides and resources
              </a>{" "}
              for in-depth information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
