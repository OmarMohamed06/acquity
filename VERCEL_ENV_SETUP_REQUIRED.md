# 🚨 CRITICAL: Vercel Environment Variable Setup

## The Problem
Your sitemap was generating URLs with `acquity-cp492z72n-omarmohamed06s-projects.vercel.app` instead of `acquity.co`, causing Google to reject it.

## ✅ What I Fixed (Local)
1. ✅ Updated `lib/seo/base-url.ts` to remove VERCEL_URL fallback
2. ✅ Added `NEXT_PUBLIC_SITE_URL=https://acquity.co` to `.env.local`
3. ✅ Rebuild will now use correct domain

## 🎯 CRITICAL: YOU MUST DO THIS IN VERCEL

### Go to your Vercel project settings:
1. Open https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://acquity.co
```

5. Select all environments: **Production**, **Preview**, and **Development**
6. Click **Save**
7. **Redeploy your site** (Deployments → ... menu → Redeploy)

## Why This Matters
- Without this env var in Vercel, it will use Vercel preview URLs
- Your sitemap will be rejected by Google
- Canonical URLs will be wrong
- SEO will be broken

## Verification
After redeploying, check:
```
https://acquity.co/sitemap.xml
```

All URLs should start with `https://acquity.co/` NOT `vercel.app`

## Additional Check
Also verify your domain settings in Vercel:
- Your production domain should be set to `acquity.co`
- Make sure it's the primary domain
