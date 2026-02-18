import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Real acquisition outcomes from Acquity customers.",
  alternates: { canonical: "/success-stories" },
};

export default function SuccessStoriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
