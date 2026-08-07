import React from 'react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import {
  useDashboardLoading,
  useDashboardError,
} from '@/features/dashboard/store/dashboard-store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { TotalBalanceCard } from './TotalBalanceCard';
import { AccountsSection } from './AccountsSection';
import { CompletedTransactionSection } from './CompletedTransactionSection';

// NOT memoized (root page, fetches data)
export const DashboardPage = () => {
  useDashboard();

  const isLoading = useDashboardLoading();
  const error = useDashboardError();

  return isLoading ? (
    <div className="flex items-center justify-center py-24">
      <LoadingSpinner size="lg" />
    </div>
  ) : error ? (
    <Alert variant="danger" title="Something went wrong">
      {error}
    </Alert>
  ) : (
    <div className="space-y-4">
      <TotalBalanceCard />
      <AccountsSection />
      <CompletedTransactionSection />
    </div>
  );
};
