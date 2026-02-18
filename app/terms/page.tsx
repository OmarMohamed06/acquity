import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Last updated: January 2026
          </p>

          <section className="space-y-8">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Acquity Marketplace ("Platform", "we", "our", "us").
                By accessing or using our website, you agree to be bound by
                these Terms & Conditions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you do not agree, please do not use the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Platform Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Acquity Marketplace is an online listing platform that allows
                business owners, franchisors, and founders ("Sellers") to
                publish business, franchise, or investment opportunity listings,
                and allows interested parties ("Buyers") to view listings and
                contact sellers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We are not a broker, advisor, agent, or intermediary.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. No Brokerage or Advisory Role
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>We do not participate in negotiations</li>
                <li>We do not verify financial performance</li>
                <li>
                  We do not provide legal, financial, or investment advice
                </li>
                <li>We do not charge success fees or commissions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                All transactions, negotiations, and due diligence are conducted
                entirely between users.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Listings & Fees
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>The Platform charges listing fees only</li>
                <li>Fees are non-refundable once a listing is published</li>
                <li>
                  Publishing a listing does not guarantee interest, leads, or
                  sale
                </li>
                <li>
                  We reserve the right to reject, suspend, or remove listings at
                  our discretion.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. User Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using the Platform, you agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All information you submit is accurate and truthful</li>
                <li>
                  You have the legal right to list the business or opportunity
                </li>
                <li>
                  You will not submit misleading, fraudulent, or illegal content
                </li>
                <li>You are responsible for compliance with all local laws</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. No Guarantee of Accuracy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Listings are provided as submitted by users. We do not verify:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>Financial statements</li>
                <li>Revenue figures</li>
                <li>Valuations</li>
                <li>Ownership claims</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Use the Platform at your own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  We are not liable for losses, damages, disputes, or claims
                  arising from listings or user interactions
                </li>
                <li>
                  We are not responsible for failed transactions or
                  misrepresentation by users
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                All content, branding, and software on the Platform are owned by
                Acquity Marketplace unless otherwise stated. You may not copy,
                reproduce, or distribute without permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Account Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may suspend or terminate accounts that violate these terms or
                harm the Platform or its users.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update these Terms at any time. Continued use of the
                Platform constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Contact
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions regarding these Terms, contact:{" "}
                <a
                  href="mailto:support@acquityapp.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  support@acquityapp.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
