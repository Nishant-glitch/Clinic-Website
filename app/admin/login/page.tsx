import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Clinic Management",
  robots: "noindex, nofollow",
};

// TODO: In Step 6 (Auth & permissions), implement Firebase Auth email/password sign-in and session cookie exchange.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-md border border-outline-variant/40">
        <h1 className="text-2xl font-bold text-center text-primary">Clinic Portal Login</h1>
        <p className="mt-2 text-center text-xs text-on-surface-variant">
          Authorized staff & administrator access only
        </p>
      </div>
    </div>
  );
}
