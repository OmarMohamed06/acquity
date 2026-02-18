"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const trimmedEmail = email.trim().toLowerCase();

    const checkResponse = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmedEmail }),
    });

    if (!checkResponse.ok) {
      const payload = await checkResponse.json().catch(() => null);
      setError(payload?.message || "Failed to verify email.");
      setLoading(false);
      return;
    }

    const checkPayload = await checkResponse.json().catch(() => null);
    if (!checkPayload?.exists) {
      setError("This email is not registered.");
      setLoading(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmedEmail,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 w-full min-h-screen bg-texture">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#1a202c] shadow-2xl border border-[#e5e7eb] dark:border-[#2d3748] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#111318] dark:text-white">
            Forgot your password?
          </h1>
          <p className="text-[#616f89] dark:text-gray-400 text-sm">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {success ? (
          <p className="text-green-600 text-sm text-center">
            Check your email for a password reset link.
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111318] dark:text-gray-200">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-3.5 px-4 ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 focus:ring-primary dark:bg-[#2d3748]"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-primary text-white py-4 font-semibold hover:bg-primary-dark transition uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
