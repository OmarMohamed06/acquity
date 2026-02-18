import type { Metadata } from "next";
import { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}): Promise<Metadata> {
  const { segments: paramSegments } = await params;
  const segments = paramSegments || [];
  const canonicalPath = `/businesses-for-sale/${segments.join("/")}`;
  const shouldIndex = segments.length <= 1;

  return {
    title: "Businesses for Sale",
    description:
      "Browse verified businesses for sale globally by category and location.",
    robots: { index: shouldIndex, follow: true },
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function BusinessesFilterLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments: paramSegments } = await params;
  const baseUrl = getBaseUrl();
  const segments = paramSegments || [];
  const canonicalPath = `${baseUrl}/businesses-for-sale/${segments.join("/")}`;

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
            ...(segments.length
              ? [
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "Filtered",
                    item: canonicalPath,
                  },
                ]
              : []),
          ],
        }}
      />
      {children}
    </>
  );
}
