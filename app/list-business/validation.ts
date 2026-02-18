// Form validation utilities for list-business form

export type ValidationError = {
  field: string;
  message: string;
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (digits only, 7-15 characters)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{7,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
};

// Positive number validation
export const isPositiveNumber = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// Percentage validation (0-100)
export const isValidPercentage = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= 0 && num <= 100;
};

// Year validation (between 1900 and current year)
export const isValidYear = (value: any): boolean => {
  const num = Number(value);
  const currentYear = new Date().getFullYear();
  return !isNaN(num) && num >= 1900 && num <= currentYear;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Name validation (letters, spaces, hyphens only, 2-100 chars)
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s-]{2,100}$/;
  return nameRegex.test(name);
};

// Text length validation
export const isValidLength = (
  text: string,
  min: number,
  max: number,
): boolean => {
  const length = text.trim().length;
  return length >= min && length <= max;
};

// Integer validation (whole numbers only)
export const isInteger = (value: any): boolean => {
  const num = Number(value);
  return !isNaN(num) && Number.isInteger(num) && num >= 0;
};

// Validate Step 1: Seller Info
export const validateSellerInfo = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Full Name
  if (!formData.seller_full_name) {
    errors.push({
      field: "seller_full_name",
      message: "Full name is required",
    });
  } else if (!isValidName(formData.seller_full_name)) {
    errors.push({
      field: "seller_full_name",
      message: "Please enter a valid name (letters only)",
    });
  }

  // Email
  if (!formData.seller_email) {
    errors.push({ field: "seller_email", message: "Email is required" });
  } else if (!isValidEmail(formData.seller_email)) {
    errors.push({
      field: "seller_email",
      message: "Please enter a valid email address",
    });
  }

  // Phone
  if (!formData.seller_phone) {
    errors.push({ field: "seller_phone", message: "Phone number is required" });
  } else if (!isValidPhone(formData.seller_phone)) {
    errors.push({
      field: "seller_phone",
      message:
        "Please enter a valid phone number (digits only, 7-15 characters)",
    });
  }

  // Country Code
  if (!formData.seller_phone_country_code) {
    errors.push({
      field: "seller_phone_country_code",
      message: "Country code is required",
    });
  }

  // Country
  if (!formData.seller_country) {
    errors.push({ field: "seller_country", message: "Country is required" });
  }

  // Preferred Contact

  // Relationship
  if (!formData.seller_relationship) {
    errors.push({
      field: "seller_relationship",
      message: "Relationship to business is required",
    });
  }

  // Authority to Sell
  if (formData.seller_authority_to_sell !== true) {
    errors.push({
      field: "seller_authority_to_sell",
      message: "You must confirm authority to sell",
    });
  }

  return errors;
};

// Validate Step 2: Basic Info
export const validateBasicInfo = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  const type = formData.listing_type;

  // Business Sale
  if (type === "business_sale") {
    if (
      !formData.business_name ||
      !isValidLength(formData.business_name, 2, 200)
    ) {
      errors.push({
        field: "business_name",
        message: "Business name must be 2-200 characters",
      });
    }

    if (!formData.year_established) {
      errors.push({
        field: "year_established",
        message: "Year established is required",
      });
    } else if (!isValidYear(formData.year_established)) {
      errors.push({
        field: "year_established",
        message: "Please enter a valid year (1900-present)",
      });
    }

    if (!formData.employees_count) {
      errors.push({
        field: "employees_count",
        message: "Number of employees is required",
      });
    } else if (!isInteger(formData.employees_count)) {
      errors.push({
        field: "employees_count",
        message: "Please enter a valid whole number",
      });
    }
  }

  // Franchise Sale
  if (type === "franchise_sale") {
    if (!formData.brand_name || !isValidLength(formData.brand_name, 2, 200)) {
      errors.push({
        field: "brand_name",
        message: "Brand name must be 2-200 characters",
      });
    }

    if (!formData.year_founded) {
      errors.push({
        field: "year_founded",
        message: "Year founded is required",
      });
    } else if (!isValidYear(formData.year_founded)) {
      errors.push({
        field: "year_founded",
        message: "Please enter a valid year (1900-present)",
      });
    }

    if (!formData.total_units) {
      errors.push({ field: "total_units", message: "Total units is required" });
    } else if (!isInteger(formData.total_units)) {
      errors.push({
        field: "total_units",
        message: "Please enter a valid whole number",
      });
    }
  }

  // Investment Opportunity
  if (type === "investment_opportunity") {
    if (
      !formData.company_name ||
      !isValidLength(formData.company_name, 2, 200)
    ) {
      errors.push({
        field: "company_name",
        message: "Company name must be 2-200 characters",
      });
    }

    if (!formData.year_founded) {
      errors.push({
        field: "year_founded",
        message: "Year founded is required",
      });
    } else if (!isValidYear(formData.year_founded)) {
      errors.push({
        field: "year_founded",
        message: "Please enter a valid year (1900-present)",
      });
    }

    if (!formData.company_stage) {
      errors.push({
        field: "company_stage",
        message: "Company stage is required",
      });
    }
  }

  // Common fields
  if (!formData.industry) {
    errors.push({ field: "industry", message: "Industry is required" });
  }

  if (!formData.country) {
    errors.push({ field: "country", message: "Country is required" });
  }

  if (!formData.city || !isValidLength(formData.city, 2, 100)) {
    errors.push({ field: "city", message: "City must be 2-100 characters" });
  }

  return errors;
};

