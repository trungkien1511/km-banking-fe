export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: "PRIMARY" | "SAVINGS" | "CHECKING";
  balance: number;
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
}

export interface RecentTransaction {
  id: string;
  amount: number;
  transactionType: "IN" | "OUT";
  description: string;
  initiatedAt: string;
}
