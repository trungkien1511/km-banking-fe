import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type { PaginatedTransactionResponse } from "../types/transactions.types";

export const transactionsApi = {
  getHistory: async (
    accountId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedTransactionResponse> => {
    const response = await apiClient.get<ApiResponse<PaginatedTransactionResponse>>(
      `/api/v1/accounts/${accountId}/transactions`,
      {
        params: { page, limit },
      }
    );
    return response.data.data;
  },
};
