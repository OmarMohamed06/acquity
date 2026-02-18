"use client";

import React, { useState } from "react";
import { ListingFormData } from "../types";
import { Upload } from "lucide-react";

type Props = {
  formData: ListingFormData;
  setFormData: React.Dispatch<React.SetStateAction<ListingFormData>>;
};

export default function Documents({ formData, setFormData }: Props) {
  const type = formData.listing_type;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certificationChecked, setCertificationChecked] = useState(
    formData.documents_certified ?? false,
  );

  const setDoc = (
    key: keyof NonNullable<ListingFormData["documents"]>,
    file: File,
  ) => {
    setFormData((d) => ({
      ...d,
      documents: {
        ...(d.documents ?? {}),
        [key]: file,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((d) => ({
        ...d,
        listing_image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="flex justify-center bg-gray-50 min-h-screen py-8">
      <div className="w-full max-w-2xl h-auto">
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-1">Media & Documentation</h3>
            <p className="text-sm text-gray-600">
              Upload a high-quality image for your listing and verification
              documents to maintain marketplace integrity.
            </p>
          </div>

          {/* Listing Image Upload */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Listing Image
            </h4>
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition-colors">
                        Change Image
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <label className="block p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <svg
                        className="w-12 h-12 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-600">
                        JPG, PNG, WebP • Max 5MB
                      </p>
                    </div>
                  </div>
                </label>
              )}
            </div>
            {formData.listing_image && (
              <p className="text-xs text-green-600 font-medium mt-2">
                ✓ {formData.listing_image.name}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">
                Secure Document Handling
              </h4>
              <p className="text-xs text-gray-600">
                Your data is encrypted end-to-end. Only certified verification
                officers can access these files.
              </p>
            </div>
            <a
              href="#"
              className="text-xs text-blue-600 font-semibold whitespace-nowrap hover:underline"
            >
              Privacy Standards →
            </a>
          </div>

          {/* Document Upload Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* BUSINESS SALE */}
            {type === "business_sale" && (
              <>
                <FileCard
                  title="Company Registration"
                  description="Certificate of registration (CR) or Trade License"
                  acceptedFormats={["PDF", "JPG", "MAX 5MB"]}
                  onChange={(f) => setDoc("company_registration_doc", f)}
                />
                <FileCard
                  title="Financial Statement"
                  description="Audited Income & Balance P&L for last 3 years"
                  acceptedFormats={["PDF", "XLSX", "MAX 5MB"]}
                  onChange={(f) => setDoc("financial_statement_doc", f)}
                />
                <FileCard
                  title="Owner Identity"
                  description="Passport or National Identification Document"
                  acceptedFormats={["PDF", "JPG", "PNG"]}
                  onChange={(f) => setDoc("owner_identity_doc", f)}
                />
              </>
            )}

            {/* FRANCHISE */}
            {type === "franchise_sale" && (
              <>
                <FileCard
                  title="Franchise Registration"
                  description="Franchise registration document"
                  acceptedFormats={["PDF", "JPG", "MAX 5MB"]}
                  onChange={(f) => setDoc("franchise_registration_doc", f)}
                />
                <FileCard
                  title="Unit Financial Sample"
                  description="Unit financial sample document"
                  acceptedFormats={["PDF", "XLSX", "MAX 5MB"]}
                  onChange={(f) => setDoc("unit_financial_sample_doc", f)}
                />
                <FileCard
                  title="Legal Right to Franchise"
                  description="Legal right to franchise document"
                  acceptedFormats={["PDF", "JPG", "PNG"]}
                  onChange={(f) => setDoc("legal_right_to_franchise_doc", f)}
                />
              </>
            )}

            {/* INVESTMENT */}
            {type === "investment_opportunity" && (
              <>
                <FileCard
                  title="Company Registration"
                  description="Certificate of registration (CR) or Trade License"
                  acceptedFormats={["PDF", "JPG", "MAX 5MB"]}
                  onChange={(f) => setDoc("company_registration_doc", f)}
                />
                <FileCard
                  title="Financial Summary"
                  description="Financial summary document"
                  acceptedFormats={["PDF", "XLSX", "MAX 5MB"]}
                  onChange={(f) => setDoc("financial_summary_doc", f)}
                />
                <FileCard
                  title="Founder Identity"
                  description="Passport or National Identification Document"
                  acceptedFormats={["PDF", "JPG", "PNG"]}
                  onChange={(f) => setDoc("founder_identity_doc", f)}
                />
              </>
            )}
          </div>

          {/* Verification Checkboxes */}
          <div className="space-y-3 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={certificationChecked}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setCertificationChecked(isChecked);
                  setFormData((d) => ({
                    ...d,
                    documents_certified: isChecked,
                  }));
                }}
                required
              />
              <span className="text-sm text-gray-700">
                I certify that the documents uploaded are authentic and
                represent the current legal state of the business entity.
              </span>
            </label>
          </div>
        </section>
      </div>
    </section>
  );
}

/* ---------- Helper ---------- */

function FileCard({
  title,
  description,
  acceptedFormats,
  onChange,
}: {
  title: string;
  description: string;
  acceptedFormats: string[];
  onChange: (file: File) => void;
}) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onChange(file);
    }
  };

  return (
    <div
      className={`border-2 rounded-lg p-6 transition-colors ${
        selectedFile
          ? "border-green-300 bg-green-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div
          className={`rounded-lg p-3 ${
            selectedFile ? "bg-green-100" : "bg-blue-50"
          }`}
        >
          {selectedFile ? (
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <Upload
              className={`w-8 h-8 ${
                selectedFile ? "text-green-600" : "text-blue-600"
              }`}
            />
          )}
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center mb-4">
        <h4
          className={`text-sm font-bold mb-1 ${
            selectedFile ? "text-green-600" : "text-blue-600"
          }`}
        >
          {selectedFile ? "✓ UPLOADED" : "DRAG & DROP"}
        </h4>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        {selectedFile ? (
          <p className="text-xs text-green-600 font-medium mb-3">
            {selectedFile.name}
          </p>
        ) : (
          <p className="text-xs text-gray-600 mb-3">{description}</p>
        )}
      </div>

      {/* Accepted Formats */}
      <div className="flex justify-center gap-2 mb-4">
        {acceptedFormats.map((format) => (
          <span
            key={format}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {format}
          </span>
        ))}
      </div>

      {/* Upload Button */}
      <label className="block">
        <input type="file" className="hidden" onChange={handleFileChange} />
        <div
          className={`w-full font-semibold py-2 px-4 rounded-md text-center cursor-pointer transition-colors text-sm ${
            selectedFile
              ? "bg-green-100 border-2 border-green-300 text-green-700 hover:bg-green-200"
              : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {selectedFile ? "✓ File Selected" : "Select File"}
        </div>
      </label>
    </div>
  );
}
