# Launch Mode Quick Reference

## Overview

Launch mode displays a waitlist banner with blurred mock listings across all listing pages, perfect for pre-launch marketing and waitlist collection.

## Toggle Launch Mode

**File:** `app/constants/launch.ts`

```typescript
export const LAUNCH_MODE = true; // Set to false to disable waitlist and show real listings
```

### When `LAUNCH_MODE = true`:

- ✅ Waitlist banner appears above all listing sections
- ✅ Mock listings displayed with blur effect
- ✅ All listing content (filters, cards, details) blurred and non-interactive
- ✅ CTA button directs to `/list-business` for early access
- ✅ No database queries executed for listings

### When `LAUNCH_MODE = false`:

- ✅ Normal operation - real listings from Supabase
- ✅ No waitlist banner
- ✅ Full interactivity and filters
- ✅ Standard listing display

## Affected Pages

### Home Page

- `app/page.tsx`
- Shows 6 mock business listings in featured section

### Browse Pages

- `app/businesses-for-sale/page.tsx`
- `app/franchises-for-sale/page.tsx`
- `app/investments-for-sale/page.tsx`

### Filtered Browse Pages

- `app/businesses-for-sale/[...segments]/page.tsx`
- `app/franchises-for-sale/[...segments]/page.tsx`
- `app/investments-for-sale/[...segments]/page.tsx`

## Mock Data

Mock listings are defined in `app/constants/launch.ts`:

- `MOCK_BUSINESS_LISTINGS` - 6 sample business listings
- `MOCK_FRANCHISE_LISTINGS` - 6 sample franchise listings
- `MOCK_INVESTMENT_LISTINGS` - 6 sample investment listings

All mock data includes:

- Realistic titles and locations (MENA, GCC, Africa, Asia)
- Price, revenue, and financial metrics
- Category and country data
- Badge and plan tier (basic/standard/premium)

## Customization

### Banner Content

Edit `components/WaitlistBanner.tsx` to customize:

- Heading text
- Description copy
- CTA button text/link
- Stats badges
- Colors and styling

### Mock Listings

Edit `app/constants/launch.ts` to:

- Add/remove mock listings
- Change locations, prices, categories
- Adjust badge and plan tiers
- Update images (currently placeholder paths)

## Deployment Workflow

### Pre-Launch (Waitlist Phase)

1. Set `LAUNCH_MODE = true`
2. Deploy to production
3. Collect waitlist signups via `/list-business`

### Launch Day

1. Set `LAUNCH_MODE = false`
2. Rebuild: `npm run build`
3. Deploy updated build
4. Real listings now visible and interactive

## Testing

```bash
# Build to verify no errors
npm run build

# Run dev server to preview
npm run dev
# Visit: http://localhost:3000
```

## Notes

- Launch mode does NOT affect non-listing pages (resources, blog, auth, etc.)
- The `/list-business` page remains fully functional in both modes
- Filter sidebars are blurred but visible for preview purposes
- Navigation and footer work normally in launch mode
