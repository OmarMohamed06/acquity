import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: true },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
