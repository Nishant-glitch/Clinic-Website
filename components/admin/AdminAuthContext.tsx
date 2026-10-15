"use client";

import * as React from "react";
import type { Role } from "@/lib/types";

import { useRouter } from "next/navigation";

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: Role;
}

interface AdminAuthContextType {
  user: AdminUser;
  role: Role;
  isAdmin: boolean;
  isStaff: boolean;
  setRole: (role: Role) => void;
  logout: () => void;
}

const DEFAULT_ADMIN: AdminUser = {
  uid: "usr-admin-1",
  name: "Dr. Arvind Sharma",
  email: "admin@ayurvedaclinic.com",
  role: "admin",
};

const AdminAuthContext = React.createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRoleState] = React.useState<Role>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("clinic_admin_mock_role");
        if (saved === "admin" || saved === "staff") {
          return saved;
        }
      } catch {
        // Ignore
      }
    }
    return "admin";
  });

  const setRole = React.useCallback((newRole: Role) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("clinic_admin_mock_role", newRole);
    } catch {
      // Ignore
    }
  }, []);

  const logout = React.useCallback(() => {
    // In dev mode, route to login
    router.push("/admin/login");
  }, [router]);

  const user: AdminUser = React.useMemo(() => {
    if (role === "staff") {
      return {
        uid: "usr-staff-2",
        name: "Pooja Mehta",
        email: "pooja.staff@ayurvedaclinic.com",
        role: "staff",
      };
    }
    return DEFAULT_ADMIN;
  }, [role]);

  const value = React.useMemo(
    () => ({
      user,
      role,
      isAdmin: role === "admin",
      isStaff: role === "staff",
      setRole,
      logout,
    }),
    [user, role, setRole, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}
