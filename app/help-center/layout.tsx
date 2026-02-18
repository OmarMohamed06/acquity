import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers and guidance for using Acquity.",
  alternates: { canonical: "/help-center" },
};

export default function HelpCenterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
