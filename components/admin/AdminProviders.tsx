"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminAuthProvider } from "./AdminAuthContext";
import { Toast } from "@/components/ui/Toast";

interface ToastState {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AdminToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AdminToastContext = React.createContext<AdminToastContextType | undefined>(undefined);

export function useAdminToast() {
  const ctx = React.useContext(AdminToastContext);
  if (!ctx) {
    throw new Error("useAdminToast must be used within AdminProviders");
  }
  return ctx;
}

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <AdminToastContext.Provider value={{ showToast }}>
          {children}
          {/* Toast notifications container */}
          <div
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
          >
            {toasts.map((t) => (
              <div key={t.id} className="pointer-events-auto">
                <Toast
                  message={t.message}
                  type={t.type}
                  onClose={() => removeToast(t.id)}
                />
              </div>
            ))}
          </div>
        </AdminToastContext.Provider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
