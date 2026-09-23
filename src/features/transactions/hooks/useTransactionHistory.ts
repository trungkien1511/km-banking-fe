import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { transactionsApi } from "../api/transactions.api";
import type { PaginatedTransactionResponse } from "../types/transactions.types";

export function useTransactionHistory(
  accountId: string | undefined,
  page: number = 1,
  limit: number = 50
) {
  return useQuery<PaginatedTransactionResponse>({
    queryKey: ["transactions", accountId, page, limit],
    queryFn: () => {
      if (!accountId) {
        throw new Error("No account ID provided");
      }
      return transactionsApi.getHistory(accountId, page, limit);
    },
    enabled: Boolean(accountId),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
