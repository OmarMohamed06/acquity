import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "List a Business",
  robots: { index: false, follow: true },
};

export default function ListBusinessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
