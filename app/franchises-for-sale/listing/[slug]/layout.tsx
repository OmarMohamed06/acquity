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
  const listing = await getListingCached("franchise_sale", slug, {
    includePending: true,
    allowAnyType: true,
  });
  const baseUrl = getBaseUrl();

  if (!listing) {
    return {
      title: "Franchise for Sale",
      robots: { index: false, follow: false },
    };
  }

  const title = listing.title || "Franchise Listing";
  const description =
    listing.description ||
    "Explore this franchise listing and connect with the seller.";

  return {
    title,
    description,
    robots: { index: listing.status === "approved", follow: true },
    alternates: {
      canonical: `${baseUrl}/franchises-for-sale/listing/${listing.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${baseUrl}/franchises-for-sale/listing/${listing.slug}`,
      images: listing.image_url ? [{ url: listing.image_url }] : undefined,
    },
  };
}

export default async function FranchiseListingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const baseUrl = getBaseUrl();
  const { slug } = await params;
  const listing = await getListingCached("franchise_sale", slug, {
    includePending: true,
    allowAnyType: true,
  });
  const financials = listing
    ? await getListingFinancials("franchise_sale", listing.id)
    : null;

  const offerPrice =
    (financials as { franchise_fee?: number } | null)?.franchise_fee ?? null;

  return (
    <>
      {listing && listing.status === "approved" && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Offer",
            name: listing.title,
            description: listing.description || undefined,
            url: `${baseUrl}/franchises-for-sale/listing/${listing.slug}`,
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
              name: "Franchises for Sale",
              item: `${baseUrl}/franchises-for-sale`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: listing?.title || "Listing",
              item: listing
                ? `${baseUrl}/franchises-for-sale/listing/${listing.slug}`
                : `${baseUrl}/franchises-for-sale`,
            },
          ],
        }}
      />
      {children}
    </>
  );
}
