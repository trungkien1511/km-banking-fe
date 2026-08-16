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
