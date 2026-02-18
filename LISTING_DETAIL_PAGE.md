# Listing Detail Page Implementation

## Overview

A fully functional business listing detail page has been created at `/app/businesses-for-sale/listing/[slug]/page.tsx` that displays comprehensive business information with a beautiful, responsive design.

## Features

### ✅ Implemented

1. **Dynamic Slug-based Routing**
   - Fetches listings by slug parameter
   - URL format: `/businesses-for-sale/listing/{slug}`
   - Example: `/businesses-for-sale/listing/tech-consulting-abc123`

2. **Breadcrumb Navigation**
   - Home > Businesses for Sale > Category > Listing Name
   - Interactive links for navigation

3. **Business Information Display**
   - Title and description
   - Location with city and country
   - Category badge
   - High-quality image display with fallback

4. **Financial Summary Section** (Right Sidebar)
   - Asking Price
   - Annual Revenue
   - EBITDA
   - Cash Flow
   - All formatted with `formatNumber()` utility

5. **Value Proposition Section**
   - Reason for Sale
   - Owner Involvement Level
   - Icons and formatted display

6. **Operational Details Section**
   - Year Established
   - Number of Employees
   - Clean two-column layout

7. **Contact Seller Functionality**
   - Modal dialog for inquiries
   - Email contact form
   - Requires buyer information
   - Stores inquiry in `buyer_contact` table

8. **Responsive Design**
   - Mobile-first approach
   - Tailwind CSS styling
   - 3-column layout (2 content + 1 sidebar) on large screens
   - Single column on mobile
   - Flexible image handling

9. **Error Handling**
   - "Listing not found" message
   - Loading skeleton with pulse animation
   - Graceful error states
   - Fallback image URL

## Database Schema

### Tables Used

#### `listings` (Main table)

```sql
- id: UUID (primary key)
- slug: TEXT (unique, indexed)
- type: TEXT ('business_sale', 'franchise_sale', 'investment_opportunity')
- plan: TEXT ('free', 'standard', 'premium')
- title: TEXT
- description: TEXT
- category: TEXT
- location: TEXT
- country: TEXT
- city: TEXT
- established_year: SMALLINT
- price: NUMERIC (asking price)
- revenue: NUMERIC (annual revenue)
- ebitda: NUMERIC
- cash_flow: NUMERIC
- image_url: TEXT (or image)
- status: TEXT ('pending', 'approved', 'rejected')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `listing_operational` (Linked to listings)

```sql
- listing_id: UUID (primary key, foreign key)
- employees_count: INTEGER
- owner_involvement: TEXT ('none', 'part_time', 'full_time')
- reason_for_sale: TEXT
- support_provided: TEXT
- seller_relationship: TEXT
- preferred_contact: TEXT
```

#### `listing_financials` (Linked to listings)

```sql
- listing_id: UUID (primary key, foreign key)
- valuation_multiple: NUMERIC
- gross_margin: NUMERIC
- net_margin: NUMERIC
- inventory_value: NUMERIC
- assets_value: NUMERIC
- liabilities: NUMERIC
- revenue_3yr_cagr_pct: NUMERIC
- income_statement: JSONB
```

## Setup Instructions

### 1. Database Migration

Run the migration SQL to add required fields and tables:

```bash
# Execute in Supabase SQL Editor
-- See: db instructions/ADD_LISTING_FIELDS_AND_TABLES.sql
```

Key additions:

- `slug` column to `listings` table
- Financial fields: `price`, `revenue`, `ebitda`, `cash_flow`
- Image support: `image` and `image_url` columns
- Location detail: `city` column
- Create `listing_operational` table
- Create `listing_financials` table

### 2. RLS Policies

Ensure Row Level Security policies allow:

- Public viewing of approved listings
- Operational and financial details viewable for approved listings

### 3. Sample Data

Create test listings with the following structure:

```javascript
// Example listing
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  slug: "tech-consulting-firm-550e8400",
  type: "business_sale",
  plan: "premium",
  title: "Tech Consulting Firm",
  description: "Established IT consulting business...",
  category: "Technology",
  location: "San Francisco, USA",
  country: "USA",
  city: "San Francisco",
  established_year: 2015,
  price: 450000,
  revenue: 1200000,
  ebitda: 350000,
  cash_flow: 280000,
  image_url: "https://example.com/image.jpg",
  status: "approved",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z"
}
```

## File Structure

```
app/
├── businesses-for-sale/
│   └── listing/
│       └── [slug]/
│           └── page.tsx          # Main detail page component
lib/
├── listing-helpers.ts             # Utility functions for fetching listings
├── supabase/
│   └── client.ts                  # Supabase client
└── formatNumber.ts                # Number formatting utility
components/
└── ContactModal.tsx               # Contact form modal (updated)
```

## Key Functions

### `fetchListingBySlug(slug: string)`

Fetches a listing and all related data by slug parameter.

```typescript
const { listing, operational, financials, error } =
  await fetchListingBySlug(slug);
