import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Clinic Admin",
  robots: "noindex, nofollow",
};

// TODO: In Step 3/4, build metrics summary cards (today's appointment requests, pending callbacks, new messages, quick actions).
export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-on-surface">Clinic Overview & Dashboard</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Monitor appointment requests, inquiries, and clinic operations.
      </p>
    </div>
  );
}
