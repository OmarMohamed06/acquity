import type { Metadata } from "next";
import { ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/base-url";
import { getListingCached, getListingFinancials } from "@/lib/seo/listing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingCached("investment_opportunity", slug, {
    includePending: true,
    allowAnyType: true,
  });
  const baseUrl = getBaseUrl();

  if (!listing) {
    return {
      title: "Investment Opportunity",
      robots: { index: false, follow: false },
    };
  }

  const title = listing.title || "Investment Opportunity";
  const description =
    listing.description ||
    "Explore this investment opportunity and connect with the founder.";

  return {
    title,
    description,
    robots: { index: listing.status === "approved", follow: true },
    alternates: {
      canonical: `${baseUrl}/investments-for-sale/listing/${listing.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/investments-for-sale/listing/${listing.slug}`,
      images: listing.image_url ? [{ url: listing.image_url }] : undefined,
    },
  };
}

export default async function InvestmentListingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const baseUrl = getBaseUrl();
  const { slug } = await params;
  const listing = await getListingCached("investment_opportunity", slug, {
    includePending: true,
    allowAnyType: true,
  });
  const financials = listing
    ? await getListingFinancials("investment_opportunity", listing.id)
    : null;

  const offerPrice =
    (financials as { capital_required?: number } | null)?.capital_required ??
    null;

  return (
    <>
      {listing && listing.status === "approved" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Offer",
            name: listing.title,
            description: listing.description || undefined,
            url: `${baseUrl}/investments-for-sale/listing/${listing.slug}`,
            image: listing.image_url || undefined,
            price: offerPrice ?? undefined,
            priceCurrency: offerPrice ? "USD" : undefined,
            itemOffered: {
              "@type": "Organization",
              name: listing.title,
            },
          }}
        />
      )}
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
            {
              "@type": "ListItem",
              position: 3,
              name: listing?.title || "Listing",
              item: listing
                ? `${baseUrl}/investments-for-sale/listing/${listing.slug}`
                : `${baseUrl}/investments-for-sale`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
