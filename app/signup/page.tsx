"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { COUNTRIES } from "@/app/constants/options";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    password: "",
    terms: false,
  });

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // User is already logged in, redirect to home
          setShouldRedirect(true);
          router.replace("/");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (!formData.country) {
      setError("Please select your country");
      return;
    }

    if (!formData.terms) {
      setError("You must agree to the terms");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            country: formData.country,
            role: role,
          },
        },
      });

      if (signUpError) {
        // Provide more helpful error messages
        let errorMsg = signUpError.message;

        if (errorMsg.includes("invalid") && errorMsg.includes("email")) {
          errorMsg =
            "Unable to sign up. Please check your Supabase email settings or contact support.";
        } else if (errorMsg.includes("already registered")) {
          errorMsg =
            "This email is already registered. Please try logging in instead.";
        }

        setError(errorMsg);
        console.error("Signup error:", signUpError);
      } else if (data.user) {
        // Wait a moment for auth to complete
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create or update profile record in profiles table
        console.log("Creating/updating profile with data:", {
          id: data.user.id,
          full_name: formData.fullName,
          user_intent: role,
          country: formData.country,
        });

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              full_name: formData.fullName || null,
              user_intent: role, // 'buyer' or 'seller'
              country: formData.country || null,
            },
            { onConflict: "id", ignoreDuplicates: false },
          )
          .select();

        if (profileError) {
          console.error("Error creating/updating profile:", profileError);
          // Try a direct update as fallback
          const { data: updateData, error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: formData.fullName || null,
              user_intent: role,
              country: formData.country || null,
            })
            .eq("id", data.user.id)
            .select();

          if (updateError) {
            console.error("Error updating profile:", updateError);
            setError(
              `Account created but profile setup failed: ${updateError.message}. Please update your profile from the profile page.`,
            );
          } else {
            console.log(
              "Profile updated successfully via fallback:",
              updateData,
            );
          }
        } else {
          console.log("Profile created/updated successfully:", profileData);
        }

        // Check if email confirmation is required
        if (!data.user.confirmed_at) {
          setSuccess(
            "Signup successful! Please check your email to confirm your account.",
          );
        } else {
          setSuccess("Signup successful! Redirecting to home...");
          // Redirect to home after a short delay
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }

        console.log("Signup successful:", data);

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          country: "",
          password: "",
          terms: false,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Signup exception:", err);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while checking authentication or redirecting
  if (isAuthenticating || shouldRedirect) {
    return <div className="fixed inset-0 bg-white dark:bg-[#0a0f1a] z-50" />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Visual / Value Prop */}
        <div
          className="hidden lg:flex w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAa8a-gW20bxSdt0w0cDTcj42p6W-A7mp3On78OUxfEbREy2UxJRCCIFwH5dmtgGnl3pjGPcKoFjwtvMipGhR2vU3Z-p-XqCXeK6mU7AbdWj5G9YoYcuv12YS98QQ5mt8c5yPU-uHhkZ5eId2abL58r_VlmHEKK0j62nQopJlBNot5PuqhO5VNI6oBRt2HeVVtSxmcO4itAvbA_4TOeqSd8tOvcwPEWQXA1MkpYBhsvdu6rTkQrhOEu_ARFtd0DkgBKoJ7AuN2j2Q")`,
          }}
        >
          <div className="absolute inset-0 bg-primary/90"></div>
          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 text-white h-full">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-xs font-medium tracking-wide mb-6">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                SECURE MARKETPLACE
              </span>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
                Access Exclusive Investment Opportunities
              </h1>
              <p className="text-lg text-blue-100/90 leading-relaxed max-w-lg">
                Join the premier marketplace for M&A across the world. Connect
                with verified buyers, sellers, and brokers in a confidential &
                secure environment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-8 mt-4"></div>
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white dark:bg-background-dark">
          <div className="w-full max-w-[480px]">
            {/* Header Mobile Only */}
            <div className="lg:hidden mb-8">
              <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-text-sub dark:text-gray-400">
                Join the premier marketplace for global M&A.
              </p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-10">
              <h2 className="text-2xl font-bold text-text-main dark:text-white">
                Create Secure Account
              </h2>
              <p className="text-text-sub dark:text-gray-400 text-sm mt-1">
                Enter your details to access the platform.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-800 dark:text-green-200">
                {success}
              </div>
            )}

            {/* Role Selector */}
            <div className="mb-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-sub dark:text-gray-400 mb-3">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer group">
                  <input
                    checked={role === "buyer"}
                    className="peer sr-only"
                    name="role"
                    type="radio"
                    value="buyer"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="flex flex-col items-center justify-center p-4 border border-border-color dark:border-gray-700 rounded-lg bg-background-light dark:bg-gray-800 peer-checked:bg-primary/5 peer-checked:border-primary transition-all duration-200 h-full">
                    <svg
                      className="w-6 h-6 mb-2 text-text-sub group-hover:text-primary peer-checked:text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-text-main dark:text-white peer-checked:text-primary">
                      Buy / Invest
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 hidden peer-checked:block text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                </label>

                <label className="relative cursor-pointer group">
                  <input
                    checked={role === "seller"}
                    className="peer sr-only"
                    name="role"
                    type="radio"
                    value="seller"
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div className="flex flex-col items-center justify-center p-4 border border-border-color dark:border-gray-700 rounded-lg bg-background-light dark:bg-gray-800 peer-checked:bg-primary/5 peer-checked:border-primary transition-all duration-200 h-full">
                    <svg
                      className="w-6 h-6 mb-2 text-text-sub group-hover:text-primary peer-checked:text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-text-main dark:text-white peer-checked:text-primary">
                      Sell / Broker
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 hidden peer-checked:block text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="mb-6">
              <GoogleSignInButton />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-color dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-background-dark text-text-sub dark:text-gray-400 uppercase font-semibold tracking-wide">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label
                  className="block text-sm font-medium text-text-main dark:text-white mb-1.5"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-white dark:bg-[#1a2230] border border-border-color dark:border-gray-700 rounded text-text-main dark:text-white text-base placeholder:text-text-sub/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                  id="fullname"
                  placeholder="Enter your full legal name"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-text-main dark:text-white mb-1.5"
                  htmlFor="email"
                >
                  Professional Email
                </label>
                <input
                  className="w-full px-4 py-3 bg-white dark:bg-[#1a2230] border border-border-color dark:border-gray-700 rounded text-text-main dark:text-white text-base placeholder:text-text-sub/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <p className="mt-1 text-xs text-text-sub dark:text-gray-500">
                  Please use your work email for faster verification.
                </p>
              </div>

              {/* Country */}
              <div>
                <label
                  className="block text-sm font-medium text-text-main dark:text-white mb-1.5"
                  htmlFor="country"
                >
                  Country
                </label>
                <select
                  className="w-full px-4 py-3 bg-white dark:bg-[#1a2230] border border-border-color dark:border-gray-700 rounded text-text-main dark:text-white text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium text-text-main dark:text-white mb-1.5"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-white dark:bg-[#1a2230] border border-border-color dark:border-gray-700 rounded text-text-main dark:text-white text-base placeholder:text-text-sub/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow pr-10"
                    id="password"
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sub hover:text-text-main dark:hover:text-white transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.checked })
                      }
                    />
                    <div className="w-5 h-5 border-2 border-border-color dark:border-gray-600 rounded bg-white dark:bg-[#1a2230] peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <svg
                      className="w-3 h-3 absolute text-white opacity-0 peer-checked:opacity-100 top-0.5 left-0.5 pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-sub dark:text-gray-400 select-none">
                    I agree to the{" "}
                    <a
                      className="text-primary hover:underline font-medium"
                      href="/terms"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-primary hover:underline font-medium"
                      href="/privacy"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              {/* CTA Button */}
              <button
                className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-bold h-12 rounded shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-text-sub dark:text-gray-400 mt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Log in
                </a>
              </p>
            </form>

            {/* Footer Trust */}
            <div className="mt-8 pt-6 border-t border-border-color dark:border-gray-800 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-text-sub"
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
                <p className="text-xs font-semibold text-text-sub uppercase tracking-wide">
                  Bank-Grade Security
                </p>
              </div>
              <p className="text-xs text-text-sub/80">
                Your data is encrypted and secure. We never share your info
                without permission.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
