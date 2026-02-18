"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      router.push("/login?reset=success");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 w-full min-h-screen bg-texture">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#1a202c] shadow-2xl border border-[#e5e7eb] dark:border-[#2d3748] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#111318] dark:text-white">
            Reset password
          </h1>
          <p className="text-[#616f89] dark:text-gray-400 text-sm">
            Create a new password for your account.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111318] dark:text-gray-200">
              New password
            </label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full py-3.5 px-4 ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 focus:ring-primary dark:bg-[#2d3748]"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 font-semibold hover:bg-primary-dark transition uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
