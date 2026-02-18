/\*\*

- ROUTING & SEO IMPLEMENTATION GUIDE
-
- This document explains how to implement the foundational routing
- and SEO structure across your Next.js marketplace.
  \*/

/\*\*

- ============================================================================
- PART 1: NEXT.JS ROUTE STRUCTURE
- ============================================================================
-
- File structure for app router:
-
- app/
- ├── layout.tsx (root layout with SEO metadata)
- ├── page.tsx (homepage)
- ├── listings/
- │ ├── page.tsx (listings index - public, indexable)
- │ └── [slug]/
- │ └── page.tsx (listing detail - public, indexable)
- ├── category/
- │ └── [name]/
- │ └── page.tsx (category page - public, indexable)
- ├── search/
- │ └── page.tsx (search results - public, indexable)
- ├── login/
- │ └── page.tsx (private, noindex)
- ├── signup/
- │ └── page.tsx (private, noindex)
- ├── account/
- │ └── page.tsx (private, noindex)
- ├── list-business/
- │ └── page.tsx (private, noindex)
- ├── api/
- │ ├── listings/
- │ │ ├── route.ts (GET/POST /api/listings)
- │ │ └── [id]/
- │ │ └── route.ts (GET/PUT/DELETE /api/listings/:id)
- │ └── search/
- │ └── route.ts (POST /api/search)
- └── robots.txt (generated or static)
-
- IMPORTANT: Do NOT nest [slug] inside [type] because:
- - Slugs are globally unique and already contain type info
- - Simpler routing: /listings/[slug] instead of /listings/[type]/[slug]
- - Easier SEO: one canonical URL per listing
    \*/

/\*\*

- ============================================================================
- PART 2: SLUG USAGE THROUGHOUT THE APP
- ============================================================================
-
- STORAGE:
- - Generate slug once at listing creation using generateListingSlug()
- - Store slug in database as permanent identifier
- - Never regenerate or change slug after creation
- - If you must change a slug, create 301 redirect
-
- ROUTING:
- - Use slug in all public URLs: /listings/[slug]
- - API can accept either ID or slug for listing lookups
- - Database queries should use listing.id for performance
-
- SEO:
- - Slug is the canonical URL identifier
- - Includes human-readable title for SEO keywords
- - Example: "enterprise-payment-gateway-business-sale-abc123"
- - Slug format makes listings discoverable in search results
    \*/

/\*\*

- ============================================================================
- PART 3: TYPE CONSISTENCY
- ============================================================================
-
- Use these consistently everywhere:
-
- DATABASE:
- - listing.type = "business_sale" | "franchise_sale" | "investment_opportunity"
- - Use ListingType enum for TypeScript safety
-
- ROUTES & FILTERS:
- - URL parameters use segments: "business", "franchise", "investment"
- - Convert with getTypeFromSegment() / getSegmentFromType()
- - Example: /listings?type=business converts to type: "business_sale"
-
- API:
- - Accept both full type ("business_sale") and segment ("business")
- - Return full type in responses
- - Use normalizeListingType() for flexible input handling
-
- UI:
- - Display names from TYPE_DISPLAY_NAMES
- - Never hardcode type strings
- - Use TYPE_DISPLAY_NAMES["business_sale"] => "Full Business"
    \*/

/\*\*

- ============================================================================
- PART 4: PUBLIC VS PRIVATE ROUTES
- ============================================================================
-
- PUBLIC ROUTES (indexable by search engines):
- - /
- - /listings
- - /listings?type=...&category=...&country=...
- - /listings/[slug] (individual listing)
- - /category/[name]
- - /search?q=...
- - Metadata: { robots: { index: true, follow: true } }
-
- PRIVATE ROUTES (should NOT be indexed):
- - /login
- - /signup
- - /account/\*
- - /list-business
- - /checkout/\*
- - /admin/\*
- - Metadata: { robots: { index: false, follow: false } }
-
- IMPLEMENTATION:
- 1.  Use isPublicRoute() / isPrivateRoute() in layouts
- 2.  Add <meta name="robots" content="noindex,nofollow" /> to private pages
- 3.  Or use getPrivateRouteSEOMetadata() for automatic meta generation
- 4.  robots.txt disallows admin and account routes
      \*/

/\*\*

