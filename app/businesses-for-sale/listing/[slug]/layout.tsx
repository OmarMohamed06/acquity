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
  const listing = await getListingCached("business_sale", slug, {
    includePending: true,
    allowAnyType: true,
  });
  const baseUrl = getBaseUrl();

  if (!listing) {
    return {
      title: "Business for Sale",
      robots: { index: false, follow: false },
    };
  }

  const title = listing.title || "Business Listing";
  const description =
    listing.description ||
    "Explore this business listing and connect with the seller.";

  return {
    title,
    description,
    robots: { index: listing.status === "approved", follow: true },
    alternates: {
      canonical: `${baseUrl}/businesses-for-sale/listing/${listing.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/businesses-for-sale/listing/${listing.slug}`,
      images: listing.image_url ? [{ url: listing.image_url }] : undefined,
    },
  };
}

export default async function BusinessListingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const baseUrl = getBaseUrl();
  const { slug } = await params;
  const listing = await getListingCached("business_sale", slug, {
    includePending: true,
    allowAnyType: true,
  });
  const financials = listing
    ? await getListingFinancials("business_sale", listing.id)
    : null;

  const offerPrice =
    (financials as { asking_price?: number } | null)?.asking_price ?? null;

  return (
    <>
      {listing && listing.status === "approved" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Offer",
            name: listing.title,
            description: listing.description || undefined,
            url: `${baseUrl}/businesses-for-sale/listing/${listing.slug}`,
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
              name: "Businesses for Sale",
              item: `${baseUrl}/businesses-for-sale`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: listing?.title || "Listing",
              item: listing
                ? `${baseUrl}/businesses-for-sale/listing/${listing.slug}`
                : `${baseUrl}/businesses-for-sale`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
