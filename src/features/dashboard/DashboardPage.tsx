import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { Button } from '@/components/ui/Button';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Shield,
  LogOut,
  User as UserIcon,
  Activity
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, accessToken, isAuthenticated, logout } = useAuthStore();

  // Protect route - Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/login');
    }
  }, [isAuthenticated, accessToken, navigate]);

  if (!isAuthenticated || !user || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-text-secondary">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mask token for UI presentation
  const maskedToken = accessToken.length > 20
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
            <span className="font-semibold text-base tracking-tight">KM BANK</span>
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
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.fullName}!</h1>
            <p className="text-sm text-text-secondary">Here's a premium overview of your secure digital banking space.</p>
          </div>

          {/* Token verification box */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2 max-w-md shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <Activity className="h-4 w-4" />
              Session Token Status
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary">
                <span className="font-medium text-text-primary">Zustand Access Token: </span>
                <code className="bg-surface px-1.5 py-0.5 rounded border border-border text-primary font-mono text-[10px] break-all">
                  {maskedToken}
                </code>
              </p>
              <p className="text-xs text-text-secondary">
                <span className="font-medium text-text-primary">Subject (UUID): </span>
                <code className="text-text-primary font-mono text-[10px]">{user.id}</code>
              </p>
              <p className="text-xs text-text-secondary">
                <span className="font-medium text-text-primary">Role claim: </span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Account Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CreditCard className="h-24 w-24 text-text-primary" />
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Primary Account</span>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-muted">Account Number</p>
                <p className="font-mono text-sm font-semibold tracking-wide">**** **** 8940</p>
              </div>
              <div className="pt-2 border-t border-border/50 flex items-baseline justify-between">
                <p className="text-2xl font-bold font-mono">$124,582.40</p>
                <span className="text-xs text-success flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" /> +2.4%
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Savings Account</span>
                <span className="text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">EARNING 4.2% APY</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-text-muted">Account Number</p>
                <p className="font-mono text-sm font-semibold tracking-wide">**** **** 1039</p>
              </div>
              <div className="pt-2 border-t border-border/50 flex items-baseline justify-between">
                <p className="text-2xl font-bold font-mono">$48,109.15</p>
                <span className="text-xs text-success flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" /> +4.2%
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
              <p className="text-xs text-text-secondary">Execute secure money transfers and manage credentials.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <Button size="sm" className="gap-1.5 font-medium">
                <ArrowUpRight className="h-4 w-4" /> Transfer
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 font-medium bg-surface hover:bg-elevated">
                <UserIcon className="h-4 w-4" /> Profile
              </Button>
            </div>
          </div>
        </section>

        {/* Transactions list */}
        <section className="bg-surface border border-border rounded-xl shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-semibold">Recent Transactions</h3>
            <span className="text-xs text-text-muted">Showing latest 3 transactions</span>
          </div>

          <div className="divide-y divide-border/60">
            {/* Tx 1 */}
            <div className="p-6 flex items-center justify-between hover:bg-elevated/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Amazon Web Services</p>
                  <p className="text-xs text-text-muted">Cloud Infrastructure Billing</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold font-mono text-danger">-$1,248.50</p>
                <p className="text-xs text-text-muted">May 18, 2026</p>
              </div>
            </div>

            {/* Tx 2 */}
            <div className="p-6 flex items-center justify-between hover:bg-elevated/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Stripe Payout</p>
                  <p className="text-xs text-text-muted">Direct Deposit Merchant Account</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold font-mono text-success">+$14,890.00</p>
                <p className="text-xs text-text-muted">May 17, 2026</p>
              </div>
            </div>

            {/* Tx 3 */}
            <div className="p-6 flex items-center justify-between hover:bg-elevated/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">GitHub Enterprise</p>
                  <p className="text-xs text-text-muted">Developer Seats Subscription</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-bold font-mono text-danger">-$420.00</p>
                <p className="text-xs text-text-muted">May 15, 2026</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
