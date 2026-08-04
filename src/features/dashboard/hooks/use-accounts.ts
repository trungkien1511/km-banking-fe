import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { BankAccount } from "@/features/dashboard/types/dashboard.types";

export const useAccounts = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => dashboardApi.getAccounts(),
    enabled: isAuthenticated === true,
  });

  return {
    accounts: (data?.data ?? []) as BankAccount[],
    isLoading,
    error,
  };
};
