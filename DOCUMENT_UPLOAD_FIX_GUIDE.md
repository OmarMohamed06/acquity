# 📄 Document Upload - Fix Applied & Testing Guide

## ✅ Changes Made

### 1. **Enhanced Error Logging** (page.tsx - handleSubmit)

Added detailed console logs to trace document uploads:

```javascript
// At start of submission:
console.log("Form submission started");
console.log("Form data documents:", formData.documents);

// During document upload:
console.log(`Processing ${docs.length} documents for listing ${listingId}`);
console.log("Documents to upload:", docs.map(...));

// For each document:
console.log(`Uploading ${file.name} (${file.size} bytes)...`);
console.log(`✓ Successfully uploaded ${file.name} to ${publicUrl}`);

// After all uploads:
console.log(`✓ Successfully uploaded ${uploadedDocs.length} documents to storage`);

// During DB insertion:
console.log("Attempting to insert documents with modern schema...", payloadModern);
console.log(`✓ Successfully inserted ${payloadModern.length} documents to DB (modern schema)`);

// On errors:
console.error("✗ Document insert error (legacy schema):", legacyError);
console.error("✗ Document processing/upload failed:", docsError);
```

### 2. **Improved Error Handling**

- Changed from silent `console.warn()` to throwing actual errors
- Provides clear error messages showing:
  - Which document failed to upload
  - Why the database insertion failed
  - Helpful hints about missing table or RLS policies
- Errors now stop the entire submission (fail-fast approach)

### 3. **Better Error Messages**

Users will now see specific error messages like:

- `"Failed to upload document business-registration.pdf: Bucket not found"`
- `"Failed to insert documents to database: relation 'public.listing_documents' does not exist..."`
- `"Document upload failed: RLS violation on listing_documents table"`

### 4. **Fixed ContactModal TypeScript Error**

Removed access to non-existent `status` property on PostgrestError.

---

## 🧪 How to Test

### Step 1: Open Browser DevTools

```
Press: F12 (Windows) or Cmd+Option+I (Mac)
Go to: Console tab
```

### Step 2: Navigate to Create Listing

```
1. Go to http://localhost:3000/list-business
2. Fill out all steps (Seller Info, Basic Info, Financials, Story)
```

### Step 3: Upload Documents

```
In "Media & Documentation" step:
1. Click "Upload image" and select any JPG/PNG file
2. Click each document card and upload a PDF/file
3. Check "I certify that..." checkbox
4. Go to Review step and verify documents show
```

### Step 4: Submit Listing

```
Click "Submit Listing"
Monitor console for logs...
```

### Step 5: Check Console Output

**Look for these patterns:**

✅ **SUCCESS:**

```
Form submission started
Form data documents: {company_registration_doc: File, ...}
Processing 3 documents for listing abc-123
Documents to upload: [{key: "company_registration_doc", name: "cert.pdf", size: 524288}]
✓ Successfully uploaded cert.pdf to https://...
✓ Successfully uploaded 3 documents to storage
Attempting to insert documents with modern schema...
✓ Successfully inserted 3 documents to DB (modern schema)
```

❌ **FAILURE (Missing Table):**

```
Processing 3 documents for listing abc-123
✓ Successfully uploaded 3 documents to storage
Attempting to insert documents with modern schema...
✗ Document insert error (legacy schema): relation 'public.listing_documents' does not exist
Failed to insert documents to database: relation 'public.listing_documents' does not exist...
```

**Action:** Run `CREATE_LISTING_DOCUMENTS_TABLE.sql`

❌ **FAILURE (RLS Policy):**

```
✓ Successfully uploaded 3 documents to storage
Attempting to insert documents with modern schema...
✗ Document insert error: violates row level security policy "listing_documents_insert_own"
Failed to insert documents to database: violates row level security policy...
```

**Action:** Check RLS policies - ensure `uploaded_by` matches current user

❌ **FAILURE (Storage Bucket):**

```
Uploading cert.pdf (524288 bytes)...
Failed to upload cert.pdf: Bucket not found
Document upload failed: Failed to upload document cert.pdf...
```

**Action:** Create `listing-documents` bucket in Supabase Storage

---

## 🔧 Database Setup (If Needed)

