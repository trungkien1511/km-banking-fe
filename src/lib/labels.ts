import type { Account, Transaction } from "@/features/dashboard/types/dashboard.types";

const ACCOUNT_TYPE_LABEL: Record<Account["accountType"], string> = {
  PRIMARY: "Primary",
  SAVINGS: "Savings",
  CHECKING: "Checking",
};

const TRANSACTION_TYPE_LABEL: Record<Transaction["transactionType"], string> = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER: "Transfer",
  FEE: "Service fee",
};

/**
 * Returns the English label for an account type.
 * "PRIMARY" → "Primary", "SAVINGS" → "Savings", "CHECKING" → "Checking"
 */
export function formatAccountType(type: Account["accountType"]): string {
  return ACCOUNT_TYPE_LABEL[type];
}

/**
 * Returns the English label for a transaction type.
 * "DEPOSIT" → "Deposit", "WITHDRAWAL" → "Withdrawal",
 * "TRANSFER" → "Transfer", "FEE" → "Service fee"
 */
export function formatTransactionType(type: Transaction["transactionType"]): string {
  return TRANSACTION_TYPE_LABEL[type];
}

const TRANSACTION_STATUS_LABEL: Record<Transaction["status"], string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

/**
 * Returns the English label for a transaction status.
 * "PENDING" → "Pending", "COMPLETED" → "Completed",
 * "FAILED" → "Failed", "CANCELLED" → "Cancelled"
 */
export function formatTransactionStatus(status: Transaction["status"]): string {
  return TRANSACTION_STATUS_LABEL[status];
}