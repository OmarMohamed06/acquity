import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";

export const metadata: Metadata = {
  title: "Franchises for Sale",
  description:
    "Explore proven franchise opportunities worldwide. Find established franchise models with strong unit economics and comprehensive support.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/franchises-for-sale",
  },
  openGraph: {
    title: "Franchises for Sale | Acquity",
    description: "Discover proven franchise models and expansion opportunities",
    type: "website",
    url: "/franchises-for-sale",
  },
  twitter: {
    card: "summary_large_image",
    title: "Franchises for Sale | Acquity",
    description: "Explore proven franchise opportunities worldwide",
  },
};

export default function FranchisesLayout({
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
              name: "Franchises for Sale",
              item: `${baseUrl}/franchises-for-sale`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
