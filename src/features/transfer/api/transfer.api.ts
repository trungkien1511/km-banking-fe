import { apiClient } from "@/services/api-client";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";
import type {
  Beneficiary,
  DepositPayload,
  RecipientLookup,
  RecentRecipient,
  SaveBeneficiaryPayload,
  TransferPayload,
  WithdrawalPayload,
} from "../types/transfer.types";

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
  lookupRecipient: async (accountNumber: string): Promise<RecipientLookup> => {
    const response = await apiClient.get("/api/v1/accounts/lookup-recipient", {
      params: { accountNumber },
    });
    return response.data.data;
  },
  getRecentRecipients: async (limit = 5): Promise<RecentRecipient[]> => {
    const response = await apiClient.get("/api/v1/accounts/recent-recipients", {
      params: { limit },
    });
    return response.data.data;
  },
  saveBeneficiary: async (payload: SaveBeneficiaryPayload): Promise<Beneficiary> => {
    const response = await apiClient.post("/api/v1/accounts/beneficiaries", payload);
    return response.data.data;
  },
  getBeneficiaries: async (): Promise<Beneficiary[]> => {
    const response = await apiClient.get("/api/v1/accounts/beneficiaries");
    return response.data.data;
  },
};
