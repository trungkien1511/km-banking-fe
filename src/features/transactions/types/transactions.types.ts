import type { Transaction } from "@/features/dashboard/types/dashboard.types";

export interface PaginatedTransactionResponse {
  content: Transaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type DirectionFilter = "ALL" | "IN" | "OUT";

export interface TransactionFilterState {
  direction: DirectionFilter;
  searchQuery: string;
}
