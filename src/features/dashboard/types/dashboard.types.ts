import type { Account, Transaction } from "@/features/dashboard/api/dashboard.api";

export type { Account, Transaction };

export interface DashboardData {
  totalBalance: number;
  currency: string;
  accounts: Account[];
  recentTransactions: Transaction[];
}

export interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;

  setDashboardData: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