```

### `generateSlug(title: string, id: string)`

Generates a URL-safe slug from a title and ID.

```typescript
const slug = generateSlug("Tech Consulting", "550e8400");
// Result: "tech-consulting-550e8400"
```

## Component Props

The listing detail page is a client component with no props - it reads from URL parameters:

```typescript
const params = useParams();
const slug = params.slug as string; // Extracted from URL
```

## Styling

- Uses Tailwind CSS classes
- Colors: Blue theme (blue-50, blue-600, blue-900)
- Responsive grid: `grid-cols-1 lg:grid-cols-3`
- Consistent padding and spacing
- Rounded corners (4px, 8px)
- Box shadows on cards
- Hover effects on interactive elements

## API Integration

The page integrates with Supabase:

- Reads from `listings` table (main data)
- Reads from `listing_operational` table (if exists)
- Reads from `listing_financials` table (if exists)
- Uses public RLS policies for approved listings
- Stores contact inquiries in `buyer_contact` table

## Contact Modal Integration

Updated `ContactModal.tsx` to accept:

- `listing` object (complete listing data)
- `listingId` and `listingStatus` (fallback)
- `requiredAuth` flag (for authentication prompts)
- `isOpen` and `onClose` callbacks

## URL Structure

```
/businesses-for-sale/listing/[slug]
/businesses-for-sale/listing/tech-consulting-550e8400
/businesses-for-sale/listing/coffee-shop-downtown-a1b2c3d4
```

## Next Steps

1. **Run the SQL migration** to add all required fields and tables
2. **Create sample listings** with proper slug generation
3. **Test the page** by visiting a listing URL
4. **Configure email notifications** for contact inquiries
5. **Add SEO metadata** generation (titles, descriptions, og:image)
6. **Implement analytics** tracking (page views, contact inquiries)

## Environment Variables

Ensure these are set:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase public key

## Error Handling

The page handles:

- ✅ Listing not found (404-like message)
- ✅ Missing data fields (shows "No data available")
- ✅ Loading states (animated skeleton)
- ✅ Database errors (error message)
- ✅ Image missing (fallback placeholder)

## Performance Considerations

- Uses `<Image>` for optimization (recommended for Next.js)
- Client-side data fetching (can be converted to server-side)
- Parallel queries for operational and financial data
- Indexed slug column for fast lookups

## Future Enhancements

- [ ] Server-side rendering with `generateStaticParams`
- [ ] SEO metadata generation (title, description, canonical)
- [ ] Image optimization with Next.js Image component
- [ ] Share buttons (LinkedIn, Email, WhatsApp)
- [ ] Similar listings recommendations
- [ ] Reviews/ratings from buyers
- [ ] Document download (financials, contracts)
- [ ] Calendar for seller meetings
- [ ] CRM integration for leads