// Validate Step 3: Financials
export const validateFinancials = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  const type = formData.listing_type;

  // Business Sale
  if (type === "business_sale") {
    if (
      !formData.annual_revenue ||
      !isPositiveNumber(formData.annual_revenue)
    ) {
      errors.push({
        field: "annual_revenue",
        message: "Please enter a valid annual revenue (positive number)",
      });
    }

    if (!formData.net_profit || !isPositiveNumber(formData.net_profit)) {
      errors.push({
        field: "net_profit",
        message: "Please enter a valid net profit (positive number)",
      });
    }

    if (!formData.asking_price || !isPositiveNumber(formData.asking_price)) {
      errors.push({
        field: "asking_price",
        message: "Please enter a valid asking price (positive number)",
      });
    }
  }

  // Franchise Sale
  if (type === "franchise_sale") {
    if (
      !formData.avg_unit_revenue ||
      !isPositiveNumber(formData.avg_unit_revenue)
    ) {
      errors.push({
        field: "avg_unit_revenue",
        message: "Please enter valid average unit revenue (positive number)",
      });
    }

    if (
      !formData.avg_unit_net_profit ||
      !isPositiveNumber(formData.avg_unit_net_profit)
    ) {
      errors.push({
        field: "avg_unit_net_profit",
        message: "Please enter valid average unit profit (positive number)",
      });
    }

    if (!formData.franchise_fee || !isPositiveNumber(formData.franchise_fee)) {
      errors.push({
        field: "franchise_fee",
        message: "Please enter a valid franchise fee (positive number)",
      });
    }

    if (
      !formData.royalty_fee_percentage ||
      !isValidPercentage(formData.royalty_fee_percentage)
    ) {
      errors.push({
        field: "royalty_fee_percentage",
        message: "Please enter a valid royalty fee (0-100%)",
      });
    }

    if (
      formData.total_setup_cost &&
      !isPositiveNumber(formData.total_setup_cost)
    ) {
      errors.push({
        field: "total_setup_cost",
        message: "Please enter a valid setup cost (positive number)",
      });
    }
  }

  // Investment Opportunity
  if (type === "investment_opportunity") {
    if (
      !formData.capital_required ||
      !isPositiveNumber(formData.capital_required)
    ) {
      errors.push({
        field: "capital_required",
        message: "Please enter valid capital required (positive number)",
      });
    }

    if (
      !formData.equity_offered_percentage ||
      !isValidPercentage(formData.equity_offered_percentage)
    ) {
      errors.push({
        field: "equity_offered_percentage",
        message: "Please enter valid equity offered (0-100%)",
      });
    }

    if (formData.annual_revenue && !isPositiveNumber(formData.annual_revenue)) {
      errors.push({
        field: "annual_revenue",
        message: "Please enter a valid annual revenue (positive number)",
      });
    }
  }

  return errors;
};

// Validate Step 4: Story
export const validateStory = (formData: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  const type = formData.listing_type;

  // Business Sale
  if (type === "business_sale") {
    if (
      !formData.business_description ||
      !isValidLength(formData.business_description, 50, 5000)
    ) {
      errors.push({
        field: "business_description",
        message: "Business description must be 50-5000 characters",
      });
    }

    if (!formData.owner_involvement) {
      errors.push({
        field: "owner_involvement",
        message: "Owner involvement is required",
      });
    }

    if (
      !formData.reason_for_sale ||
      !isValidLength(formData.reason_for_sale, 20, 1000)
    ) {
      errors.push({
        field: "reason_for_sale",
        message: "Reason for sale must be 20-1000 characters",
      });
    }
  }

  // Franchise Sale
  if (type === "franchise_sale") {
    if (
      !formData.franchise_concept ||
      !isValidLength(formData.franchise_concept, 50, 5000)
    ) {
      errors.push({
        field: "franchise_concept",
        message: "Franchise concept must be 50-5000 characters",
      });
    }

    if (
      !formData.target_customer ||
      !isValidLength(formData.target_customer, 20, 1000)
    ) {
      errors.push({
        field: "target_customer",
        message: "Target customer description must be 20-1000 characters",
      });
    }

    if (!formData.support_provided || formData.support_provided.length === 0) {
      errors.push({
        field: "support_provided",
        message: "Please select at least one support option",
      });
    }
  }

  // Investment Opportunity
  if (type === "investment_opportunity") {
    if (
      !formData.business_overview ||
      !isValidLength(formData.business_overview, 50, 5000)
    ) {
      errors.push({
        field: "business_overview",
        message: "Business overview must be 50-5000 characters",
      });
    }

    if (
      !formData.scalability_reason ||
      !isValidLength(formData.scalability_reason, 20, 1000)
    ) {
      errors.push({
        field: "scalability_reason",
        message: "Scalability reason must be 20-1000 characters",
      });
    }
  }

  return errors;
};

// Display error messages
export const showValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return "";

  const messages = errors.map((err) => err.message).slice(0, 3); // Show first 3 errors
  const remaining = errors.length - 3;

  let message = messages.join("\n");
  if (remaining > 0) {
    message += `\n\n...and ${remaining} more error${remaining > 1 ? "s" : ""}`;
  }

  return message;
};
