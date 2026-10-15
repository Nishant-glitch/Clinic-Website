import * as React from "react";
import { cn } from "@/lib/utils";
import type { AppointmentStatus, Role } from "@/lib/types";
import {
  Clock,
  PhoneCall,
  CheckCircle2,
  UserCheck,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  UserX,
} from "lucide-react";

export type StatusType = AppointmentStatus | Role | "active" | "disabled";

interface StatusChipProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md";
}

export function StatusChip({ status, className, size = "md" }: StatusChipProps) {
  let label = status as string;
  let colorClasses = "bg-surface-container text-on-surface-variant border-outline-variant";
  let IconComponent: React.ComponentType<{ className?: string }> = Clock;

  switch (status) {
    case "new":
      label = "New Request";
      colorClasses = "bg-primary-container text-on-primary-container border-primary/20";
      IconComponent = Clock;
      break;
    case "called":
      label = "Called";
      colorClasses = "bg-secondary-container text-on-secondary-container border-secondary/20";
      IconComponent = PhoneCall;
      break;
    case "confirmed":
      label = "Confirmed";
      colorClasses = "bg-emerald-100 text-emerald-900 border-emerald-300";
      IconComponent = CheckCircle2;
      break;
    case "visited":
      label = "Visited";
      colorClasses = "bg-surface-container-high text-on-surface border-outline-variant";
      IconComponent = UserCheck;
      break;
    case "cancelled":
      label = "Cancelled";
      colorClasses = "bg-rose-100 text-rose-900 border-rose-300";
      IconComponent = XCircle;
      break;
    case "admin":
      label = "Admin";
      colorClasses = "bg-primary text-on-primary border-primary";
      IconComponent = ShieldCheck;
      break;
    case "staff":
      label = "Staff";
      colorClasses = "bg-secondary-container text-on-secondary-container border-secondary/20";
      IconComponent = ShieldAlert;
      break;
    case "active":
      label = "Active";
      colorClasses = "bg-emerald-100 text-emerald-900 border-emerald-300";
      IconComponent = CheckCircle2;
      break;
    case "disabled":
      label = "Disabled";
      colorClasses = "bg-rose-100 text-rose-800 border-rose-300";
      IconComponent = UserX;
      break;
  }

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs gap-1"
      : "px-2.5 py-1 text-xs sm:text-sm font-medium gap-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border shadow-2xs font-medium tracking-wide transition-colors",
        sizeClasses,
        colorClasses,
        className
      )}
    >
      <IconComponent className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>{label}</span>
    </span>
  );
}
