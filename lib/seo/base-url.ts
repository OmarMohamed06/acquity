export const getBaseUrl = () => {
  // 1. Use explicit production URL from env
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2. Fallback to production domain (NOT Vercel preview URLs)
  // This ensures sitemaps and canonical URLs always use the production domain
  return "https://acquity.co";
};
