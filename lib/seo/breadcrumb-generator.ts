/**
 * Breadcrumb Generator
 * Creates proper breadcrumb trails for SEO and UX
 */

export interface BreadcrumbPath {
  name: string;
  href: string;
}

export const generateListingBreadcrumbs = (params: {
  listingType: "business_sale" | "franchise_sale" | "investment_opportunity";
  industry: string;
  country?: string;
  city?: string;
  listingTitle: string;
}): BreadcrumbPath[] => {
  const { listingType, industry, country, city, listingTitle } = params;

  const toSlug = (text: string): string =>
    text
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .replace(/^-|-$/g, "");

  const typeMeta = {
    business_sale: {
      label: "Businesses",
      root: "/businesses-for-sale",
      filterBase: "/businesses-for-sale/filter",
    },
    franchise_sale: {
      label: "Franchises",
      root: "/franchises-for-sale",
      filterBase: "/franchises-for-sale/filter",
    },
    investment_opportunity: {
      label: "Investments",
      root: "/investments-for-sale",
      filterBase: "/investments-for-sale/filter",
    },
  }[listingType] || {
    label: "Listings",
    root: "/listings",
    filterBase: "/listings",
  };

  const breadcrumbs: BreadcrumbPath[] = [
    { name: "Home", href: "/" },
    { name: typeMeta.label, href: typeMeta.root },
  ];

  if (industry) {
    const industrySlug = toSlug(industry);
    breadcrumbs.push({
      name: industry,
      href: `${typeMeta.filterBase}/${industrySlug}`,
    });
  }

  if (country && industry) {
    const industrySlug = toSlug(industry);
    const countrySlug = toSlug(country);
    breadcrumbs.push({
      name: country,
      href: `${typeMeta.filterBase}/${industrySlug}/${countrySlug}`,
    });
  }

  if (city && country && industry) {
    const industrySlug = toSlug(industry);
    const countrySlug = toSlug(country);
    const citySlug = toSlug(city);
    breadcrumbs.push({
      name: city,
      href: `${typeMeta.filterBase}/${industrySlug}/${countrySlug}/${citySlug}`,
    });
  }

  breadcrumbs.push({ name: listingTitle, href: "" });

  return breadcrumbs;
};

export const generateCategoryBreadcrumbs = (params: {
  industry?: string;
  country?: string;
  city?: string;
}): BreadcrumbPath[] => {
  const { industry, country, city } = params;

  const breadcrumbs: BreadcrumbPath[] = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
  ];

  if (industry) {
    const industrySlug = industry.toLowerCase().replace(/\s+/g, "-");
    breadcrumbs.push({
      name: industry,
      href: `/category/${industrySlug}`,
    });
  }

  if (country && industry) {
    const industrySlug = industry.toLowerCase().replace(/\s+/g, "-");
    const countrySlug = country.toLowerCase().replace(/\s+/g, "-");
    breadcrumbs.push({
      name: country,
      href: `/category/${industrySlug}/${countrySlug}`,
    });
  }

  if (city && country && industry) {
    const industrySlug = industry.toLowerCase().replace(/\s+/g, "-");
    const countrySlug = country.toLowerCase().replace(/\s+/g, "-");
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    breadcrumbs.push({
      name: city,
      href: `/category/${industrySlug}/${countrySlug}/${citySlug}`,
    });
  }

  return breadcrumbs;
};