- ============================================================================
- PART 5: SEO IMPLEMENTATION IN NEXT.JS
- ============================================================================
-
- METADATA API (Next.js 13.2+):
-
- app/listings/[slug]/page.tsx:
-
- import { getListingSEOMetadata } from "@/lib/seo-metadata";
-
- export async function generateMetadata({ params }) {
-     const listing = await getListingBySlug(params.slug);
-     const seoData = getListingSEOMetadata(listing, "https://yoursite.com");
-
-     return {
-       title: seoData.title,
-       description: seoData.description,
-       alternates: {
-         canonical: seoData.canonical,
-       },
-       robots: {
-         index: seoData.robots.index,
-         follow: seoData.robots.follow,
-       },
-     };
- }
-
- ROBOTS.TXT:
-
- public/robots.txt or app/robots.ts:
-
- export default function robots() {
-     return {
-       rules: [
-         { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/checkout"] },
-       ],
-       sitemap: "https://yoursite.com/sitemap.xml",
-     };
- }
-
- SITEMAP.XML:
-
- app/sitemap.ts:
-
- export default async function sitemap() {
-     const listings = await getAllPublishedListings();
-     return [
-       {
-         url: "https://yoursite.com/listings",
-         lastModified: new Date(),
-         changeFrequency: "daily",
-         priority: 1.0,
-       },
-       ...listings.map(listing => getListingSitemapEntry(listing, baseUrl)),
-     ];
- }
  \*/

/\*\*

- ============================================================================
- PART 6: FILTER & QUERY HANDLING
- ============================================================================
-
- SERIALIZATION (filter object => URL):
-
- import { serializeFilters } from "@/lib/filters";
-
- const filters = { type: "business_sale", country: "US" };
- const query = serializeFilters(filters);
- // Result: "type=business&country=US"
- // URL: /listings?type=business&country=US
-
- DESERIALIZATION (URL => filter object):
-
- import { deserializeFilters } from "@/lib/filters";
-
- const filters = deserializeFilters("type=business&country=US");
- // Result: { type: "business_sale", country: "US" }
-
- BUILDING FILTER URLS:
-
- import { buildFilterUrl } from "@/lib/filters";
-
- const url = buildFilterUrl("/listings", { type: "business_sale" });
- // Result: "/listings?type=business"
  \*/

/\*\*

- ============================================================================
- PART 7: API DESIGN
- ============================================================================
-
- GET /api/listings
- - Query params: type, category, country, minPrice, maxPrice, sort, page
- - Response: { listings: Listing[], total: number, page: number }
- - Accepts both full type and segment: ?type=business or ?type=business_sale
-
- GET /api/listings/[id]
- - Path params: id (listing ID)
- - Response: { listing: Listing }
-
- POST /api/listings (requires auth)
- - Body: { title, type, price, ... }
- - Response: { listing: Listing, slug: string }
- - MUST generate slug here and store it
-
- PUT /api/listings/[id] (requires auth)
- - Body: partial Listing object
- - NOTE: slug should NOT be updatable
- - Response: { listing: Listing }
-
- DELETE /api/listings/[id] (requires auth)
- - Response: { success: true }
-
- GET /api/search
- - Query params: q (search query), type, category, ...
- - Response: { results: Listing[], total: number }
    \*/

/\*\*

- ============================================================================
- PART 8: DATABASE SCHEMA CONSIDERATION
- ============================================================================
-
- Example Supabase/PostgreSQL listing table:
-
- CREATE TABLE listings (
- id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
- slug VARCHAR(255) UNIQUE NOT NULL, -- Generated once, never changed
- type VARCHAR(50) NOT NULL, -- business_sale, franchise_sale, investment_opportunity
- plan VARCHAR(50) NOT NULL, -- basic, standard, premium
-
- title VARCHAR(255) NOT NULL,
- description TEXT,
- category VARCHAR(100),
-
- location VARCHAR(255),
- country VARCHAR(100),
- city VARCHAR(100),
-
- price DECIMAL(12, 2),
- revenue DECIMAL(12, 2),
- ebitda DECIMAL(12, 2),
-
- user_id UUID NOT NULL REFERENCES users(id),
-
- indexed BOOLEAN DEFAULT true,
- featured BOOLEAN DEFAULT false,
- published_at TIMESTAMP,
- created_at TIMESTAMP DEFAULT NOW(),
- updated_at TIMESTAMP DEFAULT NOW(),
-
- CONSTRAINT valid_type CHECK (type IN ('business_sale', 'franchise_sale', 'investment_opportunity')),
- CONSTRAINT valid_plan CHECK (plan IN ('basic', 'standard', 'premium'))
- );
-
- CREATE INDEX idx_slug ON listings(slug);
- CREATE INDEX idx_type ON listings(type);
- CREATE INDEX idx_user_id ON listings(user_id);
- CREATE INDEX idx_published ON listings(published_at) WHERE published_at IS NOT NULL;
  \*/

/\*\*

- ============================================================================
- PART 9: TESTING & VALIDATION
- ============================================================================
-
- Test slug generation:
- - Slugs should be URL-safe (no special chars except hyphens)
- - Slugs should be unique
- - Slugs should never change
-
- Test type handling:
- - normalizeListingType("business") => "business_sale"
- - isValidListingType("business_sale") => true
- - isValidTypeSegment("franchise") => true
-
- Test filter serialization:
- - serializeFilters({ type: "business_sale" }) => "type=business"
- - deserializeFilters("type=business") => { type: "business_sale" }
-
- Test SEO metadata:
- - Public routes have robots.index = true
- - Private routes have robots.index = false
- - All routes have valid canonical URLs
-
- Test routes:
- - /listings/:slug loads correct listing
- - /listings?type=business filters correctly
- - /search?q=... performs search
- - /login has noindex meta tag
    \*/

/\*\*

- ============================================================================
- PART 10: MIGRATION CHECKLIST
- ============================================================================
-
- When implementing this structure:
-
- [ ] Create type definitions (lib/types.ts)
- [ ] Create slug generation logic (lib/slug-generation.ts)
- [ ] Create route definitions (lib/routes.ts)
- [ ] Create SEO metadata utilities (lib/seo-metadata.ts)
- [ ] Create filter utilities (lib/filters.ts)
- [ ] Update database schema with slug column
- [ ] Generate slugs for existing listings (data migration)
- [ ] Create page routes with proper metadata
- [ ] Create API routes with filter handling
- [ ] Add robots.txt file
- [ ] Add sitemap.ts file
- [ ] Test all public/private routes
- [ ] Test slug generation and uniqueness
- [ ] Test type normalization across all routes
- [ ] Test filter serialization/deserialization
- [ ] Verify no duplicate content issues
- [ ] Submit sitemap to search engines
      \*/

export const IMPLEMENTATION_GUIDE = true;
