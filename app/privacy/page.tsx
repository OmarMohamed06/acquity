import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Acquity Marketplace",
  description:
    "Learn how Acquity collects, uses, and protects your personal data when you use our business acquisition marketplace.",
  openGraph: {
    title: "Privacy Policy | Acquity Marketplace",
    description:
      "Learn how Acquity collects, uses, and protects your personal data when you use our business acquisition marketplace.",
    type: "website",
    url: "https://acquity.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white overflow-x-hidden antialiased">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Learn how Acquity collects, uses, and protects your personal data
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Effective Date:</strong> February 3, 2026
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 lg:px-10 py-12 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 lg:p-12 space-y-8">
          {/* Intro */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Acquity ("we," "our," or "us") values your privacy. This Privacy
              Policy explains how we collect, use, store, and protect your
              information when you use our website and services.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By using Acquity, you agree to the practices described in this
              policy.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may collect the following information:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  Personal details (name, email address, phone number)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Account information when you sign up</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Business inquiry and contact form submissions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  Usage data (pages visited, interactions, device type)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Authentication data (Google sign-in, if used)</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4 font-semibold">
              We do not sell your personal data.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Operate and improve the Acquity marketplace</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Connect buyers with sellers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Respond to inquiries and support requests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Verify serious buyers and prevent fraud</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Improve user experience and platform security</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Data Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may share data only with:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>
                  Service providers (hosting, analytics, authentication)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Sellers when you submit an inquiry</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Legal authorities if required by law</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4 font-semibold">
              We never share data for advertising resale.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Cookies & Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Remember user preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Analyze platform usage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Improve performance and security</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              You may disable cookies in your browser settings.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We implement reasonable technical and organizational measures to
              protect your information. However, no online system is 100%
              secure.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="space-y-2 ml-6 text-gray-700 dark:text-gray-300 mb-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Access your data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Request correction or deletion</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Withdraw consent</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Request data portability</span>
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You may contact us at{" "}
              <a
                href="mailto:support@acquity.co"
                className="text-blue-600 hover:underline font-semibold"
              >
                support@acquity.co
              </a>
              .
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Acquity may contain links to third-party services. We are not
              responsible for their privacy practices.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this policy from time to time. Changes will be
              posted on this page.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              For privacy questions, contact:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                📧{" "}
                <a
                  href="mailto:support@acquity.co"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  support@acquity.co
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-10 py-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Explore verified business listings and find your next opportunity on
            Acquity. Your data is safe with us.
          </p>
          <a
            href="/businesses-for-sale"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Businesses
          </a>
        </div>
      </section>
    </div>
  );
}
