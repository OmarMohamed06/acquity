"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { ListingFormData, SupportProvided } from "./types";
import { generateListingSlug } from "@/lib/slug-generation";
import {
  validateSellerInfo,
  validateBasicInfo,
  validateFinancials,
  validateStory,
  showValidationErrors,
} from "./validation";
import SellerInfo from "./steps/SellerInfo";
import BasicInfo from "./steps/BasicInfo";
import Financials from "./steps/Financials";
import Story from "./steps/Story";
import Media from "./steps/Media";
import Review from "./steps/Review";

const IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET || "listing-images";
const DOCUMENT_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_DOCUMENT_BUCKET || "listing-documents";

// Compress image before upload to reduce file size and upload time
const compressImage = async (file: File, maxSizeMB = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if too large (max 2560px width for high-res displays)
        const maxWidth = 2560;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress with high quality for public viewing
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Compression failed"));
            }
          },
          "image/jpeg",
          0.92, // 92% quality - excellent for public display
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const mapOwnerInvolvement = (value?: string | null) => {
  if (value === "active") return "full_time";
  if (value === "semi_passive") return "part_time";
  if (value === "passive") return "none";
  return null;
};

const mapSupportProvided = (values?: SupportProvided[] | null) => {
  if (!values || values.length === 0) return ["none"];
  // Return as array for PostgreSQL TEXT[] column
  return values;
};

const mapCompanyStage = (stage?: string | null) => {
  if (!stage) return "idea";
  if (stage === "mvp") return "mvp";
  if (stage === "revenue") return "revenue";
  if (stage === "profitable") return "growth";
  return "idea";
};

const mapDocumentType = (key: string): string | null => {
  // Map document keys to database types
  // Returns null to trigger the fallback to "other" in the payload
  // This avoids constraint violations
  try {
    if (key.includes("financial")) return "financial_doc";
    if (key.includes("legal")) return "legal_doc";
    if (key.includes("registration")) return "legal_doc";
    if (key.includes("identity")) return "identity_doc";
    if (key.includes("certificate")) return "certificate";
    if (key.includes("license")) return "license";
  } catch (e) {
    console.warn(`Error mapping document type for key "${key}":`, e);
  }
  // Return null to trigger fallback in payload (document_type || "other")
  return null;
};

const toStoragePath = (folder: string, file: File) => {
  // Sanitize filename to avoid invalid storage keys
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-") // Replace special chars with dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes

  if (!sanitizedName || sanitizedName === "[id]") {
    console.warn(`File name is invalid: "${file.name}". Using fallback name.`);
    return `${folder}/${crypto.randomUUID()}-document-${Date.now()}`;
  }

  return `${folder}/${crypto.randomUUID()}-${sanitizedName}`;
};

const uploadToBucket = async (
  bucket: string,
  path: string,
  file: File,
): Promise<{ storagePath: string; publicUrl: string }> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message || "Failed to upload file");
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
  return {
    storagePath: data?.path || path,
    publicUrl: publicData.publicUrl,
  };
};

