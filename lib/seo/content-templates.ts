/**
 * SEO Content Templates
 * Reusable, programmatic intro text for listing types, categories, and locations
 * Keeps content DRY and scalable without blog/fluff
 */

export const listingTypeContent = {
  business_sale: {
    title: "Buy & Sell Businesses",
    intro:
      "Explore verified business opportunities across emerging markets. Find established companies with proven revenue and solid fundamentals.",
    benefits: [
      "Established revenue streams",
      "Verified financial records",
      "Owner transition support",
      "Multiple industries available",
    ],
  },
  franchise_sale: {
    title: "Franchise Opportunities",
    intro:
      "Discover proven franchise concepts ready to scale. Get full training, operational support, and established brand recognition.",
    benefits: [
      "Proven business model",
      "Training & support included",
      "Brand recognition",
      "Lower startup risk",
    ],
  },
  investment_opportunity: {
    title: "Investment Opportunities",
    intro:
      "Invest in high-growth startups and scaling companies. Access equity deals, transparent financials, and vetted founders.",
    benefits: [
      "Early-stage growth potential",
      "Transparent cap tables",
      "Founder background checks",
      "Diversified sectors",
    ],
  },
};

export const generateCategoryIntro = (
  industry: string,
  listingCount: number
): string => {
  const count = listingCount > 0 ? `${listingCount} ` : "";
  return `Browse ${count}${industry.toLowerCase()} business opportunities. Find verified listings with complete financial transparency and seller verification.`;
};

export const generateLocationIntro = (
  country: string,
  city: string | null,
  listingCount: number
): string => {
  const location = city ? `${city}, ${country}` : country;
  const count = listingCount > 0 ? `${listingCount} ` : "";
  return `Discover ${count}business opportunities in ${location}. Curated listings from verified sellers with local market expertise.`;
};

/**
 * Generate empty state message with internal links
 */
export const generateEmptyStateMessage = (
  context: "category" | "location" | "type" | "search",
  params?: { industry?: string; location?: string; type?: string }
): string => {
  const messages: Record<string, string> = {
    category: `No ${
      params?.industry || "listings"
    } available at the moment. Browse other industries or check back soon.`,
    location: `No listings found in ${
      params?.location || "this location"
    }. Explore opportunities in other regions.`,
    type: `No ${
      params?.type || "listings"
    } currently available. Try another listing type.`,
    search: `No results found for your search. Try adjusting your filters or explore featured listings.`,
  };

  return messages[context] || "No listings available at this time.";
};
