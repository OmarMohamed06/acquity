"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  // Fetch notification preferences
  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_notifications, marketing_emails")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setEmailNotifications(data.email_notifications ?? true);
        setMarketingEmails(data.marketing_emails ?? false);
      }
      setLoadingPreferences(false);
    };

    fetchPreferences();
  }, [user]);

  // Update email notifications
  const toggleEmailNotifications = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);

    const { error } = await supabase
      .from("profiles")
      .update({ email_notifications: newValue })
      .eq("id", user!.id);

    if (error) {
      console.error("Error updating email notifications:", error);
      // Revert on error
      setEmailNotifications(!newValue);
    }
  };

  // Update marketing emails
  const toggleMarketingEmails = async () => {
    const newValue = !marketingEmails;
    setMarketingEmails(newValue);

    const { error } = await supabase
      .from("profiles")
      .update({ marketing_emails: newValue })
      .eq("id", user!.id);

    if (error) {
      console.error("Error updating marketing emails:", error);
      // Revert on error
      setMarketingEmails(!newValue);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?next=/settings");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8 min-h-screen">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-black tracking-tight">
            Account Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold">Appearance</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Customize how Acquity looks on your device
              </p>
            </div>

            <div className="p-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-slate-700 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {theme === "dark" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {theme === "dark"
                        ? "Dark mode is enabled"
                        : "Light mode is enabled"}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                    theme === "dark" ? "bg-blue-600" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={theme === "dark"}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold">Profile</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Manage your profile information
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Email Address
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {user.email}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold">Notifications</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Control how you receive updates
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Receive updates about your listings
                  </p>
                </div>
                <button
                  onClick={toggleEmailNotifications}
                  disabled={loadingPreferences}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                    emailNotifications
                      ? "bg-blue-600"
                      : "bg-slate-300 dark:bg-slate-600"
                  } ${loadingPreferences ? "opacity-50 cursor-not-allowed" : ""}`}
                  role="switch"
                  aria-checked={emailNotifications}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Marketing Emails
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Receive tips and promotional content
                  </p>
                </div>
                <button
                  onClick={toggleMarketingEmails}
                  disabled={loadingPreferences}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                    marketingEmails
                      ? "bg-blue-600"
                      : "bg-slate-300 dark:bg-slate-600"
                  } ${loadingPreferences ? "opacity-50 cursor-not-allowed" : ""}`}
                  role="switch"
                  aria-checked={marketingEmails}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      marketingEmails ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
              <h2 className="text-lg font-bold text-red-900 dark:text-red-400">
                Danger Zone
              </h2>
              <p className="text-sm text-red-700 dark:text-red-400/80 mt-0.5">
                Irreversible actions for your account
              </p>
            </div>

            <div className="p-6">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                Delete Account
              </button>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
