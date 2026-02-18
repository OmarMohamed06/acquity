import type { Metadata } from "next";
import { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides and resources for buying, selling, and investing.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesLayout({ children }: { children: ReactNode }) {
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
              name: "Resources",
              item: `${baseUrl}/resources`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
