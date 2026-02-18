"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import GoogleSignInButton from "@/components/GoogleSignInButton";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/profile";

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // User is already logged in, redirect to profile
          setShouldRedirect(true);
          router.replace("/profile");
          return;
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsAuthenticating(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous error
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (signInError) {
        // Provide user-friendly error messages
        let errorMsg = signInError.message;

        if (errorMsg.includes("Invalid login credentials")) {
          errorMsg = "Invalid email or password. Please try again.";
        } else if (errorMsg.includes("Email not confirmed")) {
          errorMsg = "Please confirm your email address before logging in.";
        }

        setError(errorMsg);
        console.error("Login error:", signInError);
      } else {
        console.log("Login successful:", data);
        // Redirect to next page or profile
        router.push(next);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Login exception:", err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while checking authentication or redirecting
  if (isAuthenticating || shouldRedirect) {
    return <div className="fixed inset-0 bg-white dark:bg-[#0a0f1a] z-50" />;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 w-full min-h-screen bg-texture">
      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-white dark:bg-[#1a202c] shadow-2xl border border-[#e5e7eb] dark:border-[#2d3748] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="space-y-2 text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-[#111318] dark:text-white">
            Investor Access
          </h1>
          <p className="text-[#616f89] dark:text-gray-400 text-sm">
            Access premium investment opportunities Worldwide.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Google Sign In */}
        <div className="mb-6">
          <GoogleSignInButton />
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-[#1a202c] text-gray-500 dark:text-gray-400">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111318] dark:text-gray-200">
              Work Email
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="block w-full py-3.5 px-4 ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 focus:ring-primary dark:bg-[#2d3748]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#111318] dark:text-gray-200">
              Password
            </label>

            <div className="flex ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 focus-within:ring-primary dark:bg-[#2d3748]">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="flex-1 bg-transparent py-3.5 px-4 focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-gray-400"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 font-semibold hover:bg-primary-dark transition uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer CTA */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-[#616f89] dark:text-gray-400">
            Don&apos;t have an account?
            <Link
              href="/signup"
              className="ml-1 text-primary font-semibold hover:underline"
            >
              Sign up for access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
