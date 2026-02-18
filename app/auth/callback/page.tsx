"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error.message);
          router.push("/login");
          return;
        }

        if (session) {
          // Extract user metadata from Google OAuth
          const user = session.user;
          const fullName =
            user.user_metadata?.full_name || user.user_metadata?.name || "";

          // Create or update profile with Google data
          if (user.id) {
            const { error: profileError } = await supabase
              .from("profiles")
              .upsert(
                {
                  id: user.id,
                  full_name: fullName || null,
                  user_intent: "buyer", // Default for OAuth users
                  country: null, // Can be updated later in profile settings
                },
                { onConflict: "id" },
              );

            if (profileError) {
              console.error("Error creating/updating profile:", profileError);
            }
          }

          // Redirect to profile
          router.push("/profile");
        } else {
          // No session, redirect to login
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        router.push("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <svg
            className="absolute inset-0 w-full h-full animate-spin text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p className="text-gray-600 font-semibold">Signing you in…</p>
      </div>
    </div>
  );
}
