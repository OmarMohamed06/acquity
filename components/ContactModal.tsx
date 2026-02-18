"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: any;
  listingId?: string;
  listingStatus?: string;
  requiredAuth?: boolean;
}

export interface ContactFormData {
  name: string;
  company: string;
  budgetRange: string;
  reasonForInterest: string;
  contactEmail: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  listing,
  listingId: propListingId,
  listingStatus: propStatus,
  requiredAuth,
}: ContactModalProps) {
  const actualListingId = listing?.id || propListingId;
  const actualListingStatus = listing?.status || propStatus;

  const [userEmail, setUserEmail] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(requiredAuth);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    company: "",
    budgetRange: "",
    reasonForInterest: "",
    contactEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!actualListingId) {
      setSubmitStatus({
        type: "error",
        message: "Listing is missing. Please refresh and try again.",
      });
      return;
    }

    // Note: Status check removed - RLS policy handles it now
    // Allow submission for any listing and let RLS policy decide

    setSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      console.log(
        "ContactModal: Submitting inquiry for listing:",
        actualListingId,
      );
      console.log("ContactModal: Form data:", {
        name: formData.name,
        email: formData.contactEmail,
        company: formData.company,
        budgetRange: formData.budgetRange,
        reasonForInterest: formData.reasonForInterest,
      });

      const { error, data } = await supabase.from("buyer_contact").insert({
        listing_id: actualListingId,
        buyer_name: formData.name,
        buyer_email: formData.contactEmail,
        company: formData.company || null,
        budget_range: formData.budgetRange || null,
        reason_interest: formData.reasonForInterest,
      });

      console.log("ContactModal: Response from Supabase:", { error, data });

      if (error) {
        console.error("ContactModal: Insert error:", {
          message: error.message,
          code: error.code,
          details: (error as any).details,
          hint: (error as any).hint,
        });
        throw error;
      }

      console.log("ContactModal: Inquiry inserted successfully", data);

      // Call Edge Function to send email
      if (listing && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        try {
          const emailUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-inquiry-email`;
          console.log("Attempting to send inquiry email to:", emailUrl);
          const emailRes = await fetch(emailUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              listing_id: actualListingId,
              buyer_name: formData.name,
              buyer_email: formData.contactEmail,
              listing_title: listing.title,
              company: formData.company || null,
              budget_range: formData.budgetRange || null,
              reason_interest: formData.reasonForInterest,
            }),
          });

          if (!emailRes.ok) {
            try {
              const error = await emailRes.json();
              console.warn(
                `Email function returned ${emailRes.status}:`,
                error,
              );
            } catch {
              const text = await emailRes.text();
              console.warn(`Email function returned ${emailRes.status}:`, text);
            }
            // Don't fail UX if email fails
          } else {
            console.log("Inquiry email sent successfully");
          }
        } catch (emailError) {
          console.error("Error calling inquiry email function:", emailError);
          // Don't fail UX if email fails
        }
      }

      setSubmitStatus({
        type: "success",
        message:
          "Your inquiry has been sent successfully! The seller will contact you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        company: "",
        budgetRange: "",
        reasonForInterest: "",
        contactEmail: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus({ type: null, message: "" });
      }, 2000);
    } catch (error: any) {
      console.error("Failed to submit inquiry:", error);
      setSubmitStatus({
        type: "error",
        message:
          error?.message ||
          error?.details ||
          "Failed to send inquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "" : "hidden"
      } fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4`}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Contact Seller</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Company
              </label>
              <input
                type="text"
                name="company"
                placeholder="Your Company Name"
                value={formData.company}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Budget Range *
              </label>
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Budget Range</option>
                <option value="under-100k">Under $100K</option>
                <option value="100k-500k">$100K - $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="above-5m">Above $5M</option>
              </select>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                placeholder="john@example.com"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Reason for Interest */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
              Reason for Interest *
            </label>
            <textarea
              name="reasonForInterest"
              placeholder="Tell us why you're interested..."
              value={formData.reasonForInterest}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 px-4 py-2.5 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg text-sm ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-2.5 rounded border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || submitStatus.type === "success"}
              className="px-6 py-2.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
