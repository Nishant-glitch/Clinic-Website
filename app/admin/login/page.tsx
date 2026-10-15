"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/config/site";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setRole } = useAdminAuth();

  const [email, setEmail] = React.useState("admin@ayurvedaclinic.com");
  const [password, setPassword] = React.useState("Admin@123");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    // Simulate auth latency
    await new Promise((r) => setTimeout(r, 600));

    if (email.includes("staff")) {
      setRole("staff");
    } else {
      setRole("admin");
    }

    setIsLoading(false);
    router.push("/admin/dashboard");
  };

  const handleQuickFill = (role: "admin" | "staff") => {
    if (role === "admin") {
      setEmail("admin@ayurvedaclinic.com");
      setPassword("Admin@123");
      setRole("admin");
    } else {
      setEmail("pooja.staff@ayurvedaclinic.com");
      setPassword("Staff@123");
      setRole("staff");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface-container-low">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="rounded-3xl bg-surface border border-outline-variant/60 p-8 shadow-xl">
          {/* Clinic Brand */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-md">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              {siteConfig.name}
            </h1>
            <p className="text-xs uppercase tracking-wider font-medium text-on-surface-variant">
              Staff & Administration Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800"
              >
                {errorMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ayurvedaclinic.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert("Please contact your system administrator to reset credentials.")
                  }
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant pointer-events-none" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="filled"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Dev Quick Fill Switcher */}
          <div className="mt-8 pt-6 border-t border-outline-variant/40 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Dev Preview Quick-Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors text-left"
              >
                <p className="font-bold text-primary">Dr. Arvind</p>
                <p className="text-[10px] text-on-surface-variant">Admin (All tabs)</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("staff")}
                className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-xs font-medium text-on-surface hover:bg-surface-container transition-colors text-left"
              >
                <p className="font-bold text-secondary">Pooja Mehta</p>
                <p className="text-[10px] text-on-surface-variant">Staff (Appointments)</p>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-on-surface-variant/70">
          Encrypted connection. Protected under India DPDP Act 2023.
        </p>
      </div>
    </div>
  );
}
