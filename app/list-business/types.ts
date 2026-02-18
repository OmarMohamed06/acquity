// app/(seller)/listings/create/types.ts

export type ListingType =
  | "business_sale"
  | "franchise_sale"
  | "investment_opportunity";

export type SaleType = "full" | "partial";
export type OwnerInvolvement = "active" | "semi_passive" | "passive";
export type CompanyStage = "mvp" | "revenue" | "profitable";
export type SupportProvided = "training" | "operations" | "marketing";

export type ListingFormData = {
  listing_type: ListingType;

  // STEP 1 — SELLER INFO
  seller_full_name?: string;
  seller_email?: string;
  seller_phone?: string;
  seller_phone_country_code?: string;
  seller_country?: string;
  seller_relationship?:
    | "owner"
    | "cofounder"
    | "shareholder"
    | "representative"
    | "broker";
  seller_ownership_percentage?: number;
  seller_authority_to_sell?: boolean;

  // STEP 2 — BASIC INFO
  business_name?: string;
  industry?: string;
  country?: string;
  city?: string;
  year_established?: number;
  employees_count?: number;

  brand_name?: string;
  city_or_territory?: string;
  year_founded?: number;
  total_units?: number;

  company_name?: string;
  company_stage?: CompanyStage;

  // STEP 2 — FINANCIALS
  annual_revenue?: number;
  net_profit?: number;
  ebitda?: number;
  annual_net_cash_flow?: number;
  asking_price?: number;
  //franchise financials
  avg_unit_revenue?: number;
  avg_unit_net_profit?: number;
  avg_unit_net_cash_flow?: number;
  franchise_fee?: number;
  total_setup_cost?: number;
  royalty_fee_percentage?: number;
  //investment financials
  annual_profit?: number;
  capital_required?: number;
  equity_offered_percentage?: number;
  implied_valuation?: number;

  // STEP 3 — STORY
  business_description?: string;
  owner_involvement?: OwnerInvolvement;
  reason_for_sale?: string;
  //franchise story
  franchise_concept?: string;
  target_customer?: string;
  support_provided?: SupportProvided[];
  //investment story
  business_overview?: string;
  scalability_reason?: string;

  // STEP 3 — MEDIA
  listing_image?: File;

  // STEP 4 — DOCUMENTS
  documents?: {
    company_registration_doc?: File;
    financial_statement_doc?: File;
    owner_identity_doc?: File;

    franchise_registration_doc?: File;
    unit_financial_sample_doc?: File;
    legal_right_to_franchise_doc?: File;

    financial_summary_doc?: File;
    founder_identity_doc?: File;
  };
  documents_certified?: boolean;
};

export type ListingDocuments = {
  // business
  company_registration_doc?: File;
  financial_statement_doc?: File;
  owner_identity_doc?: File;

  // franchise
  franchise_registration_doc?: File;
  unit_financial_sample_doc?: File;
  legal_right_to_franchise_doc?: File;

  // investment
  pitch_deck?: File;
  financial_summary_doc?: File;
  founder_identity_doc?: File;
};
