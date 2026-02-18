import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cookies Policy",
  alternates: { canonical: "/cookies" },
};

export default function CookiesLayout({ children }: { children: ReactNode }) {
  return children;
}
