# SEO-Friendly URL Routing Implementation

## Overview

This implementation provides clean, indexable URLs for country and industry filters while preserving query parameter-based filtering for non-SEO filters (price, revenue, search).

## URL Structure

### Indexable Clean Routes (SEO)

```
/listings/businesses                              → All businesses
/listings/businesses/united-arab-emirates         → Businesses in UAE
/listings/businesses/united-arab-emirates/retail  → Retail businesses in UAE
/listings/franchises/saudi-arabia/food           → Food franchises in Saudi Arabia
/listings/investments/usa/tech                   → Tech investments in USA
```

### Non-Indexable Query Routes (UX only)

```
/listings/businesses?price_min=100000            → noindex, follow
/listings/businesses?search=coffee               → noindex, follow
/listings/businesses/uae?price_min=50000         → noindex, follow (clean path + query)
```

## Route Files

### 1. Base Route: `/listings/[type]/page.tsx`

**Purpose:** All listings of a specific type
**Indexable:** Yes
**Robots:** `index, follow`
**Canonical:** Self

**Examples:**

- `/listings/businesses`
- `/listings/franchises`
- `/listings/investments`

### 2. Country Route: `/listings/[type]/[country]/page.tsx`

**Purpose:** Listings filtered by country
**Indexable:** Yes
**Robots:** `index, follow`
**Canonical:** Self

**Examples:**

- `/listings/businesses/united-arab-emirates`
- `/listings/franchises/saudi-arabia`

### 3. Country + Industry Route: `/listings/[type]/[country]/[industry]/page.tsx`

**Purpose:** Listings filtered by country AND industry
**Indexable:** Yes
**Robots:** `index, follow`
**Canonical:** Self

**Examples:**

- `/listings/businesses/united-arab-emirates/retail`
- `/listings/franchises/usa/food`
- `/listings/investments/uk/tech`

## SEO Logic

### Canonical URL Rules

1. **Clean routes:** Canonical points to self
2. **Query param routes:** Canonical points to closest clean route
3. **Pagination:** Canonical points to page 1 clean route

```typescript
// Example: /listings/businesses?price_min=100000
// Canonical: https://yourdomain.com/listings/businesses

// Example: /listings/businesses/uae/retail?price_min=50000
// Canonical: https://yourdomain.com/listings/businesses/uae/retail
```

### Robots Directive Rules

```typescript
// Clean route with content → "index, follow"
// Clean route without content → "noindex, follow"
// Query param route → "noindex, follow"
// Page 2+ → "noindex, follow"
```

### URL Hierarchy for SEO

```
Priority: Type > Country > Industry

Correct:
✓ /listings/businesses/uae/retail
✓ /listings/businesses/uae
✓ /listings/businesses

Incorrect (not implemented):
✗ /listings/businesses/retail (industry without country)
✗ /listings/retail/uae (wrong order)
```

**Why?** Search engines understand geographic hierarchy. Country-level pages are more valuable for SEO than industry-only pages.

## Filter Behavior

### Automatic URL Navigation

When users select filters via UI, the app automatically navigates to clean URLs:

```typescript
// User clicks "United Arab Emirates" filter
// Before: /listings/businesses
// After:  /listings/businesses/united-arab-emirates

// User then clicks "Retail" filter
// Before: /listings/businesses/united-arab-emirates
// After:  /listings/businesses/united-arab-emirates/retail

// User removes country filter
// Before: /listings/businesses/united-arab-emirates/retail
// After:  /listings/businesses (industry requires country)
```

### Pre-Selected Filters

Pages receive pre-selected filters from URL segments:

```typescript
// URL: /listings/businesses/united-arab-emirates/retail
// Component receives:
{
  preSelectedCountry: "United Arab Emirates",
  preSelectedIndustry: "Retail"
}
```

### Multiple Filter Selections

- **Single country + Single industry:** Navigate to clean URL
- **Multiple countries OR multiple industries:** Stay on current page (no clean route for multiple selections)
- **Additional filters (price, etc.):** Add as query params, mark as noindex

## Key Files

### Utilities

```
lib/seo/url-mapping.ts
├── generateCleanUrl()      → Build SEO-friendly URL
├── parseCleanUrl()         → Parse URL segments to filters
├── generateCanonicalUrl()  → Build canonical URL
├── getRobotsDirective()    → Determine index/noindex
└── hasNonSeoQueryParams()  → Check for non-SEO query params
```

### Routes

```
app/listings/[type]/
├── page.tsx                        → Base listings (all)
├── layout.tsx                      → Metadata for base
├── [country]/
│   ├── page.tsx                   → Country-filtered
│   ├── layout.tsx                 → Metadata for country
│   └── [industry]/
│       ├── page.tsx               → Country + Industry filtered
│       └── layout.tsx             → Metadata for both
└── [id]/
    ├── page.tsx                   → Individual listing detail
    └── layout.tsx                 → Metadata for detail
```

## Usage Examples

### Example 1: Generate Clean URL

```typescript
import { generateCleanUrl } from "@/lib/seo/url-mapping";

const url = generateCleanUrl({
  type: "business_sale",
  country: "United Arab Emirates",
  industry: "Retail",
});
// Result: "/listings/businesses/united-arab-emirates/retail"
```

