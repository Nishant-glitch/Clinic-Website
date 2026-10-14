import * as React from "react";

// TODO: In Step 3/6, implement authenticated admin dashboard sidebar, header with active user profile, and role-based navigation guards.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      {children}
    </div>
  );
}
