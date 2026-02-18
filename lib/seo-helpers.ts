import { Metadata } from "next";

interface SEOPageParams {
  country?: string;
  industry?: string;
  listingType: "business_sale" | "franchise_sale" | "investment_opportunity";
}

interface SEOPageSearchParams {
  [key: string]: string | string[] | undefined;
  city?: string;
  price_min?: string;
  price_max?: string;
  sort?: string;
  page?: string;
}

/**
 * Generate metadata for SEO pages
 * Called by Next.js automatically in page.tsx
 */
export function generateMarketplaceMetadata(
  params: SEOPageParams,
  searchParams: SEOPageSearchParams
): Metadata {
  const { country, industry, listingType } = params;
  const typeLabel =
    listingType === "business_sale"
      ? "Businesses for Sale"
      : listingType === "franchise_sale"
      ? "Franchises for Sale"
      : "Investment Opportunities";

  // Build title based on hierarchy
  let title = typeLabel;
  if (country) {
    title = `${title} in ${decodeURIComponent(country)}`;
  }
  if (industry) {
    title = `${industry ? decodeURIComponent(industry) + " " : ""}${title}`;
  }

  // Build canonical URL (no query params - critical for SEO)
  let canonicalUrl = `https://yoursite.com`;
  if (listingType === "business_sale") {
    canonicalUrl += `/businesses-for-sale`;
  } else if (listingType === "franchise_sale") {
    canonicalUrl += `/franchises-for-sale`;
  } else {
    canonicalUrl += `/investments-for-sale`;
  }

  if (country) {
    canonicalUrl += `/${encodeURIComponent(country.toLowerCase())}`;
  }
  if (industry) {
    canonicalUrl += `/${encodeURIComponent(industry.toLowerCase())}`;
  }

  // Determine if this is a filtered page (has query params)
  const hasFilters = Object.keys(searchParams).length > 0;

  const metadata: Metadata = {
    title: `${title} | Your Marketplace`,
    description: `Browse ${title.toLowerCase()}. Find verified deals with financial details.`,
    robots: {
      index: !hasFilters,
      follow: true,
      nocache: true,
    },
    openGraph: {
      title,
      description: `Browse ${title.toLowerCase()}. Find verified deals with financial details.`,
      url: canonicalUrl,
      type: "website",
      siteName: "Your Marketplace",
    },
  };

  // Add alternates.canonical for proper canonical URL
  metadata.alternates = {
    canonical: canonicalUrl,
  };

  return metadata;
}

/**
 * Generate breadcrumb schema for SEO
 */
export function generateBreadcrumbSchema(
  params: SEOPageParams,
  baseUrl: string = "https://yoursite.com"
) {
  const { country, industry, listingType } = params;
  const breadcrumbs = [{ name: "Home", url: baseUrl }];

  // Add type level
  let typeUrl = baseUrl;
  let typeName = "Businesses";
  if (listingType === "business_sale") {
    typeUrl += "/businesses-for-sale";
    typeName = "Businesses for Sale";
  } else if (listingType === "franchise_sale") {
    typeUrl += "/franchises-for-sale";
    typeName = "Franchises for Sale";
  }
  breadcrumbs.push({ name: typeName, url: typeUrl });

  // Add country level
  if (country) {
    typeUrl += `/${encodeURIComponent(country.toLowerCase())}`;
    breadcrumbs.push({
      name: `${decodeURIComponent(country)}`,
      url: typeUrl,
    });
  }

  // Add industry level
  if (industry) {
    typeUrl += `/${encodeURIComponent(industry.toLowerCase())}`;
    breadcrumbs.push({
      name: decodeURIComponent(industry),
      url: typeUrl,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate collection schema for rich results
 */
export function generateCollectionSchema(
  params: SEOPageParams,
  totalResults: number,
  baseUrl: string = "https://yoursite.com"
) {
  const { country, industry, listingType } = params;
  let url = baseUrl;

  if (listingType === "business_sale") {
    url += "/businesses-for-sale";
  } else if (listingType === "franchise_sale") {
    url += "/franchises-for-sale";
  }

  if (country) url += `/${encodeURIComponent(country.toLowerCase())}`;
  if (industry) url += `/${encodeURIComponent(industry.toLowerCase())}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${industry ? decodeURIComponent(industry) : "All"} ${
      listingType === "business_sale"
        ? "Businesses"
        : listingType === "franchise_sale"
        ? "Franchises"
        : "Investments"
    }`,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalResults,
    },
  };
}
