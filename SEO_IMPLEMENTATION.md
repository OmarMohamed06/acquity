## SEO Implementation Overview

- **Metadata generation**: `lib/seo/meta-generator.ts` trims titles (<60 chars) and descriptions (<155 chars), builds canonical URLs from `NEXT_PUBLIC_SITE_URL`, and emits Open Graph + Twitter cards. Use `generateMeta` for single pages and `generatePaginationMeta` when you have `page > 1` to add prev/next links and auto-noindex paginated pages.
- **URL strategy**: `lib/seo/url-mapping.ts` converts filters into clean paths (`/listings/{type}/{country}/{industry}`) via `generateCleanUrl` and back via `parseCleanUrl`. Query-string filters (price/search) are treated as non-SEO params and should stay noindex to avoid duplicates.
- **Robots directives**: `getRobotsDirective` and `shouldNoindex` enforce `noindex, follow` for empty result sets, draft content, query-param pages, and pagination beyond page 1, while indexing clean routes with content.
- **Structured data**: `lib/seo/schema-builder.ts` ships helpers for breadcrumb lists, collection pages, offers, organization, and website search action. Each helper prefixes URLs with `NEXT_PUBLIC_SITE_URL`.
- **Filter pages**: Listing filter routes (`/businesses-for-sale/filter`, `/franchises-for-sale/filter`, `/investments-for-sale/filter`) now expose SEO-friendly titles/descriptions that include active industry/country filters, keeping crawlers aligned with user-visible state.
- **Environment**: Set `NEXT_PUBLIC_SITE_URL` in `.env` for correct canonicals, structured data URLs, and og/twitter links. Provide an og image URL when relevant via `ogImage` in `generateMeta`.

## How to Apply on a Page

1. Build the clean canonical URL from type/country/industry via `generateCleanUrl` (or your page’s path) and pass it to `generateMeta`.
2. Decide robots: use `getRobotsDirective` for path/query awareness or `shouldNoindex` for content-driven decisions (e.g., empty listings).
3. Add structured data JSON-LD: breadcrumbs for navigational depth, item list for SERP enrichment, and organization/website on top-level pages.
4. For paginated lists, use `generatePaginationMeta` so page 2+ are `noindex` with proper prev/next links.

## Notes

- Keep filterable pages lean: prefer path segments for primary SEO facets (type/country/industry) and query params for secondary facets (price/search), pairing them with `noindex`.
- Ensure each list detail page sets a unique title/description and, where possible, an Offer schema with price and location to avoid thin/duplicate content signals.
