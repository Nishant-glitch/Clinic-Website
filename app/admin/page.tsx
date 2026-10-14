import { redirect } from "next/navigation";

// TODO: In Step 6 (Auth & permissions), check user session and redirect to /admin/dashboard or /admin/login.
export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
