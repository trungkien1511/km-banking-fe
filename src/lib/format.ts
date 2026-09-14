// js-cache-function-results — formatters are cached at module scope, never re-created per render.
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
export const formatCurrency = (
  amount: number,
  currency: string = "VND",
): string => {
  let fmt = currencyFormatterCache.get(currency);
  if (fmt === undefined) {
    fmt = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    currencyFormatterCache.set(currency, fmt);
  }
  return fmt.format(amount);
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
export const formatDate = (dateStr: string): string =>
  dateFormatter.format(new Date(dateStr));

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN");
export const formatDateTime = (dateStr: string): string =>
  dateTimeFormatter.format(new Date(dateStr));

/**
 * Masks an account number showing only first 4 and last 4 digits.
 * "970422000001234" → "9704 •••• 1234"
 * Returns the original string unchanged if shorter than 8 characters.
 */
export function maskAccountNumber(num: string): string {
  if (num.length < 8) return num;
  return `${num.slice(0, 4)} •••• ${num.slice(-4)}`;
}

/**
 * Returns a human-readable date group label in English.
 * "Today"       — if dateStr is today
 * "Yesterday"   — if dateStr is yesterday
 * "September 10, 2026" — for older dates
 */
const dateGroupFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const toMidnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (toMidnight(now).getTime() - toMidnight(date).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return dateGroupFormatter.format(date);
}
