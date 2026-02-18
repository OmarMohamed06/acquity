"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";

export default function Footer() {
  const successStoriesEnabled = false;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setStatus({ type: "loading", message: "Subscribing..." });
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, source: "footer" }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            payload?.message || "Unable to subscribe right now. Try again.",
        });
        return;
      }

      setEmail("");
      setStatus({
        type: "success",
        message: payload?.message || "Thanks for subscribing!",
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      setStatus({
        type: "error",
        message: "Unable to subscribe right now. Try again.",
      });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.svg"
                alt="Acquity"
                width={180}
                height={54}
                className="h-9 w-auto"
              />
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The premier marketplace for buying and selling businesses in
              emerging markets. Connecting visionaries with opportunity.
            </p>

            <div className="flex gap-4">
              <a
                href="mailto:support@acquity.co"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">mail</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/businesses-for-sale"
                  className="hover:text-primary"
                >
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link href="/list-business" className="hover:text-primary">
                  Sell a Business
                </Link>
              </li>
              <li>
                <Link
                  href="/franchises-for-sale"
                  className="hover:text-primary"
                >
                  Find a Franchise
                </Link>
              </li>
              <li>
                <Link
                  href="/investments-for-sale"
                  className="hover:text-primary"
                >
                  Seek Investment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/resources" className="hover:text-primary">
                  Acquisition Guides
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="hover:text-primary">
                  Help Center & FAQs
                </Link>
              </li>
              {successStoriesEnabled && (
                <li>
                  <Link href="/success-stories" className="hover:text-primary">
                    Success Stories
                  </Link>
                </li>
              )}
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Subscribe</h4>
            <p className="text-sm text-gray-500 mb-4">
              Get the latest investment opportunities delivered to your inbox.
            </p>
            <form className="space-y-2" onSubmit={handleSubscribe}>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  aria-label="Email address"
                  disabled={status.type === "loading"}
                  required
                />
                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="h-10 px-4 bg-primary text-white rounded-sm hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="Subscribe"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </div>
              {status.type !== "idle" && (
                <p
                  className={`text-xs ${
                    status.type === "success"
                      ? "text-green-600"
                      : status.type === "error"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                  role={status.type === "error" ? "alert" : "status"}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 Acquity. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-600">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-gray-600">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
