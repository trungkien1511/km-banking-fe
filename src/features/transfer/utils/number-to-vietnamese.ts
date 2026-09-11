// Converts a VND amount to formal Vietnamese banking words.
// Examples:
//   1000        → "Một nghìn đồng"
//   1500000     → "Một triệu năm trăm nghìn đồng"
//   1000000000  → "Một tỷ đồng"
//   0 / NaN     → ""

const UNITS = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const TENS  = ["", "mười", "hai mươi", "ba mươi", "bốn mươi",
               "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];

function readThree(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;

  let result = "";
  if (h > 0) result += UNITS[h] + " trăm";
  if (t === 0 && u === 0) return result.trim();

  if (t === 0) {
    // No tens digit: "một trăm lẻ năm" if hundreds present, otherwise a bare 1–9.
    // The "mốt"/"lăm" forms only apply when there is a tens digit.
    result += (h > 0 ? " lẻ " : "") + UNITS[u];
  } else if (t === 1) {
    result += (h > 0 ? " " : "") + "mười";
    if (u === 5) result += " lăm";
    else if (u > 0) result += " " + UNITS[u];
  } else {
    result += (h > 0 ? " " : "") + TENS[t];
    if (u === 5) result += " lăm";
    else if (u === 1) result += " mốt";
    else if (u > 0) result += " " + UNITS[u];
  }
  return result.trim();
}

export function numberToVietnamese(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "";

  const n = Math.floor(amount);

  const ty   = Math.floor(n / 1_000_000_000);
  const trieu = Math.floor((n % 1_000_000_000) / 1_000_000);
  const nghin = Math.floor((n % 1_000_000) / 1_000);
  const rest  = n % 1_000;

  const parts: string[] = [];
  if (ty   > 0) parts.push(readThree(ty)   + " tỷ");
  if (trieu > 0) parts.push(readThree(trieu) + " triệu");
  if (nghin > 0) parts.push(readThree(nghin) + " nghìn");
  if (rest  > 0) parts.push(readThree(rest));

  if (parts.length === 0) return "";

  const words = parts.join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1) + " đồng";
}