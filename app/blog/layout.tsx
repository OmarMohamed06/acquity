import { Metadata } from "next";
import { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Expert insights for buying, selling, and investing in businesses. Learn from real acquisitions.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Acquity",
    description: "Expert insights for business acquisition",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
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
              name: "Blog",
              item: `${baseUrl}/blog`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
