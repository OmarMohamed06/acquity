/**
 * Schema Builder
 * Generates structured data for SEO
 * Used for breadcrumbs, listings, offers, organization
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com"}${
        item.url
      }`,
    })),
  };
};

export const generateItemListSchema = (
  items: Array<{ id: string; name: string; url: string; price?: string }>,
  type: "ListingsCollection" | "CategoryPage"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com"}${
        item.url
      }`,
      name: item.name,
      ...(item.price && { price: item.price }),
    })),
  };
};

export const generateOfferSchema = (listing: {
  id: string;
  title: string;
  price: string;
  description: string;
  location: string;
  type: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: listing.title,
    description: listing.description,
    priceCurrency: "USD",
    price: listing.price,
    availability: "https://schema.org/InStock",
    areaServed: listing.location,
    businessType: listing.type,
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Acquity - Global Business Marketplace",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com",
    logo: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com"
    }/logo.png`,
    description:
      "Global marketplace for buying, selling, and investing in businesses across emerging markets.",
    sameAs: [
      "https://twitter.com/acquity",
      "https://linkedin.com/company/acquity",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@acquityapp.com",
    },
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com",
    name: "Acquity",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com"
        }/listings?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
};
