# 📋 Document Upload - Diagnostics & Fix Guide

## 🔍 Current Status

The document upload functionality is implemented but documents may not be appearing in the database due to missing migrations or RLS policy issues.

## ✅ What's Already Implemented

✅ **Frontend (Media.tsx)**

- File upload UI with preview
- Form data integration
- Document storage in form state
- Validation for required documents

✅ **Backend (page.tsx - handleSubmit)**

- Document file extraction from formData
- File upload to Supabase storage bucket
- Document metadata collection
- Database insertion with fallback schema support
- Error logging and warnings

## ❌ What Might Be Missing

The following database migration needs to be applied:

### 1. **CREATE_LISTING_DOCUMENTS_TABLE.sql** (REQUIRED)

```sql
create table if not exists public.listing_documents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  document_type text,
  file_name text not null,
  file_path text,
  file_url text,
  file_size integer,
  file_size_bytes integer,
  mime_type text,
  uploaded_by uuid,
  uploaded_by_user_id uuid,
  created_at timestamp with time zone default now(),
  uploaded_at timestamp with time zone default now()
);

alter table public.listing_documents enable row level security;

-- Allow owners to insert their own docs
create policy if not exists listing_documents_insert_own
  on public.listing_documents
  for insert
  with check (
    (uploaded_by = auth.uid() or uploaded_by_user_id = auth.uid())
    and exists (
      select 1 from public.listings
      where public.listings.id = public.listing_documents.listing_id
        and public.listings.user_id = auth.uid()
    )
  );

-- Allow owners and admins to view docs
create policy if not exists listing_documents_select_admin_or_owner
  on public.listing_documents
  for select
  using (
    exists (
      select 1
      from public.listings
      where public.listings.id = public.listing_documents.listing_id
        and (
          public.listings.user_id = auth.uid()
          or exists (
            select 1
            from public.profiles
            where public.profiles.id = auth.uid()
              and public.profiles.role = 'admin'
          )
        )
    )
  );

create index if not exists idx_listing_documents_listing_id
  on public.listing_documents(listing_id);
```

### 2. **Storage Bucket Configuration**

Ensure Supabase has the document storage bucket created:

- Bucket name: `listing-documents` (from `NEXT_PUBLIC_SUPABASE_DOCUMENT_BUCKET`)
- Make it **PUBLIC** so file_url links work
- RLS policies allow authenticated users to upload

### 3. **FIX_LISTING_DOCUMENTS_SELECT_POLICY.sql** (OPTIONAL)

If you want to update the SELECT policy:

```sql
drop policy if exists listing_documents_select_admin_or_owner on public.listing_documents;

create policy listing_documents_select_admin_or_owner
  on public.listing_documents
  for select
  using (
    exists (
      select 1
      from public.listings
      where public.listings.id = public.listing_documents.listing_id
        and (
          public.listings.user_id = auth.uid()
          or exists (
            select 1
            from public.profiles
            where public.profiles.id = auth.uid()
              and public.profiles.role = 'admin'
          )
        )
    )
  );
```

## 🔧 How to Apply Migrations

### Option 1: Supabase SQL Editor (Recommended)

1. Go to Supabase Dashboard → Your Project
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy the content from: `db instructions/CREATE_LISTING_DOCUMENTS_TABLE.sql`
5. Click Run
6. Verify success (should see "Success" message)

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## 🧪 Testing After Migration

### 1. Check Table Exists

In Supabase SQL Editor:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'listing_documents';
```

Expected output: One row with `listing_documents`

### 2. Check RLS is Enabled

```sql
SELECT relname, relrowsecurity FROM pg_class
WHERE relname = 'listing_documents';
```

Expected: `listing_documents | t` (t = true)

### 3. Check Policies Exist

```sql
SELECT tablename, policyname FROM pg_policies
WHERE tablename = 'listing_documents';
```

Expected:

- `listing_documents_insert_own`
- `listing_documents_select_admin_or_owner`

### 4. Check Storage Bucket

In Supabase Dashboard → Storage:

- Should see `listing-documents` bucket
- Should be **Public** (not private)

## 🐛 Debug Logging Added

Recent changes added console logging to trace the issue:

```javascript
// In handleSubmit():
console.log("Form submission started");
console.log("Form data documents:", formData.documents);

// During document upload:
console.log(`Processing ${docs.length} documents for listing ${listingId}`);
console.log(`Successfully uploaded ${docsPayload.length} documents`);
console.log(`Successfully inserted ${payloadModern.length} documents to DB`);
```

## 📊 Debugging Flow

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Create/submit a listing with documents**
4. **Check for these logs:**

```
✅ "Form submission started"
✅ "Form data documents: { ... }"
✅ "Processing N documents for listing XYZ"
✅ "Successfully uploaded N documents"
✅ "Successfully inserted N documents to DB"
```

OR

```
❌ "Document insert error (modern)" - Modern schema failed
❌ "Document insert error (legacy)" - Legacy schema failed
❌ "Document processing failed" - Upload failed
```

## 🚨 Common Issues & Solutions

### Issue: "No documents uploaded yet" in Review step

**Cause:** Files not being captured in form state
**Solution:** Check Media.tsx - ensure `onChange` handlers call `setFormData`

### Issue: Document insert error (RLS violation)

**Error:** "violates row level security policy"
**Solution:**

- Ensure `uploaded_by` or `uploaded_by_user_id` matches current user ID
- Ensure listing owner matches current user ID
- Check RLS policies allow INSERT

### Issue: Storage bucket not found

**Error:** "Bucket not found"
**Solution:**

- Create bucket named `listing-documents` in Supabase
- Make it **PUBLIC**
- Verify environment variable: `NEXT_PUBLIC_SUPABASE_DOCUMENT_BUCKET`

### Issue: Document table doesn't exist

**Error:** "relation \"public.listing_documents\" does not exist"
**Solution:**

- Run `CREATE_LISTING_DOCUMENTS_TABLE.sql`
- Verify table was created

## 📈 Expected Behavior After Fix

### Frontend:

1. User uploads documents in Media step
2. Files appear in FileCard with green checkmark
3. Documents show in Review step
4. Submit successful

### Backend:

1. Files uploaded to Supabase storage
2. Metadata inserted to `listing_documents` table
3. Console shows successful insert logs
4. Data persists in database

### Database Query:

```sql
SELECT * FROM listing_documents
WHERE listing_id = 'your-listing-id';
```

Should show one row per document uploaded.

## 🎯 Next Steps

1. **Check Supabase Status**: Verify listing_documents table exists
2. **Apply Missing Migrations**: Run CREATE_LISTING_DOCUMENTS_TABLE.sql
3. **Verify RLS Policies**: Ensure policies are created
4. **Check Storage Bucket**: Verify listing-documents bucket is public
5. **Test Upload**: Create a test listing with documents
6. **Review Console Logs**: Verify all expected logs appear
7. **Query Database**: Check if documents were inserted

---

**Last Updated:** 2026-02-16
**Status:** Diagnostics guide created
**Action Required:** Apply migrations if not already done
