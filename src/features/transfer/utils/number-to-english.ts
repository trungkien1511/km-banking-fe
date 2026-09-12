// Converts a VND amount to formal English banking words.
// Examples:
//   1000        → "One Thousand VND"
//   1500000     → "One Million Five Hundred Thousand VND"
//   1000000000  → "One Billion VND"
//   0 / NaN     → ""

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS  = ["", "", "twenty", "thirty", "forty", "fifty",
               "sixty", "seventy", "eighty", "ninety"];

function readThree(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const rest = n % 100;

  let result = "";
  if (h > 0) result += ONES[h] + " hundred";

  if (rest === 0) return result.trim();

  if (h > 0) result += " ";

  if (rest < 10) {
    result += ONES[rest];
  } else if (rest < 20) {
    result += TEENS[rest - 10];
  } else {
    const t = Math.floor(rest / 10);
    const u = rest % 10;
    result += TENS[t];
    if (u > 0) result += "-" + ONES[u];
  }
  return result.trim();
}

export function numberToEnglish(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "";

  const n = Math.floor(amount);

  const billion  = Math.floor(n / 1_000_000_000);
  const million  = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((n % 1_000_000) / 1_000);
  const rest     = n % 1_000;

  const parts: string[] = [];
  if (billion  > 0) parts.push(readThree(billion)  + " billion");
  if (million  > 0) parts.push(readThree(million)  + " million");
  if (thousand > 0) parts.push(readThree(thousand) + " thousand");
  if (rest     > 0) parts.push(readThree(rest));

  if (parts.length === 0) return "";

  const words = parts.join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1) + " VND";
}