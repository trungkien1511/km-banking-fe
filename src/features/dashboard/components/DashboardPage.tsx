import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import {
  useDashboardLoading,
  useDashboardError,
} from '@/features/dashboard/store/dashboard-store';
import { TotalBalanceCard } from './TotalBalanceCard';
import { AccountsSection } from './AccountsSection';
import { CompletedTransactionSection } from './CompletedTransactionSection';
import { QuickActions } from './QuickActions';
import { SkeletonDashboard } from './SkeletonDashboard';

// NOT memoized (root page, fetches data)
export const DashboardPage = () => {
  useDashboard();

  const isLoading = useDashboardLoading();
  const error = useDashboardError();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="
            mt-4 inline-flex items-center gap-1.5 rounded-lg
            bg-destructive px-4 py-2
            text-sm font-semibold text-on-status
            transition-[background-color,transform] duration-150
            hover:bg-destructive/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50
            active:scale-[0.97]
          "
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="sr-only">Dashboard</h1>
      <TotalBalanceCard />
      <QuickActions />
      <AccountsSection />
      <CompletedTransactionSection />
    </div>
  );
};
