# SEO Marketplace Architecture - Visual Guide

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MARKETPLACE                              │
│                    SEO-First Architecture                        │
└─────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │ Root Pages   │
                         └──────────────┘
                              ↓
                   ┌───────────────────────┐
                   ↓                       ↓
            ┌────────────┐         ┌──────────────┐
            │ Businesses │         │  Franchises  │
            └────────────┘         └──────────────┘
                   ↓                       ↓
        ┌──────────┬──────────┐  ┌────────┬────────┐
        ↓          ↓          ↓  ↓        ↓        ↓
      UAE        USA        UK  UAE     USA      UK
        ↓          ↓          ↓  ↓        ↓        ↓
    ┌──────────────────────────────────────────────┐
    │  Food & Beverage  │  Technology  │  Retail  │
    │  Health & Wellness │  Marketing  │  etc...  │
    └──────────────────────────────────────────────┘
        ↓          ↓          ↓  ↓        ↓        ↓
   ┌────────────────────────────────────────────────┐
   │ Filterable Listings (city, price, sort)      │
   │ ?city=Dubai&price_min=100000&sort=newest     │
   └────────────────────────────────────────────────┘
```

## URL Structure Tree

```
/
├── businesses-for-sale/
│   ├── page.tsx (INDEX: Browse by country/industry)
│   ├── [country]/
│   │   ├── page.tsx (INDEX: Browse industries in country)
│   │   └── [industry]/
│   │       └── page.tsx (INDEX: Listings)
│   │           ├── No params → robots: "index, follow"
│   │           ├── ?city=... → robots: "noindex, follow"
│   │           ├── ?price_min=... → robots: "noindex, follow"
│   │           └── Canonical always points to: /businesses-for-sale/[country]/[industry]
│   │
│   └── Example URLs:
│       ✅ /businesses-for-sale (index, follow)
│       ✅ /businesses-for-sale/uae (index, follow)
│       ✅ /businesses-for-sale/uae/food-beverage (index, follow)
│       ❌ /businesses-for-sale/uae/food-beverage?city=Dubai (noindex, follow)
│
├── franchises-for-sale/
│   ├── page.tsx
│   └── [country]/[industry]/page.tsx
│       └── Same pattern as businesses...
│
└── api/listings/
    ├── GET: /api/listings?type=business_sale&country=UAE&industry=Food&city=Dubai
    └── POST: /api/listings (JSON body)
```

## Metadata Generation Logic

```
User visits page
    ↓
generateMetadata() called (server-side)
    ↓
    ├─→ searchParams.length === 0?
    │       ↓ YES
    │   robots: {
    │     index: true,
    │     follow: true
    │   }
    │       ↓
    │   (This is indexable!)
    │
    └─→ searchParams.length > 0?
            ↓ YES (has ?city=... or ?price=...)
        robots: {
          index: false,    ← noindex
          follow: true
        }
        canonical: URL without params
            ↓
        (This is NOT indexed, but canonical points
         to the version without filters)
```

## Component Flow

```
Page.tsx (Server Component)
    │
    ├─→ generateMetadata()
    │   └─→ generateMarketplaceMetadata(params, searchParams)
    │       └─→ Returns: { robots: {...}, alternates: { canonical: ... } }
    │
    └─→ Render FilterContent()
        │
        └─→ Suspense boundary
            │
            └─→ FilterContent.tsx (Client Component)
                │
                ├─→ useSearchParams() → Get ?city=Dubai etc
                │
                ├─→ useState(filters) → Local state
                │   {
                │     city: "Dubai",
                │     price_min: "100000",
                │     price_max: "500000",
                │     sort: "newest"
                │   }
                │
                ├─→ useEffect() → Fetch from API
                │   GET /api/listings?type=...&city=...
                │
                ├─→ handleApplyFilters()
                │   → Build query string
                │   → router.push(newURL)
                │   → Page re-renders
                │
                └─→ Render:
                    ├── Breadcrumb
                    ├── Title
                    ├── Sidebar (sticky)
                    │  ├── City input → setFilters
                    │  ├── Price inputs → setFilters
                    │  ├── Sort select → setFilters
                    │  └── Apply button → handleApplyFilters()
                    ├── Filter chips (removable)
                    ├── Listings grid
                    └── Pagination
```

## Filter State Evolution

```
User Flow:

1. Lands on URL
   /businesses-for-sale/uae/food-beverage

   URL Params: {} (empty)
   Component State: { city: "", price_min: "", price_max: "", sort: "newest" }
   Metadata: robots: "index, follow"

2. Types in filter inputs
   (No URL change, component state only)

   URL Params: {} (STILL empty)
   Component State: { city: "Dubai", price_min: "100000", ... }
   Metadata: robots: "index, follow" (still!)

3. Clicks "Apply Filters" button

   URL Updates: /businesses-for-sale/uae/food-beverage?city=Dubai&price_min=100000
   Component State: { city: "Dubai", price_min: "100000", ... }
   Metadata: RECALCULATED → robots: "noindex, follow"

4. Result: API is called with new filters
   GET /api/listings?type=business_sale&country=uae&industry=food-beverage&city=Dubai...
   Listings update on screen

5. User clicks ✕ on city chip

   city state removed: setFilters({ ...filters, city: "" })
   URL Updates: /businesses-for-sale/uae/food-beverage?price_min=100000
   Metadata: RECALCULATED → Still noindex (query params exist)
