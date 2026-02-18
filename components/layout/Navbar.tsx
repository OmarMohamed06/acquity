"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  // Fetch user profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setFullName(data.full_name);
      }
    };

    fetchProfile();
  }, [user]);

  const handleListBusiness = () => {
    if (!user) {
      router.push("/login?next=/list-business");
    } else {
      router.push("/list-business");
    }
    setIsMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U";
    const email = user.email.split("@")[0];
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 md:h-22">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={theme === "dark" ? "/logo-dark.png" : "/logo.svg"}
              alt="Acquity"
              width={220}
              height={66}
              className="h-11 md:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={() => router.push("/")}
            >
              Home
            </button>

            <button
              className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={() => router.push("/businesses-for-sale")}
            >
              Buy Business
            </button>

            <button
              className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={() => router.push("/franchises-for-sale")}
            >
              Franchise
            </button>

            <button
              className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={() => router.push("/investments-for-sale")}
            >
              Seek an Investment
            </button>
          </nav>

          {/* Mobile Menu & Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Sign In & User Avatar */}
            <div className="hidden sm:block">
              {!user ? (
                <button
                  onClick={() => router.push("/login")}
                  className="text-sm font-semibold text-gray-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-4 py-2 transition-colors"
                >
                  Sign In
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  {/* Avatar Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                      {getUserInitials()}
                    </div>
                    <span className="material-symbols-outlined text-gray-600 dark:text-slate-400 text-[20px]">
                      {isDropdownOpen ? "expand_less" : "expand_more"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-5 py-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold border border-white/30">
                            {getUserInitials()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white truncate">
                              {fullName || user.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-blue-100 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            router.push("/profile");
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">
                            person
                          </span>
                          <div className="flex-1 text-left">
                            <p className="font-medium">View Profile</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              Manage your account
                            </p>
                          </div>
                        </button>

                        <button
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            router.push("/settings");
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">
                            settings
                          </span>
                          <div className="flex-1 text-left">
                            <p className="font-medium">Settings</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              Preferences & security
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-200 dark:border-slate-700 py-2">
                        <button
                          onMouseDown={async (e) => {
                            e.stopPropagation();
                            try {
                              console.log("Logging out...");
                              setIsDropdownOpen(false);
                              await logout();
                              console.log("Logout successful, redirecting...");
                              router.push("/");
                            } catch (error) {
                              console.error("Logout error:", error);
                            }
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">
                            logout
                          </span>
                          <div className="flex-1 text-left">
                            <p className="font-medium">Sign Out</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop List Business Button */}
            <button
              onClick={handleListBusiness}
              className="hidden sm:flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 rounded-lg text-white text-sm font-bold h-10 px-4 md:px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            >
              <span className="hidden md:inline">List Your Business</span>
              <span className="md:hidden text-lg">+</span>
            </button>

            {/* Mobile User Menu Button */}
            {user && (
              <div className="relative sm:hidden" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center text-xs font-semibold">
                    {getUserInitials()}
                  </div>
                </button>

                {/* Mobile Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-5 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold border border-white/30">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white truncate">
                            {fullName || user.email?.split("@")[0]}
                          </p>
                          <p className="text-xs text-blue-100 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          router.push("/profile");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">
                          person
                        </span>
                        <div className="flex-1 text-left">
                          <p className="font-medium">View Profile</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            Manage your account
                          </p>
                        </div>
                      </button>

                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          router.push("/settings");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">
                          settings
                        </span>
                        <div className="flex-1 text-left">
                          <p className="font-medium">Settings</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            Preferences & security
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-gray-200 dark:border-slate-700 py-2">
                      <button
                        onMouseDown={async (e) => {
                          e.stopPropagation();
                          try {
                            console.log("Logging out (mobile)...");
                            setIsDropdownOpen(false);
                            await logout();
                            console.log(
                              "Logout successful (mobile), redirecting...",
                            );
                            router.push("/");
                          } catch (error) {
                            console.error("Logout error (mobile):", error);
                          }
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">
                          logout
                        </span>
                        <div className="flex-1 text-left">
                          <p className="font-medium">Sign Out</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Sign In Button */}
            {!user && (
              <button
                onClick={() => router.push("/login")}
                className="sm:hidden p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-semibold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  router.push("/");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Home
              </button>

              <button
                onClick={() => {
                  router.push("/businesses-for-sale");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Buy Business
              </button>

              <button
                onClick={() => {
                  router.push("/franchises-for-sale");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Franchise
              </button>

              <button
                onClick={() => {
                  router.push("/investments-for-sale");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Seek an Investment
              </button>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-2 mt-2">
                <button
                  onClick={handleListBusiness}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 rounded-lg text-white text-sm font-bold py-3 px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    add_circle
                  </span>
                  <span>List Your Business</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
