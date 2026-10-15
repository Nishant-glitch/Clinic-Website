"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { StatusChip } from "@/components/admin/StatusChip";
import { getDashboardStats } from "@/lib/admin/data";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Sparkles,
  Image as GalleryIcon,
  MessageCircleQuestion,
  Star,
  Settings,
  Users,
  LogOut,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badgeCount?: number;
}

function AdminPanelLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, setRole, isAdmin, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [globalSearch, setGlobalSearch] = React.useState("");

  // Fetch counts for badges
  const { data: stats } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: getDashboardStats,
    refetchInterval: 15000,
  });

  const navItems: NavItem[] = React.useMemo(() => {
    return [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Appointments",
        href: "/admin/appointments",
        icon: CalendarCheck,
        badgeCount: stats?.pendingCallbacks || 0,
      },
      {
        name: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
        badgeCount: stats?.unreadMessages || 0,
      },
      {
        name: "Services",
        href: "/admin/services",
        icon: Sparkles,
        adminOnly: true,
      },
      {
        name: "Gallery",
        href: "/admin/gallery",
        icon: GalleryIcon,
        adminOnly: true,
      },
      {
        name: "Testimonials",
        href: "/admin/testimonials",
        icon: Star,
        adminOnly: true,
      },
      {
        name: "FAQs",
        href: "/admin/faqs",
        icon: MessageCircleQuestion,
        adminOnly: true,
      },
      {
        name: "Clinic Settings",
        href: "/admin/settings",
        icon: Settings,
        adminOnly: true,
      },
      {
        name: "Users & Staff",
        href: "/admin/users",
        icon: Users,
        adminOnly: true,
      },
    ];
  }, [stats]);

  // Filter out admin-only items if role is staff
  const visibleNavItems = React.useMemo(() => {
    if (isAdmin) return navItems;
    return navItems.filter((item) => !item.adminOnly);
  }, [navItems, isAdmin]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      router.push(`/admin/appointments?search=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch("");
    }
  };

  // Close mobile drawer on route change
  const [prevPath, setPrevPath] = React.useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-surface-container-low text-on-surface">
      {/* ======================================================== */}
      {/* 1. DESKTOP NAVIGATION RAIL / DRAWER (md:flex)           */}
      {/* ======================================================== */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 left-0 z-30 bg-surface border-r border-outline-variant/60">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/40">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 font-bold tracking-tight text-on-surface group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="block text-sm font-bold truncate leading-tight">
                {siteConfig.name}
              </span>
              <span className="block text-[10px] uppercase font-semibold text-primary tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            title="View public clinic website"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            Operations
          </div>
          {visibleNavItems.slice(0, 3).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 select-none",
                  isActive
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-2xs"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-on-surface-variant")} />
                  <span>{item.name}</span>
                </div>
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-bold leading-tight",
                      isActive
                        ? "bg-primary text-on-primary"
                        : "bg-primary-container text-on-primary-container"
                    )}
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                Content & Management
              </div>
              {visibleNavItems.slice(3).map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 select-none",
                      isActive
                        ? "bg-primary-container text-on-primary-container font-semibold shadow-2xs"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-on-surface-variant")} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User Card & Dev Switcher Footer */}
        <div className="border-t border-outline-variant/50 p-3 bg-surface-container-low/70 space-y-2">
          {/* Dev Role Switcher */}
          <div className="rounded-xl bg-surface border border-outline-variant/60 p-2 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-on-surface-variant text-[11px] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-600" />
                Dev Role Switcher
              </span>
              <StatusChip status={role} size="sm" />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold transition-colors text-center cursor-pointer",
                  role === "admin"
                    ? "bg-primary text-on-primary shadow-2xs"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("staff")}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-semibold transition-colors text-center cursor-pointer",
                  role === "staff"
                    ? "bg-secondary text-on-secondary shadow-2xs"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                Staff
              </button>
            </div>
          </div>

          {/* Current User Info & Logout */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="truncate">
              <p className="text-xs font-bold text-on-surface truncate">{user.name}</p>
              <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-full text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA & TOP BAR                           */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col md:pl-64 lg:pl-72 pb-20 md:pb-6 min-w-0">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full text-on-surface hover:bg-surface-variant/60"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Quick search input in Top Bar */}
            <form onSubmit={handleGlobalSearch} className="hidden sm:flex items-center relative w-64 lg:w-80">
              <Search className="absolute left-3 h-4 w-4 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search appointments (name/phone)..."
                className="w-full rounded-full bg-surface-container-high border border-transparent pl-9 pr-4 py-1.5 text-xs lg:text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:bg-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
          </div>

          {/* User profile & actions in Top Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-on-surface">{user.name}</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{role}</span>
            </div>
            <StatusChip status={role} size="sm" />
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-2 rounded-full text-on-surface-variant hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE BOTTOM NAVIGATION (< 768px)                    */}
      {/* ======================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 px-2 py-1.5 flex items-center justify-around"
      >
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors",
            pathname === "/admin/dashboard" ? "text-primary font-bold" : "text-on-surface-variant"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          href="/admin/appointments"
          className={cn(
            "relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors",
            pathname.startsWith("/admin/appointments") ? "text-primary font-bold" : "text-on-surface-variant"
          )}
        >
          <CalendarCheck className="h-5 w-5" />
          <span className="text-[10px]">Appointments</span>
          {stats?.pendingCallbacks && stats.pendingCallbacks > 0 ? (
            <span className="absolute top-0 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary px-1">
              {stats.pendingCallbacks}
            </span>
          ) : null}
        </Link>

        <Link
          href="/admin/messages"
          className={cn(
            "relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors",
            pathname.startsWith("/admin/messages") ? "text-primary font-bold" : "text-on-surface-variant"
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px]">Messages</span>
          {stats?.unreadMessages && stats.unreadMessages > 0 ? (
            <span className="absolute top-0 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary px-1">
              {stats.unreadMessages}
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-colors",
            mobileMenuOpen ? "text-primary font-bold" : "text-on-surface-variant"
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>

      {/* ======================================================== */}
      {/* 4. MOBILE DRAWER SHEET (FULL MENU)                       */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 rounded-t-[28px] bg-surface border-t border-outline-variant p-6 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-bold text-base text-on-surface">{siteConfig.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dev role switcher inside mobile drawer */}
            <div className="rounded-2xl bg-surface-container p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  Dev Role Switcher
                </span>
                <StatusChip status={role} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={cn(
                    "rounded-xl py-1.5 text-xs font-semibold cursor-pointer",
                    role === "admin" ? "bg-primary text-on-primary" : "bg-surface text-on-surface"
                  )}
                >
                  Admin Mode
                </button>
                <button
                  type="button"
                  onClick={() => setRole("staff")}
                  className={cn(
                    "rounded-xl py-1.5 text-xs font-semibold cursor-pointer",
                    role === "staff" ? "bg-secondary text-on-secondary" : "bg-surface text-on-surface"
                  )}
                >
                  Staff Mode
                </button>
              </div>
            </div>

            {/* All Visible Nav Links */}
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-3 mb-1">
                Navigation
              </p>
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface hover:bg-surface-container"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-on-surface-variant/60" />
                  </Link>
                );
              })}
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-50 text-rose-700 p-3 text-sm font-semibold hover:bg-rose-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-surface-container-low" />}>
      <AdminPanelLayoutInner>{children}</AdminPanelLayoutInner>
    </React.Suspense>
  );
}

