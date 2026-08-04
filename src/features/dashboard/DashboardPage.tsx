import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useAccounts } from "@/features/dashboard/hooks/use-accounts";
import { useRecentTransactions } from "@/features/dashboard/hooks/use-recent-transactions";
import { AccountCardSkeleton } from "@/features/dashboard/components/AccountCardSkeleton";
import { TransactionRowSkeleton } from "@/features/dashboard/components/TransactionRowSkeleton";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  LogOut,
  User as UserIcon,
  Activity,
} from "lucide-react";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, isAuthenticated, logout } = useAuthStore();

  const {
    accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useRecentTransactions(3);

  useEffect(() => {
    if (accountsError) toast.error("Failed to load accounts. Please refresh.");
  }, [accountsError]);

  useEffect(() => {
    if (transactionsError)
      toast.error("Failed to load transactions. Please refresh.");
  }, [transactionsError]);

  if (!isAuthenticated || !user || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center space-y-3">
          <LoadingSpinner size="md" className="mx-auto" />
          <p className="text-sm text-text-secondary">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mask token for UI presentation
  const maskedToken =
    accessToken.length > 20
      ? `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 10)}`
      : accessToken;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              KM
            </div>
            <span className="font-semibold text-base tracking-tight">
              KM BANK
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-text-secondary">
              <Shield className="h-3.5 w-3.5 text-success shrink-0" />
              Secure Session
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-text-secondary hover:text-danger hover:border-danger/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section & Debug Token Status */}
        <section className="bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-sm text-text-secondary">
              Here's a premium overview of your secure digital banking space.
            </p>
            {user.phoneNumber && (
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Phone: </span>
                {user.phoneNumber}
              </p>
            )}
            {user.email && (
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Email: </span>
                {user.email}
              </p>
            )}
          </div>

          {/* Token verification box — dev only */}
          {import.meta.env.DEV && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2 max-w-md shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <Activity className="h-4 w-4" />
                Session Token Status
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-secondary">
                  <span className="font-medium text-text-primary">
                    Zustand Access Token:{" "}
                  </span>
                  <code className="bg-surface px-1.5 py-0.5 rounded border border-border text-primary font-mono text-[10px] break-all">
                    {maskedToken}
                  </code>
                </p>
                <p className="text-xs text-text-secondary">
                  <span className="font-medium text-text-primary">
                    Subject (UUID):{" "}
                  </span>
                  <code className="text-text-primary font-mono text-[10px]">
                    {user.id}
                  </code>
                </p>
                <p className="text-xs text-text-secondary">
                  <span className="font-medium text-text-primary">
                    Role claim:{" "}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Account Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountsLoading ? (
            <>
              <AccountCardSkeleton />
              <AccountCardSkeleton />
            </>
          ) : accounts.length === 0 ? (
            <div className="md:col-span-2 flex items-center justify-center bg-surface border border-border rounded-xl p-6 shadow-sm">
              <p className="text-sm text-text-muted">No accounts found.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CreditCard className="h-24 w-24 text-text-primary" />
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                      {account.accountType}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        account.status === "ACTIVE"
                          ? "text-primary bg-primary/10"
                          : "text-text-muted bg-elevated"
                      }`}
                    >
                      {account.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-muted">Account Number</p>
                    <p className="font-mono text-sm font-semibold tracking-wide">
                      **** **** {account.accountNumber.slice(-4)}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex items-baseline justify-between">
                    <p className="text-2xl font-bold font-mono">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: account.currency,
                      }).format(account.balance)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Quick Actions card — always visible */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
              <p className="text-xs text-text-secondary">
                Execute secure money transfers and manage credentials.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <Button size="sm" className="gap-1.5 font-medium">
                <ArrowUpRight className="h-4 w-4" /> Transfer
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 font-medium bg-surface hover:bg-elevated"
              >
                <UserIcon className="h-4 w-4" /> Profile
              </Button>
            </div>
          </div>
        </section>

        {/* Transactions list */}
        <section className="bg-surface border border-border rounded-xl shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Transactions</h3>
            <span className="text-xs text-text-muted">
              Showing latest 3 transactions
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {transactionsLoading ? (
              <>
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
                <TransactionRowSkeleton />
              </>
            ) : transactions.length === 0 ? (
              <div className="p-6 flex items-center justify-center">
                <p className="text-sm text-text-muted">
                  No recent transactions.
                </p>
              </div>
            ) : (
              transactions.map((tx) => {
                const isIn = tx.transactionType === "IN";
                return (
                  <div
                    key={tx.id}
                    className="p-6 flex items-center justify-between hover:bg-elevated/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                          isIn
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {isIn ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {tx.description || "Transaction"}
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(tx.initiatedAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p
                        className={`text-sm font-bold font-mono ${isIn ? "text-success" : "text-danger"}`}
                      >
                        {isIn ? "+" : "-"}
                        {new Intl.NumberFormat("vi-VN").format(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
