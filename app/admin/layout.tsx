import * as React from "react";
import type { Metadata } from "next";
import { AdminProviders } from "@/components/admin/AdminProviders";

export const metadata: Metadata = {
  title: "Admin Panel | Clinic Management",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <div className="min-h-screen bg-surface-container-low text-on-surface antialiased font-roboto">
        {children}
      </div>
    </AdminProviders>
  );
}
