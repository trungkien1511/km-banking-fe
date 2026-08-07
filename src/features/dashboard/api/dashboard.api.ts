import { apiClient } from "@/services/api-client";

export interface DashboardResponse {
  totalBalance: number;
  currency: string;
  accounts: Account[];
  recentTransactions: Transaction[];
}

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

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get("/api/v1/dashboard");
    return response.data.data;
  },

  getAccountDetail: async (accountId: string): Promise<Account> => {
    const response = await apiClient.get(`/api/v1/accounts/${accountId}`);
    return response.data.data;
  },

  getTransactionHistory: async (
    accountId: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    const response = await apiClient.get(
      `/api/v1/accounts/${accountId}/transactions`,
      { params: { page, limit } },
    );
    return response.data.data;
  },
};