If you see "relation 'public.listing_documents' does not exist" error:

### Option 1: Supabase SQL Editor (Easiest)

1. Go to: **Supabase Dashboard → SQL Editor**
2. Click: **"New Query"**
3. Copy & paste content from: **`db instructions/CREATE_LISTING_DOCUMENTS_TABLE.sql`**
4. Click: **"Run"**
5. Should show: **"Success"** with row count

### Option 2: Using psql CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Manual SQL Commands

If you prefer to run line-by-line:

```sql
-- Create table
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

-- Enable RLS
alter table public.listing_documents enable row level security;

-- Create INSERT policy
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

-- Create SELECT policy
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

-- Create index
create index if not exists idx_listing_documents_listing_id
  on public.listing_documents(listing_id);
```

### Storage Bucket Setup

1. Go to: **Supabase Dashboard → Storage**
2. Click: **"New Bucket"**
3. Name: **`listing-documents`**
4. Access: **Public** (not Private)
5. Click: **"Create Bucket"**

---

## 🔍 Verification Queries

### Check Table Exists

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'listing_documents';
```

Expected: One row with `listing_documents`

### Check RLS Is Enabled

```sql
SELECT relname, relrowsecurity FROM pg_class
WHERE relname = 'listing_documents';
```

Expected: `listing_documents | t`

### Check Policies Exist

```sql
SELECT tablename, policyname FROM pg_policies
WHERE tablename = 'listing_documents';
```

Expected:

- `listing_documents_insert_own`
- `listing_documents_select_admin_or_owner`

### View Uploaded Documents

```sql
-- View all documents for a listing
SELECT
  id,
  file_name,
  file_url,
  document_type,
  file_size_bytes,
  created_at
FROM listing_documents
WHERE listing_id = 'YOUR_LISTING_ID'
ORDER BY created_at DESC;
```

Replace `YOUR_LISTING_ID` with an actual listing ID from the listings table.

---

## 📊 Expected Behavior

### Before Documents Work:

1. User uploads documents → See green checkmarks
2. Goes to Review step → Documents show in list
3. Clicks Submit → Spins forever or shows vague error
4. Console shows errors about table not existing or RLS violation

### After Documents Work:

1. User uploads documents → See green checkmarks ✓
2. Goes to Review step → Documents show in list ✓
3. Clicks Submit → Form processes ✓
4. After ~5-10 seconds → Success modal appears ✓
5. Redirects to /profile → Listing appears in profile ✓
6. Console shows: `✓ Successfully inserted 3 documents to DB (modern schema)` ✓

---

## 🚀 Next Steps

### Immediate:

1. [ ] Check browser console for document upload logs
2. [ ] If errors: Apply missing migrations (see Database Setup above)
3. [ ] Re-test document upload
4. [ ] Verify documents appear in database

### If Successful:

1. [ ] Test on mobile device
2. [ ] Test with different file types (PDF, JPG, DOCX)
3. [ ] Test with multiple documents
4. [ ] Verify file URLs are accessible

### If Still Having Issues:

1. [ ] Share console error logs
2. [ ] Check `/db instructions/` folder for specific migration files
3. [ ] Verify `listing-documents` storage bucket is public
4. [ ] Check Supabase → Logs tab for detailed errors

---

## 📝 Code Changes Summary

**Files Modified:**

- `app/list-business/page.tsx` - Enhanced error handling and logging (lines 570-680)
- `components/ContactModal.tsx` - Fixed TypeScript error (line 102)

**Files Created:**

- `DOCUMENT_UPLOAD_DIAGNOSTICS.md` - Comprehensive troubleshooting guide

**No breaking changes** - All updates are backward compatible.

---

## 💡 Tips

- **Clear Logs:** Refresh page before testing to see clean console output
- **File Size:** Max file size is 5MB per document
- **File Types:** Supports PDF, JPG, PNG, DOCX, XLSX
- **Storage URL:** Documents stored in `listing-documents/{user_id}/{listing_id}/filename`
- **Production:** Consider adding CloudFront CDN for faster document access

---

**Last Updated:** 2026-02-16
**Status:** ✅ Ready for Testing
**Testing:** Open browser console (F12) and watch for logs
