import { apiClient } from "@/services/api-client";
import type { Account, Transaction, DashboardData } from "@/features/dashboard/types/dashboard.types";

export type { Account, Transaction };

// DashboardResponse is kept as an alias for backward compatibility.
export interface DashboardResponse extends DashboardData {}

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get("/api/v1/dashboard");
    return response.data.data;
  },
};