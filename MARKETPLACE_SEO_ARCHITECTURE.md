# Marketplace SEO Architecture - Implementation Guide

## Folder Structure

```
app/
├── businesses-for-sale/              # Indexable root
│   ├── page.tsx                      # /businesses-for-sale (all listings)
│   └── [country]/                    # /businesses-for-sale/[country]
│       ├── page.tsx                  # Country + type page
│       └── [industry]/               # /businesses-for-sale/[country]/[industry]
│           └── page.tsx              # Full SEO page (3-level deep)
│
├── franchises-for-sale/              # Indexable root
│   ├── page.tsx                      # /franchises-for-sale (all listings)
│   └── [country]/                    # /franchises-for-sale/[country]
│       ├── page.tsx                  # Country + type page
│       └── [industry]/               # /franchises-for-sale/[country]/[industry]
│           └── page.tsx              # Full SEO page (3-level deep)
│
└── api/
    └── listings/                     # API for client-side filtering
        └── route.ts                  # POST/GET for filter queries
```

## URL Examples

### Indexable SEO Pages (index, follow):

- `/businesses-for-sale` — all business sales
- `/businesses-for-sale/uae` — businesses in UAE
- `/businesses-for-sale/uae/retail` — retail businesses in UAE
- `/franchises-for-sale/uk/fast-food` — fast food franchises in UK

### Filtered URLs (noindex, follow):

- `/businesses-for-sale/uae/retail?price_min=50000&price_max=500000&city=Dubai`
- `/franchises-for-sale/uk?sort=revenue&has_financing=true`

## Key Implementation Principles

1. **Dynamic Routes**: Use `[country]` and `[industry]` segments for SEO pages
2. **Metadata Generation**: Server-rendered with proper canonical & robots directives
3. **Query Params**: Only used for filters (noindex), not SEO segments
4. **Canonical Logic**: Always points to the SEO page without query params
5. **Client Filtering**: Real-time updates with "Apply Filters" button to update URL
6. **Pre-rendering**: Use `generateStaticParams()` for high-traffic SEO pages

---

## Implementation Details

See the code files in this directory for complete working examples.
