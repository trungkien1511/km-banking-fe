import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { RecentTransaction } from "@/features/dashboard/types/dashboard.types";

export const useRecentTransactions = (limit = 3) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", "recent", limit],
    queryFn: () => dashboardApi.getRecentTransactions(limit),
    enabled: isAuthenticated === true,
  });

  return {
    transactions: (data?.data ?? []) as RecentTransaction[],
    isLoading,
    error,
  };
};
