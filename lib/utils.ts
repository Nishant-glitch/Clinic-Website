import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines CSS classes with clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date, Firestore Timestamp, ISO string, or epoch timestamp
 * in the Asia/Kolkata timezone (IST).
 */
export function formatDate(
  dateInput: Date | string | number | { toDate: () => Date } | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return "";

  let date: Date;

  if (
    typeof dateInput === "object" &&
    dateInput !== null &&
    "toDate" in dateInput &&
    typeof (dateInput as { toDate: () => Date }).toDate === "function"
  ) {
    date = (dateInput as { toDate: () => Date }).toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    return "";
  }

  if (isNaN(date.getTime())) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-IN", options || defaultOptions).format(date);
}

/**
 * Formats a 10-digit Indian phone number into standard display format:
 * e.g., "9876543210" -> "+91 98765 43210"
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/^(?:\+91|91|0)/, "").replace(/[\s-]/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

/**
 * Formats a date as relative time (e.g., "5m ago", "2h ago", "3d ago")
 * or fallback to short date for older timestamps.
 */
export function formatRelativeTime(
  dateInput: Date | string | number | { toDate: () => Date } | null | undefined
): string {
  if (!dateInput) return "";
  let date: Date;
  if (
    typeof dateInput === "object" &&
    dateInput !== null &&
    "toDate" in dateInput &&
    typeof (dateInput as { toDate: () => Date }).toDate === "function"
  ) {
    date = (dateInput as { toDate: () => Date }).toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    return "";
  }
  if (isNaN(date.getTime())) return "";

  const now = Date.now();
  const diffSec = Math.floor((now - date.getTime()) / 1000);
  if (diffSec < 0) return "in the future";
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date, { day: "numeric", month: "short", year: "numeric" });
}

