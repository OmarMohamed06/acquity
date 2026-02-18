import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";

export const metadata: Metadata = {
  title: "Investment Opportunities",
  description:
    "Access curated investment opportunities seeking capital. Find high-potential startups and growth companies across emerging markets.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/investments-for-sale",
  },
  openGraph: {
    title: "Investment Opportunities | Acquity",
    description: "Discover curated investment opportunities worldwide",
    type: "website",
    url: "/investments-for-sale",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Opportunities | Acquity",
    description: "Access curated investment opportunities seeking capital",
  },
};

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: baseUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Investment Opportunities",
              item: `${baseUrl}/investments-for-sale`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