export default function ListBusinessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>({
    listing_type: "business_sale",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ field: string; message: string }>
  >([]);

  const canContinue = () => {
    // STEP 1 — Seller Info
    if (step === 1) {
      return (
        !!formData.seller_full_name &&
        !!formData.seller_email &&
        !!formData.seller_phone &&
        !!formData.seller_phone_country_code &&
        !!formData.seller_country &&
        !!formData.seller_relationship &&
        formData.seller_authority_to_sell === true
      );
    }

    // STEP 2 — Basic Info
    if (step === 2) {
      if (formData.listing_type === "business_sale") {
        return (
          !!formData.business_name &&
          !!formData.industry &&
          !!formData.country &&
          !!formData.city &&
          Number(formData.year_established || 0) > 0 &&
          Number(formData.employees_count || 0) > 0
        );
      }

      if (formData.listing_type === "franchise_sale") {
        return (
          !!formData.brand_name &&
          !!formData.industry &&
          !!formData.country &&
          !!formData.city &&
          Number(formData.year_founded || 0) > 0 &&
          Number(formData.total_units || 0) > 0
        );
      }

      if (formData.listing_type === "investment_opportunity") {
        return (
          !!formData.company_name &&
          !!formData.industry &&
          !!formData.country &&
          !!formData.city &&
          Number(formData.year_founded || 0) > 0 &&
          !!formData.company_stage
        );
      }

      return false;
    }

    // STEP 3 — Financials
    if (step === 3) {
      if (formData.listing_type === "business_sale") {
        return (
          Number(formData.annual_revenue || 0) > 0 &&
          Number(formData.net_profit || 0) > 0 &&
          Number(formData.asking_price || 0) > 0
        );
      }

      if (formData.listing_type === "franchise_sale") {
        return (
          Number(formData.avg_unit_revenue || 0) > 0 &&
          Number(formData.avg_unit_net_profit || 0) > 0 &&
          Number(formData.franchise_fee || 0) > 0 &&
          Number(formData.royalty_fee_percentage || 0) > 0
        );
      }

      if (formData.listing_type === "investment_opportunity") {
        return (
          Number(formData.capital_required || 0) > 0 &&
          Number(formData.equity_offered_percentage || 0) > 0
        );
      }

      return false;
    }

    // STEP 4 — Story
    if (step === 4) {
      if (formData.listing_type === "business_sale") {
        return (
          !!formData.business_description &&
          !!formData.owner_involvement &&
          !!formData.reason_for_sale
        );
      }

      if (formData.listing_type === "franchise_sale") {
        return (
          !!formData.franchise_concept &&
          !!formData.target_customer &&
          (formData.support_provided?.length ?? 0) > 0
        );
      }

      if (formData.listing_type === "investment_opportunity") {
        return !!formData.business_overview && !!formData.scalability_reason;
      }

      return false;
    }

    // STEP 5 — Media
    if (step === 5) {
      const d = formData.documents;

      if (formData.listing_type === "business_sale") {
        return (
          !!d?.company_registration_doc &&
          !!d?.financial_statement_doc &&
          !!d?.owner_identity_doc &&
          formData.documents_certified === true
        );
      }

      if (formData.listing_type === "franchise_sale") {
        return (
          !!d?.franchise_registration_doc &&
          !!d?.unit_financial_sample_doc &&
          !!d?.legal_right_to_franchise_doc &&
          formData.documents_certified === true
        );
      }

      if (formData.listing_type === "investment_opportunity") {
        return (
          !!d?.company_registration_doc &&
          !!d?.financial_summary_doc &&
          !!d?.founder_identity_doc &&
          formData.documents_certified === true
        );
      }

      return false;
    }

    // STEP 6 — Review (no validation needed, always passable)
    if (step === 6) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (
    planSelection: "basic" | "standard" | "premium" = "basic",
  ) => {
    try {
      void planSelection;
      if (submitting) return;
      setSubmitting(true);

      console.log("Form submission started");
      console.log("Form data documents:", formData.documents);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        throw new Error("Not authenticated");
      }

      const title =
        formData.listing_type === "business_sale"
          ? formData.business_name || "Untitled Business"
          : formData.listing_type === "franchise_sale"
            ? formData.brand_name || "Untitled Franchise"
            : formData.company_name || "Untitled Investment";

      const category = formData.industry || "General";

      const plan = "basic";
      const paymentStatus = "free_beta";

      // Ensure user has a profile (but don't overwrite their actual name/email with seller info)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.email || "",
        });
      }

      // Validate all required seller fields before inserting listing
      if (!formData.seller_full_name) {
        throw new Error("Seller full name is required");
      }
      if (!formData.seller_email) {
        throw new Error("Seller email is required");
      }
      if (!formData.seller_phone) {
        throw new Error("Seller phone is required");
      }
      if (!formData.seller_phone_country_code) {
        throw new Error("Seller phone country code is required");
      }
      if (!formData.seller_country) {
        throw new Error("Seller country is required");
      }
      if (!formData.seller_relationship) {
        throw new Error("Seller relationship is required");
      }

      // Compress and upload listing image in parallel with other operations
      let imageUrl: string | null = null;
      const imageUploadPromise = formData.listing_image
        ? compressImage(formData.listing_image)
            .then((compressedImage) => {
              const path = toStoragePath(
                `${authUser.id}/listing-images`,
                compressedImage,
              );
              return uploadToBucket(IMAGE_BUCKET, path, compressedImage);
            })
            .then(({ publicUrl }) => {
              imageUrl = publicUrl;
            })
            .catch((uploadError) => {
              console.warn("Image upload failed:", uploadError);
              setStorageWarning(true);
            })
        : Promise.resolve();

      // Wait for image upload to complete
      await imageUploadPromise;

      // Create listing data object first (without slug) to get the ID
      const tempListingData = {
        user_id: authUser.id,
        title,
        category,
        location: formData.city || "",
        country: formData.country || "",
        description:
          formData.business_description ||
          formData.franchise_concept ||
          formData.business_overview ||
          "",
        seller_full_name: formData.seller_full_name,
        seller_email: formData.seller_email,
        seller_phone: formData.seller_phone,
        seller_phone_country_code: formData.seller_phone_country_code,
        seller_country: formData.seller_country,

        seller_relationship: formData.seller_relationship,
        seller_ownership_percentage:
          formData.seller_ownership_percentage || null,
        seller_authority_to_sell: formData.seller_authority_to_sell ?? false,
        type: formData.listing_type,
        plan,
        payment_status: paymentStatus,
        status: "pending",
        image_url: imageUrl,
      };

      // Insert listing first to get the generated ID
      const { data: insertedListing, error: insertError } = await supabase
        .from("listings")
        .insert([tempListingData])
        .select()
        .single();

      if (insertError || !insertedListing) {
        console.error("Listing insert error:", insertError);
        throw new Error(
          `Listing insert failed: ${
            insertError?.message ||
            JSON.stringify(insertError) ||
            "No data returned"
          }`,
        );
      }

      const listingId = insertedListing.id as string;

      // Generate slug ONCE using the actual listing ID and title
      // This slug will NEVER be regenerated, ensuring permanent SEO-friendly URLs
      const slug = generateListingSlug({
        listingTitle: title,
        listingId: listingId,
        listingType: formData.listing_type,
      });

      // Update the listing with the generated slug
      const { error: slugUpdateError } = await supabase
        .from("listings")
        .update({ slug })
        .eq("id", listingId);

      if (slugUpdateError) {
        console.warn("Slug update error:", slugUpdateError);
        // Continue even if slug update fails - listing is already created
      }

      // Insert type-specific details based on listing type
      let detailsInsertPromise: PromiseLike<void>;

      if (formData.listing_type === "business_sale") {
        detailsInsertPromise = supabase
          .from("business_sale_details")
          .insert([
            {
              listing_id: listingId,
              year_established: formData.year_established || null,
              employees_count: formData.employees_count || null,
              asking_price: formData.asking_price || null,
              annual_revenue: formData.annual_revenue || null,
              ebitda: formData.ebitda || null,
              annual_cashflow: formData.annual_net_cash_flow || null,
              reason_for_sale: formData.reason_for_sale || null,
              owner_involvement: mapOwnerInvolvement(
                formData.owner_involvement,
              ),
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error("Business details insert error:", error);
              throw new Error(
                `Business details insert failed: ${
                  error.message || JSON.stringify(error)
                }`,
              );
            }
          });
      } else if (formData.listing_type === "franchise_sale") {
        detailsInsertPromise = supabase
          .from("franchise_sale_details")
          .insert([
            {
              listing_id: listingId,
              year_founded: formData.year_founded || null,
              total_units: formData.total_units || null,
              franchise_fee: formData.franchise_fee || null,
              royalty_fee_percent: formData.royalty_fee_percentage || null,
              avg_unit_revenue: formData.avg_unit_revenue || null,
              avg_unit_profit: formData.avg_unit_net_profit || null,
              avg_unit_cash_flow: formData.avg_unit_net_cash_flow || null,
              support_provided: mapSupportProvided(formData.support_provided),
              target_customer: formData.target_customer || null,
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error("Franchise details insert error:", error);
              throw new Error(
                `Franchise details insert failed: ${
                  error.message || JSON.stringify(error)
                }`,
              );
            }
          });
      } else {
        // investment_opportunity
        detailsInsertPromise = supabase
          .from("investment_opportunity_details")
          .insert([
            {
              listing_id: listingId,
              year_established: formData.year_founded || null,
              company_stage: mapCompanyStage(formData.company_stage),
              capital_required: formData.capital_required || null,
              equity_offered_percent:
                formData.equity_offered_percentage || null,
              annual_revenue: formData.annual_revenue || null,
              annual_profit: formData.annual_profit || null,
              implied_valuation: formData.implied_valuation || null,
              scalability_reason: formData.scalability_reason || null,
            },
          ])
          .then(({ error }) => {
            if (error) {
              console.error("Investment details insert error:", error);
              throw new Error(
                `Investment details insert failed: ${
                  error.message || JSON.stringify(error)
                }`,
              );
            }
          });
      }

      // Upload documents in parallel
      const docs = Object.entries(formData.documents || {}).filter(
        ([, file]) => file instanceof File,
      ) as [string, File][];

      console.log(
        `Processing ${docs.length} documents for listing ${listingId}`,
      );
      console.log(
        "Documents to upload:",
        docs.map(([key, file]) => ({
          key,
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      );

      // Validate documents
      for (const [key, file] of docs) {
        if (!file.name || file.name === "[id]" || file.name.trim() === "") {
          throw new Error(
            `Document ${key} has invalid filename: "${file.name}". Please ensure files are properly selected.`,
          );
        }
        if (file.size === 0) {
          throw new Error(
            `Document "${file.name}" is empty (0 bytes). Please select a valid file.`,
          );
        }
      }

      const documentsUploadPromise = docs.length
        ? Promise.all(
            docs.map(async ([key, file]) => {
              try {
                console.log(`Uploading ${file.name} (${file.size} bytes)...`);
                const path = toStoragePath(`${authUser.id}/${listingId}`, file);
                const { publicUrl } = await uploadToBucket(
                  DOCUMENT_BUCKET,
                  path,
                  file,
                );
                console.log(
                  `✓ Successfully uploaded ${file.name} to ${publicUrl}`,
                );
                return {
                  listing_id: listingId,
                  uploaded_by: authUser.id,
                  document_type: mapDocumentType(key),
                  file_name: file.name,
                  file_path: publicUrl,
                  file_size: file.size,
                  mime_type: file.type,
                };
              } catch (docError) {
                console.error(`✗ Failed to upload ${file.name}:`, docError);
                throw new Error(
                  `Failed to upload document ${file.name}: ${
                    docError instanceof Error
                      ? docError.message
                      : String(docError)
                  }`,
                );
              }
            }),
          )
            .then(async (uploadedDocs) => {
              console.log(
                `✓ Successfully uploaded ${uploadedDocs.length} documents to storage`,
                uploadedDocs,
              );

              if (uploadedDocs.length === 0) {
                console.warn(
                  "⚠ No documents were uploaded, but documents_certified is true",
                );
                return;
              }

              // Try modern schema first
              const payloadModern = uploadedDocs.map((doc) => ({
                listing_id: doc.listing_id,
                uploaded_by_user_id: doc.uploaded_by,
                document_type: doc.document_type || "other",
                file_name: doc.file_name,
                file_url: doc.file_path,
                file_size_bytes: doc.file_size,
                mime_type: doc.mime_type,
              }));

              console.log(
                "Attempting to insert documents with modern schema...",
                payloadModern,
              );

              const { error: modernError } = await supabase
                .from("listing_documents")
                .insert(payloadModern);

              if (!modernError) {
                console.log(
                  `✓ Successfully inserted ${payloadModern.length} documents to DB (modern schema)`,
                );
                return;
              }

              console.warn(
                "⚠ Document insert error (modern schema):",
                modernError,
              );

              // Fallback to legacy schema
              const payloadLegacy = uploadedDocs.map((doc) => ({
                listing_id: doc.listing_id,
                uploaded_by: doc.uploaded_by,
                document_type: doc.document_type,
                file_name: doc.file_name,
                file_path: doc.file_path,
                file_size: doc.file_size,
                mime_type: doc.mime_type,
              }));

              console.log(
                "Attempting fallback to legacy schema...",
                payloadLegacy,
              );

              const { error: legacyError } = await supabase
                .from("listing_documents")
                .insert(payloadLegacy);

              if (legacyError) {
                console.error(
                  "✗ Document insert error (legacy schema):",
                  legacyError,
                );
                console.error("Modern payload:", payloadModern);
                console.error("Legacy payload:", payloadLegacy);
                throw new Error(
                  `Failed to insert documents to database: ${
                    legacyError.message || JSON.stringify(legacyError)
                  }. Make sure listing_documents table exists and RLS policies are configured.`,
                );
              }

              console.log(
                `✓ Successfully inserted ${payloadLegacy.length} documents to DB (legacy schema)`,
              );
            })
            .catch((docsError) => {
              console.error("✗ Document processing/upload failed:", docsError);
              console.error("Full error details:", docsError);
              throw new Error(
                `Document upload failed: ${
                  docsError instanceof Error
                    ? docsError.message
                    : String(docsError)
                }`,
              );
            })
        : Promise.resolve();

      // Wait for both details insert and documents upload in parallel
      await Promise.all([detailsInsertPromise, documentsUploadPromise]);

      // Email sent automatically via database trigger

      localStorage.removeItem("listing-form");
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } catch (error) {
      console.error("Error creating listing:", error);
      console.error("Error type:", typeof error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      let errorMsg = "Failed to create listing";

      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (error && typeof error === "object") {
        // Handle Supabase error objects
        const err = error as any;
        errorMsg =
          err.message ||
          err.error_description ||
          err.hint ||
          JSON.stringify(error);
      } else if (typeof error === "string") {
        errorMsg = error;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Debounce localStorage writes to reduce I/O operations
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("listing-form", JSON.stringify(formData));
    }, 500); // Wait 500ms after last change before saving

    return () => clearTimeout(timeoutId);
  }, [formData]);

  useEffect(() => {
    const saved = localStorage.getItem("listing-form");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to restore form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  if (!user) return null;

  const nextStep = () => {
    // Validate current step before moving forward
    let errors: any[] = [];

    if (step === 1) {
      errors = validateSellerInfo(formData);
    } else if (step === 2) {
      errors = validateBasicInfo(formData);
    } else if (step === 3) {
      errors = validateFinancials(formData);
    } else if (step === 4) {
      errors = validateStory(formData);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo(0, 0);
      return;
    }

    // Clear errors and proceed
    setValidationErrors([]);
    if (!canContinue()) return;
    setStep((s) => Math.min(s + 1, 6));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setValidationErrors([]);
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo(0, 0);
  };

  return (
    <div className="layout-container flex h-full grow flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-red-700 dark:text-red-400"
                  >
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-lg shadow-subtle border border-[#f0f2f4] p-6">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="uppercase tracking-wider text-[10px] text-gray-500 font-bold mb-1">
                  Listing Setup
                </h1>
                <p className="text-primary font-semibold">In Progress</p>
              </div>

              <div className="flex flex-col gap-2 relative">
                <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10" />

                {[
                  "Seller Info",
                  "Basic Info",
                  "Financials",
                  "The Story",
                  "Media & Docs",
                  "Review",
                ].map((label, index) => {
                  const stepNumber = index + 1;
                  const active = step === stepNumber;
                  const completed = step > stepNumber;

                  return (
                    <div
                      key={label}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                        active
                          ? "bg-primary/5 border-l-4 border-primary"
                          : completed
                            ? ""
                            : "opacity-60"
                      }`}
                    >
                      <div
                        className={`size-8 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-green-100 text-green-600"
                            : active
                              ? "bg-primary text-white"
                              : "border text-gray-400"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {completed ? "check" : "circle"}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex flex-col flex-1 gap-6">
          {step === 1 && (
            <SellerInfo formData={formData} setFormData={setFormData} />
          )}
          {step === 2 && (
            <BasicInfo formData={formData} setFormData={setFormData} />
          )}
          {step === 3 && (
            <Financials formData={formData} setFormData={setFormData} />
          )}
          {step === 4 && (
            <Story formData={formData} setFormData={setFormData} />
          )}
          {step === 5 && (
            <Media formData={formData} setFormData={setFormData} />
          )}
          {step === 6 && (
            <Review
              formData={formData}
              setStep={setStep}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

          {/* ACTIONS */}
          <div className="px-6 md:px-8 py-5 dark:bg-[#151a23] flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="text-[#111318] dark:text-white text-sm font-bold leading-normal px-4 py-2 hover:bg-gray-300 bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            >
              Back
            </button>

            {step < 6 && (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canContinue() || submitting}
                className={`flex min-w-[120px] items-center justify-center rounded h-10 px-6
    text-sm font-bold transition-colors shadow-lg
    ${
      canContinue() && !submitting
        ? "bg-[#0f49bd] hover:bg-[#0c3a96] text-white shadow-primary/30"
        : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
    }
  `}
              >
                Continue
              </button>
            )}
          </div>
        </main>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            <div className="flex flex-col items-center text-center">
              {/* Success Icon with Animation */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
                <div className="relative bg-green-500 rounded-full p-4">
                  <svg
                    className="w-12 h-12 text-white animate-check-draw"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-black text-gray-900 mb-3">
                Submission Successful!
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your listing has been submitted successfully and is now pending
                review. Our professional team will verify your information
                within <strong>48 hours</strong>.
              </p>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full text-left">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      What happens next?
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Document verification by our team</li>
                      <li>• Email notification upon approval</li>
                      <li>• Your listing goes live on the marketplace</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Storage Warning */}
              {storageWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full text-left">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900 mb-1">
                        File Upload Notice
                      </p>
                      <p className="text-xs text-amber-800">
                        Some files couldn't be uploaded. You may need to
                        re-upload documents after your listing is created.
                        Contact support if this persists.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div className="bg-green-500 h-1.5 rounded-full animate-progress" />
              </div>

              <p className="text-xs text-gray-500">
                Redirecting to your profile...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="bg-red-100 rounded-full p-4 mb-6">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h2 className="text-2xl font-black text-gray-900 mb-3">
                Submission Failed
              </h2>
              <p className="text-gray-600 mb-6">
                {errorMessage ||
                  "We couldn't process your submission. Please try again."}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-check-draw {
          animation: check-draw 0.6s ease-out 0.2s backwards;
        }

        .animate-progress {
          animation: progress 3s ease-out;
        }
      `}</style>
    </div>
  );
}
