import { apiClient } from "@/services/api-client";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";
import type { TransferPayload, DepositPayload, WithdrawalPayload } from "../types/transfer.types";

export const transferApi = {
  transfer: async (payload: TransferPayload): Promise<Transaction> => {
    const response = await apiClient.post("/api/v1/accounts/transactions/transfer", payload);
    return response.data.data;
  },
  deposit: async (payload: DepositPayload): Promise<Transaction> => {
    const response = await apiClient.post("/api/v1/accounts/transactions/deposit", payload);
    return response.data.data;
  },
  withdraw: async (payload: WithdrawalPayload): Promise<Transaction> => {
    const response = await apiClient.post("/api/v1/accounts/transactions/withdrawal", payload);
    return response.data.data;
  },
};
