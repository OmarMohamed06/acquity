/**
 * Meta Generator
 * Creates SEO-optimized title, description, canonical, and robots directives
 */

export interface MetaParams {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  nofollow?: boolean;
  prevPage?: string;
  nextPage?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://acquityapp.com";
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;

export const generateMeta = (params: MetaParams) => {
  const { title, description, canonical, ogImage, noindex, nofollow } = params;

  // Ensure title and description fit SEO constraints
  const limitedTitle = title.substring(0, MAX_TITLE_LENGTH);
  const limitedDescription = description.substring(0, MAX_DESCRIPTION_LENGTH);

  return {
    title: limitedTitle,
    description: limitedDescription,
    canonical: canonical || `${SITE_URL}`,
    robots: `${noindex ? "noindex" : "index"},${
      nofollow ? "nofollow" : "follow"
    }`,
    openGraph: {
      title: limitedTitle,
      description: limitedDescription,
      url: canonical || SITE_URL,
      ...(ogImage && { image: ogImage }),
    },
    twitter: {
      card: "summary_large_image",
      title: limitedTitle,
      description: limitedDescription,
    },
  };
};

export const generatePaginationMeta = (params: {
  title: string;
  description: string;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  noindex?: boolean;
}) => {
  const { title, description, currentPage, totalPages, baseUrl, noindex } =
    params;

  const meta = generateMeta({
    title,
    description,
    canonical: `${SITE_URL}${baseUrl}${
      currentPage > 1 ? `?page=${currentPage}` : ""
    }`,
    noindex: currentPage > 1 || noindex, // Noindex pages beyond page 1 to avoid duplication
  });

  // Add prev/next pagination links
  const paginationLinks: Record<string, string> = {};

  if (currentPage > 1) {
    paginationLinks.prev =
      currentPage === 2
        ? `${SITE_URL}${baseUrl}`
        : `${SITE_URL}${baseUrl}?page=${currentPage - 1}`;
  }

  if (currentPage < totalPages) {
    paginationLinks.next = `${SITE_URL}${baseUrl}?page=${currentPage + 1}`;
  }

  return { ...meta, paginationLinks };
};

/**
 * Check if a page should be noindex based on content rules
 */
export const shouldNoindex = (params: {
  hasContent: boolean;
  isDraft?: boolean;
  filterParamCount?: number;
}): boolean => {
  const { hasContent, isDraft, filterParamCount = 0 } = params;

  // Noindex rules:
  // 1. Empty results
  if (!hasContent) return true;

  // 2. Draft listings
  if (isDraft) return true;

  // 3. Excessive query params (crawl budget protection)
  if (filterParamCount > 3) return true;

  return false;
};
