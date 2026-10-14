import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointments | Clinic Admin",
  robots: "noindex, nofollow",
};

// TODO: In Step 3/4, build appointment request list, filter by status (new -> called -> confirmed -> visited / cancelled), quick call trigger, and notes editor.
export default function AdminAppointmentsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-on-surface">Appointment Requests</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Review patient requests, execute callback workflow, and update appointment states.
      </p>
    </div>
  );
}