### Example 2: Parse URL to Filters

```typescript
import { parseCleanUrl } from "@/lib/seo/url-mapping";

const filters = parseCleanUrl({
  type: "businesses",
  country: "united-arab-emirates",
  industry: "retail",
});
// Result: {
//   type: "business_sale",
//   country: "United Arab Emirates",
//   industry: "Retail"
// }
```

### Example 3: Get Canonical URL

```typescript
import { generateCanonicalUrl } from "@/lib/seo/url-mapping";

// Clean route
const canonical1 = generateCanonicalUrl({
  type: "business_sale",
  country: "UAE",
  hasQueryParams: false,
});
// Result: "/listings/businesses/uae"

// With query params
const canonical2 = generateCanonicalUrl({
  type: "business_sale",
  country: "UAE",
  hasQueryParams: true, // price filter active
});
// Result: "/listings/businesses/uae" (same - points to clean route)
```

### Example 4: Robots Directive

```typescript
import { getRobotsDirective } from "@/lib/seo/url-mapping";

// Clean route with content
const robots1 = getRobotsDirective({
  hasQueryParams: false,
  hasContent: true,
  currentPage: 1,
});
// Result: "index, follow"

// With price filter
const robots2 = getRobotsDirective({
  hasQueryParams: true,
  hasContent: true,
  currentPage: 1,
});
// Result: "noindex, follow"

// Page 2
const robots3 = getRobotsDirective({
  hasQueryParams: false,
  hasContent: true,
  currentPage: 2,
});
// Result: "noindex, follow"
```

## Metadata Generation

Each route has a `layout.tsx` that generates appropriate metadata:

```typescript
// /listings/businesses/uae/retail
{
  title: "Retail Businesses for Sale in United Arab Emirates | Acquity",
  description: "Browse retail businesses for sale in UAE...",
  robots: { index: true, follow: true },
  openGraph: { ... }
}
```

## Testing Checklist

### URL Navigation

- [ ] Clicking country filter navigates to `/listings/{type}/{country}`
- [ ] Clicking industry (with country selected) navigates to `/listings/{type}/{country}/{industry}`
- [ ] Removing country filter navigates back to `/listings/{type}`
- [ ] Reset filters button navigates to `/listings/{type}`

### SEO Tags

- [ ] Clean routes have `<link rel="canonical" href="..." />`
- [ ] Clean routes have `<meta name="robots" content="index, follow" />`
- [ ] Query param routes have `noindex, follow`
- [ ] Page 2+ has `noindex, follow`

### Pre-Selection

- [ ] `/listings/businesses/uae` pre-selects UAE in country filter
- [ ] `/listings/businesses/uae/retail` pre-selects both UAE and Retail
- [ ] Filters UI reflects URL state on page load

### Multiple Selections

- [ ] Selecting multiple countries does NOT navigate (stays on current page)
- [ ] Selecting multiple industries does NOT navigate (stays on current page)
- [ ] Additional filters (price) do NOT trigger navigation

## SEO Benefits

### 1. Clean URL Structure

```
❌ Bad:  /listings?type=business&country=uae&industry=retail
✅ Good: /listings/businesses/uae/retail
```

### 2. Crawl Budget Optimization

- Search engines index only clean routes
- Query param combinations are noindexed
- Prevents exponential URL explosion

### 3. Link Equity Consolidation

- All links point to clean routes via canonical tags
- Ranking signals consolidated to main pages
- No duplicate content penalties

### 4. User-Friendly URLs

- URLs are readable and shareable
- Geographic hierarchy is clear
- Users understand page context from URL

### 5. Internal Linking

- Breadcrumbs link to clean routes
- Filter navigation creates internal link structure
- Proper hierarchy for crawlers

## Future Enhancements

### 1. City-Level Routes (Optional)

```
/listings/businesses/uae/dubai
/listings/businesses/uae/dubai/retail
```

### 2. Automatic Redirects

```typescript
// Redirect query param routes to clean routes
// /listings/businesses?country=uae
// → 301 redirect to /listings/businesses/uae
```

### 3. Breadcrumb Integration

```typescript
// Generate breadcrumbs from URL segments
// /listings/businesses/uae/retail
// → Home > Businesses > UAE > Retail
```

### 4. Sitemap Generation

```xml
<!-- Include all clean routes in sitemap -->
<url>
  <loc>https://yourdomain.com/listings/businesses/uae</loc>
  <priority>0.8</priority>
</url>
```

## Performance Considerations

### Static Generation (Future)

```typescript
// Generate static pages for top country/industry combos
export function generateStaticParams() {
  return [
    { type: "businesses", country: "united-arab-emirates" },
    { type: "businesses", country: "saudi-arabia" },
    // ...top 100 combinations
  ];
}
```

### Incremental Static Regeneration

```typescript
// Revalidate pages periodically
export const revalidate = 3600; // 1 hour
```

## Migration Notes

### Breaking Changes

None. This implementation preserves existing functionality.

### Backward Compatibility

- Query param routes still work (just noindexed)
- Existing links continue to function
- No database changes required

---

**Last Updated:** January 23, 2026
**Status:** Production Ready
**Impact:** High SEO value, zero breaking changes
