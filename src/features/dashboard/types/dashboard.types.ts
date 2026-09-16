export interface Account {
  id: string;
  accountNumber: string;
  accountType: "PRIMARY" | "SAVINGS" | "CHECKING";
  balance: number;
  availableBalance: number;
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "FROZEN" | "CLOSED";
  createdAt: string;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  amount: number;
  fee: number;
  currency: string;
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "FEE";
  direction: "IN" | "OUT" | null;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  description: string | null;
  createdAt: string;
  valueDate: string;
}

export interface DashboardData {
  totalBalance: number;
  currency: string;
  accounts: Account[];
  recentTransactions: Transaction[];
}