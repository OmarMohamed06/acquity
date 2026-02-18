import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: true },
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