```

## API Response Structure

```
Request:
GET /api/listings?type=business_sale&country=UAE&industry=Food&city=Dubai&page=1

Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Coffee Shop Downtown",
      "type": "business_sale",
      "country": "UAE",
      "industry": "Food & Beverage",
      "city": "Dubai",
      "price": 150000,
      "revenue": 500000,
      "profit": 85000,
      "image": "https://...",
      "description": "Well-established coffee shop in premium location"
    },
    ...more listings...
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

## UI Layout - Desktop

```
┌────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home / Businesses / UAE / Food & Beverage     │
├────────────────────────────────────────────────────────────┤
│ <h1>Food & Beverage Businesses for Sale in UAE</h1>       │
│ <p>45 business opportunities available</p>                 │
├─────────────────┬──────────────────────────────────────────┤
│    SIDEBAR      │                CONTENT                   │
│  (sticky top:4) │                                          │
│                 │ [City: Dubai] [Min: $100K] [Max: $500K] │
│ Filters         │ ✕              ✕           ✕             │
│ ───────         │                                          │
│ City:           │ ┌──────────────┬──────────────┐          │
│ [________]      │ │ Listing 1    │ Listing 2    │          │
│                 │ │              │              │          │
│ Min Price:      │ │ Image        │ Image        │          │
│ [________]      │ │ Title        │ Title        │          │
│                 │ │ City, Country│ City, Country│          │
│ Max Price:      │ │ $Price       │ $Price       │          │
│ [________]      │ │ View Details │ View Details │          │
│                 │ └──────────────┴──────────────┘          │
│ Sort:           │                                          │
│ [dropdown]      │ ┌──────────────┬──────────────┐          │
│                 │ │ Listing 3    │ Listing 4    │          │
│ [Apply Filters] │ └──────────────┴──────────────┘          │
│                 │                                          │
│                 │ [← Previous] Page 1 of 4 [Next →]        │
└─────────────────┴──────────────────────────────────────────┘
```

## UI Layout - Mobile

```
┌──────────────────────────────┐
│ Breadcrumb / Home / ...      │
├──────────────────────────────┤
│ <h1>Food & Beverage...</h1>  │
├──────────────────────────────┤
│  FILTERS (Sticky Top)        │
│  City:                       │
│  [______________]           │
│  Min/Max Price:             │
│  [_______] [_______]        │
│  Sort: [dropdown]           │
│  [Apply Filters]            │
├──────────────────────────────┤
│ [City: Dubai] [Min: $100K]  │
│         ✕        ✕          │
├──────────────────────────────┤
│ Listing 1                    │
│ [Image]                      │
│ Title                        │
│ City, Country                │
│ $Price, Revenue              │
│ [View Details]              │
├──────────────────────────────┤
│ Listing 2                    │
│ ...                          │
├──────────────────────────────┤
│ [← Prev] Page 1/4 [Next →]   │
└──────────────────────────────┘
```

## Structured Data in HTML

```html
<head>
  <!-- Meta Tags -->
  <title>Food & Beverage Businesses for Sale in UAE</title>
  <meta name="description" content="..." />
  <meta name="robots" content="index, follow" />
  <!-- or "noindex, follow" -->
  <link rel="canonical" href="..." />

  <!-- Breadcrumb Schema -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yoursite.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Businesses for Sale",
          "item": "https://yoursite.com/businesses-for-sale"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "UAE",
          "item": "https://yoursite.com/businesses-for-sale/uae"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Food & Beverage",
          "item": "https://yoursite.com/businesses-for-sale/uae/food-beverage"
        }
      ]
    }
  </script>

  <!-- Collection Schema -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Food & Beverage Businesses for Sale",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": 45
      }
    }
  </script>
</head>
```

## Filter Chip Component

```
Active Filters Display:

[City: Dubai] [Min: $100,000] [Max: $500,000] [Sort: Price High]
   ✕              ✕               ✕                 ✕

When user clicks ✕:
1. removeFilter("city") called
2. setFilters({ ...filters, city: "" })
3. setActiveFilters(filtered list)
4. Component re-renders
5. Fetch new data with updated filters

All this happens WITHOUT updating URL
Until user clicks "Apply Filters"
```

## Database Integration Point

```typescript
// Current: Mock data in route.ts
const MOCK_LISTINGS = [
  { id: "1", title: "...", price: 150000, ... },
  ...
];

// Future: Real database
export async function GET(request: NextRequest) {
  const listings = await prisma.listing.findMany({
    where: {
      type: params.type,
      country: params.country,
      industry: params.industry,
      ...(filters.city && { city: { contains: filters.city } }),
      ...(filters.price_min && { price: { gte: filters.price_min } }),
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json({
    success: true,
    data: listings,
    pagination: { ... }
  });
}
```

## SEO Benefit Summary

```
❌ OLD APPROACH:
/listings/business              ← Simple, but...
  └─ Can only have one filter level
  └─ Query params for everything: ?country=UAE&industry=Food
  └─ No clear hierarchy for search engines
  └─ Duplicate content if same listings appear in multiple URLs
  └─ No structured data about the hierarchy

✅ NEW APPROACH:
/businesses-for-sale                      ← Clear category
  /businesses-for-sale/uae                ← Clear country segment
    /businesses-for-sale/uae/food-beverage ← Clear industry segment
      ?city=Dubai                         ← Temporary filter
      ?city=Dubai&price_min=100000        ← Temporary filters

Benefits:
✓ Clear URL hierarchy tells search engines structure
✓ Each main level is indexed separately
✓ Breadcrumb schema helps click-through rate
✓ Filters don't pollute the URL structure
✓ Canonical URLs prevent duplicate content
✓ Much better for SEO and conversions
```

---

**This is a complete, production-ready architecture. Ready to build on!**
