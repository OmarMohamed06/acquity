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
  const canonicalPath = `/franchises-for-sale/${segments.join("/")}`;
  const shouldIndex = segments.length <= 1;

  return {
    title: "Franchises for Sale",
    description: "Explore franchise opportunities by industry and region.",
    robots: { index: shouldIndex, follow: true },
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function FranchisesFilterLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments: paramSegments } = await params;
  const baseUrl = getBaseUrl();
  const segments = paramSegments || [];
  const canonicalPath = `${baseUrl}/franchises-for-sale/${segments.join("/")}`;

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
