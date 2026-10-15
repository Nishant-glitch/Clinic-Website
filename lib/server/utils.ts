import "server-only";

/**
 * Generates human-friendly reference codes:
 * Format: PREFIX-YYMMDD-XXXX (e.g. APT-261015-7K2M)
 */
export function generateReference(prefix: "APT" | "MSG"): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  // Crockford Base32 alphabet without ambiguous letters (I, L, O, U)
  const chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    randomPart += chars[idx];
  }

  return `${prefix}-${yy}${mm}${dd}-${randomPart}`;
}

/**
 * Normalizes a patient name:
 * Trims leading/trailing whitespace, collapses internal multiple spaces,
 * and converts to title case.
 */
export function normalizeName(name: string): string {
  const collapsed = name.trim().replace(/\s+/g, " ");
  return collapsed
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

/**
 * Normalizes Indian mobile number to 10 digits.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/^(?:\+91|91|0)/, "").replace(/[\s-]/g, "");
}

/**
 * Prevents CSV formula injection by prepending single quote (') if value begins with =, +, -, @, \t, or \r.
 */
export function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();

  // If cell starts with dangerous spreadsheet characters, prepend single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape inner quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Converts array of row records to CSV formatted string.
 */
export function toCsvString(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerLine = headers.map((h) => sanitizeCsvCell(h)).join(",");
  const dataLines = rows.map((row) => row.map((cell) => sanitizeCsvCell(cell)).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}
