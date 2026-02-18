import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";

export const metadata: Metadata = {
  title: "Businesses for Sale",
  description:
    "Browse verified businesses for sale globally. Find profitable business opportunities with detailed financials and valuations.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/businesses-for-sale",
  },
  openGraph: {
    title: "Businesses for Sale | Acquity",
    description: "Discover verified business opportunities worldwide",
    type: "website",
    url: "/businesses-for-sale",
  },
  twitter: {
    card: "summary_large_image",
    title: "Businesses for Sale | Acquity",
    description: "Browse verified businesses for sale globally",
  },
};

export default function BusinessesLayout({
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
              name: "Businesses for Sale",
              item: `${baseUrl}/businesses-for-sale`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
