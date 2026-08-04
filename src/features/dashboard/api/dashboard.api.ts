import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  BankAccount,
  RecentTransaction,
} from "@/features/dashboard/types/dashboard.types";

export const dashboardApi = {
  getAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return apiClient.get("/api/v1/accounts").then((res) => res.data);
  },

  getRecentTransactions(limit = 3): Promise<ApiResponse<RecentTransaction[]>> {
    return apiClient
      .get(`/api/v1/transactions/recent?limit=${limit}`)
      .then((res) => res.data);
  },
};
