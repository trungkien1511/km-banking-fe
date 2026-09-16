import { APP_NAME } from "@/constants/brand";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

/**
 * Opens a dedicated print window with a clean receipt layout.
 * Falls back gracefully if the popup is blocked.
 */
export function printReceipt(transaction: Transaction, operationType: string): void {
  const operationLabel =
    operationType === "transfer" ? "Transfer"
    : operationType === "deposit" ? "Deposit"
    : "Withdrawal";

  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(new Date(transaction.createdAt));

  const amount = transaction.amount.toLocaleString("vi-VN") + " ₫";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Transaction Receipt - ${transaction.referenceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'IBM Plex Sans', 'Segoe UI', Arial, sans-serif; padding: 32px; color: #020617; font-size: 14px; }
    .header { text-align: center; margin-bottom: 24px; }
    .header h1 { font-size: 20px; font-weight: 700; }
    .header p { color: #475569; font-size: 12px; margin-top: 4px; }
    .divider { border: none; border-top: 1px dashed #e2e8f0; margin: 16px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .label { color: #475569; }
    .value { font-weight: 600; text-align: right; }
    .amount { font-size: 22px; font-weight: 800; color: #020617; }
    .status { color: #22c55e; font-weight: 700; }
    .footer { text-align: center; margin-top: 24px; color: #64748b; font-size: 11px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${APP_NAME}</h1>
    <p>${operationLabel} Receipt</p>
  </div>
  <hr class="divider" />
  <div class="row"><span class="label">Reference No.</span><span class="value">${transaction.referenceNumber}</span></div>
  <div class="row"><span class="label">Transaction Type</span><span class="value">${operationLabel}</span></div>
  <div class="row"><span class="label">Status</span><span class="value status">${transaction.status}</span></div>
  <div class="row"><span class="label">Completed At</span><span class="value">${date}</span></div>
  <hr class="divider" />
  <div class="row"><span class="label">Amount</span><span class="value amount">${amount}</span></div>
  <div class="row"><span class="label">Fee</span><span class="value">0 ₫</span></div>
  ${transaction.description ? `<div class="row"><span class="label">Note</span><span class="value">${transaction.description}</span></div>` : ""}
  <hr class="divider" />
  <p class="footer">Thank you for using ${APP_NAME}</p>
</body>
</html>`;

  const win = window.open("", "_blank", "width=600,height=700");
  if (!win) return; // popup blocked
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}