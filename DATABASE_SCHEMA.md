# Acquity Marketplace Database Schema

## Core Tables

### users

**Purpose:** User accounts (sellers, buyers, investors)

| Column     | Type        | Constraint       | Notes               |
| ---------- | ----------- | ---------------- | ------------------- |
| id         | uuid        | PK               | Generated           |
| email      | text        | NOT NULL, UNIQUE | Login identifier    |
| name       | text        | NULL             | Seller/profile name |
| created_at | timestamptz | DEFAULT now()    | Account creation    |

---

### listings

**Purpose:** Core marketplace listings (businesses, franchises, investments)

| Column           | Type        | Constraint          | Notes                                                     |
| ---------------- | ----------- | ------------------- | --------------------------------------------------------- |
| id               | uuid        | PK                  | Generated                                                 |
| owner_id         | uuid        | FK → users.id, NULL | Seller (nullable for now)                                 |
| type             | text        | NOT NULL, ENUM      | business_sale \| franchise_sale \| investment_opportunity |
| plan             | text        | NOT NULL, ENUM      | free \| premium                                           |
| title            | text        | NOT NULL            | Listing headline                                          |
| category         | text        | NOT NULL            | Industry/sector                                           |
| location         | text        | NOT NULL            | e.g., "Dubai, UAE"                                        |
| country          | text        | NULL                | Normalized country                                        |
| description      | text        | NOT NULL            | Full listing narrative                                    |
| established_year | int         | NULL                | Year founded                                              |
| image            | text        | NULL                | Primary image URL                                         |
| price            | numeric     | NULL                | Asking price / capital required fallback                  |
| revenue          | numeric     | NULL                | Annual revenue                                            |
| ebitda           | numeric     | NULL                | EBITDA or net profit                                      |
| is_active        | boolean     | DEFAULT true        | Soft delete / visibility                                  |
| created_at       | timestamptz | DEFAULT now()       |                                                           |
| updated_at       | timestamptz | DEFAULT now()       |                                                           |

**Indexes:**

- (type, plan)
- (category)
- (country)
- (plan) WHERE plan='premium'
- (created_at DESC)
- (price), (revenue) for sorting

---

### listing_financials

**Purpose:** Detailed financial metrics (one-to-one with listings)

| Column               | Type    | Constraint                             | Notes                    |
| -------------------- | ------- | -------------------------------------- | ------------------------ |
| listing_id           | uuid    | PK, FK → listings.id ON DELETE CASCADE |                          |
| valuation_multiple   | numeric | NULL                                   | e.g., 3.5x EBITDA        |
| gross_margin         | numeric | NULL                                   | %                        |
| net_margin           | numeric | NULL                                   | %                        |
| inventory_value      | numeric | NULL                                   | Balance sheet item       |
| assets_value         | numeric | NULL                                   | Total assets             |
| liabilities          | numeric | NULL                                   | Total debt/liabilities   |
| revenue_3yr_cagr_pct | numeric | NULL                                   | 3-year growth rate       |
| income_statement     | jsonb   | NULL                                   | Structured P&L breakdown |

---

### listing_operational

**Purpose:** Operational details and seller info (one-to-one with listings)

| Column              | Type | Constraint                             | Notes                                  |
| ------------------- | ---- | -------------------------------------- | -------------------------------------- |
| listing_id          | uuid | PK, FK → listings.id ON DELETE CASCADE |                                        |
| employees_count     | int  | NULL                                   | Headcount                              |
| owner_involvement   | text | NULL, ENUM                             | none \| part_time \| full_time         |
| support_provided    | text | NULL, ENUM                             | none \| transition \| training \| full |
| seller_relationship | text | NULL, ENUM                             | broker \| owner \| mandate \| advisor  |
| preferred_contact   | text | NULL, ENUM                             | email \| phone \| platform             |

---

### listing_franchise_details

**Purpose:** Franchise-specific fields (type = franchise_sale)

| Column              | Type    | Constraint                             | Notes                                   |
| ------------------- | ------- | -------------------------------------- | --------------------------------------- |
| listing_id          | uuid    | PK, FK → listings.id ON DELETE CASCADE |                                         |
| franchise_fee       | numeric | NULL                                   | Initial investment                      |
| avg_unit_revenue    | numeric | NULL                                   | Avg unit annual revenue                 |
| avg_unit_net_profit | numeric | NULL                                   | Avg unit annual profit                  |
| units_count         | int     | NULL                                   | Number of operating units               |
| franchise_type      | text    | NULL                                   | master \| single_unit \| area_developer |

---

### listing_investment_details

**Purpose:** Investment-specific fields (type = investment_opportunity)

| Column                    | Type    | Constraint                             | Notes                                      |
| ------------------------- | ------- | -------------------------------------- | ------------------------------------------ |
| listing_id                | uuid    | PK, FK → listings.id ON DELETE CASCADE |                                            |
| capital_required          | numeric | NULL                                   | Total capital sought                       |
| equity_offered_percentage | numeric | NULL                                   | % stake offered                            |
| annual_profit             | numeric | NULL                                   | Annual profit generated                    |
| company_stage             | text    | NULL, ENUM                             | idea \| mvp \| revenue \| growth \| mature |

