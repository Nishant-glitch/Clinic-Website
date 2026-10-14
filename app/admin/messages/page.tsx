import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Clinic Admin",
  robots: "noindex, nofollow",
};

// TODO: In Step 3/4, build patient contact inquiries inbox with read/unread flags and direct email/phone callback links.
export default function AdminMessagesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-on-surface">Patient Inquiries & Messages</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Review messages submitted via the public contact form.
      </p>
    </div>
  );
}