---

### listing_raw_payloads

**Purpose:** Preserve full form submission (backup of all fields submitted)

| Column      | Type        | Constraint                             | Notes                                             |
| ----------- | ----------- | -------------------------------------- | ------------------------------------------------- |
| listing_id  | uuid        | PK, FK → listings.id ON DELETE CASCADE |                                                   |
| raw         | jsonb       | NOT NULL                               | Entire form data; future-proof for schema changes |
| captured_at | timestamptz | DEFAULT now()                          | When form was submitted                           |

---

### listing_documents

**Purpose:** File attachments, financial statements, pitch decks, contracts, etc.

| Column              | Type        | Constraint                         | Notes                                                                                          |
| ------------------- | ----------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| id                  | uuid        | PK                                 | Generated                                                                                      |
| listing_id          | uuid        | FK → listings.id ON DELETE CASCADE | NOT NULL                                                                                       |
| document_type       | text        | NOT NULL, ENUM                     | financial_statement \| pitch_deck \| contract \| legal_doc \| tax_return \| other              |
| file_name           | text        | NOT NULL                           | Original filename                                                                              |
| file_url            | text        | NOT NULL                           | S3/Cloud storage URL or signed URL                                                             |
| file_size_bytes     | int         | NULL                               | Document size                                                                                  |
| mime_type           | text        | NULL                               | e.g., application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| uploaded_by_user_id | uuid        | NULL, FK → users.id                | Who uploaded; nullable for admin uploads                                                       |
| uploaded_at         | timestamptz | DEFAULT now()                      | Upload timestamp                                                                               |
| is_confidential     | boolean     | DEFAULT true                       | Requires NDA/access control                                                                    |
| description         | text        | NULL                               | e.g., "2023 Audited Financials"                                                                |
| metadata            | jsonb       | NULL                               | Page count, scan quality, extraction results, etc.                                             |

**Indexes:**

- (listing_id, document_type)
- (listing_id, uploaded_at DESC)
- (document_type) for filtering by category

---

### contact_submissions

**Purpose:** Buyer/investor inquiries via contact form

| Column              | Type        | Constraint             | Notes                                     |
| ------------------- | ----------- | ---------------------- | ----------------------------------------- |
| id                  | uuid        | PK                     | Generated                                 |
| listing_id          | uuid        | FK → listings.id, NULL | Inquiry about specific listing or general |
| name                | text        | NOT NULL               | Buyer/investor name                       |
| company             | text        | NULL                   | Organization                              |
| budget_range        | text        | NULL                   | Inquiry budget (string enum-ish)          |
| reason_for_interest | text        | NULL                   | Free text explanation                     |
| contact_email       | text        | NOT NULL               | Reply-to email                            |
| phone               | text        | NULL                   | Optional phone                            |
| created_at          | timestamptz | DEFAULT now()          |                                           |

**Indexes:**

- (listing_id)
- (contact_email)
- (created_at DESC)

---

## Lookup Tables (Reference/Enums)

Keep as separate tables for normalization and easy validation:

- **listing_types** — business_sale, franchise_sale, investment_opportunity
- **listing_plans** — free, premium
- **industries** — All categories (FinTech, Manufacturing, Food & Beverage, etc.)
- **countries** — MENA, GCC, Africa, Asia, Americas regions/countries
- **support_provided_types** — none, transition, training, full
- **owner_involvement_types** — none, part_time, full_time
- **company_stages** — idea, mvp, revenue, growth, mature
- **seller_relationship_types** — broker, owner, mandate, advisor
- **preferred_contact_types** — email, phone, platform
- **document_types** — financial_statement, pitch_deck, contract, legal_doc, tax_return, other

---

## Relationships Summary

```
users
  ├─ listings (1:N via owner_id)
  │  ├─ listing_financials (1:1)
  │  ├─ listing_operational (1:1)
  │  ├─ listing_franchise_details (1:1, conditional on type)
  │  ├─ listing_investment_details (1:1, conditional on type)
  │  ├─ listing_raw_payloads (1:1)
  │  ├─ listing_documents (1:N)
  │  └─ contact_submissions (1:N)
  └─ listing_documents (uploaded_by_user_id)
     └─ contact_submissions (N:1 listing_id)
```

---

## Notes

- **Soft Deletes:** Use `is_active` boolean in `listings` instead of hard deletes to preserve referential integrity.
- **Document Storage:** Files stored externally (S3, Azure Blob, Supabase Storage); `listing_documents.file_url` holds the signed/public URL. Metadata (page count, OCR results, etc.) stored in `metadata` JSONB.
- **Confidentiality:** `listing_documents.is_confidential` enforces NDA checks at application layer; implement row-level security (RLS) policies in Supabase if needed.
- **Type-Specific Fields:** `listing_franchise_details` and `listing_investment_details` remain empty for non-matching types; keep them normalized and query conditionally (`WHERE type = 'franchise_sale'`).
- **Raw Payloads:** `listing_raw_payloads.raw` captures the entire form state JSON; this allows future schema migrations without data loss.
- **Indexes:** Critical for filter/sort performance; adjust based on observed query patterns.
