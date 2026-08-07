import React from 'react';
import { ArrowLeftRight, Plus, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTotalBalance } from '@/features/dashboard/store/dashboard-store';

const balanceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

// rerender-memo: memoized to prevent re-render when sibling sections update
export const TotalBalanceCard = React.memo(() => {
  const totalBalance = useTotalBalance();
  const [hidden, setHidden] = React.useState(false);

  const formatted = balanceFormatter.format(totalBalance);

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        bg-(--color-surface)
        border border-white/[0.06]
        px-5 py-5
        shadow-(--shadow-card)
      "
    >
      {/* Decorative gold radial — top-right, very subtle */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(233,196,106,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Label row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-(--color-text-muted) uppercase tracking-widest">
          Total balance
        </p>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          aria-label={hidden ? 'Show balance' : 'Hide balance'}
          className="
            flex h-7 w-7 items-center justify-center rounded-lg
            text-(--color-text-muted)
            hover:bg-white/[0.06] hover:text-(--color-text-secondary)
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
          "
        >
          {hidden ? (
            <EyeOff className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Balance display */}
      <div className="mt-2 mb-5">
        {hidden ? (
          <div className="flex items-center gap-1 mt-1" aria-label="Balance hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-(--color-text-muted)/40"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <p
            className="font-mono text-3xl font-bold tracking-tight text-(--color-text-primary) leading-none"
            aria-label={`Total balance: ${formatted}`}
          >
            {formatted}
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2">
        <Link
          to="/transfer"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-(--color-gold-400) px-4 py-2.5
            text-xs font-semibold text-(--color-navy-900)
            transition-all duration-150
            hover:bg-(--color-gold-500)
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold-400)/50
            active:scale-[0.97]
          "
        >
          <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Transfer
        </Link>

        <Link
          to="/accounts"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-white/[0.07] border border-white/[0.08] px-4 py-2.5
            text-xs font-semibold text-(--color-text-secondary)
            transition-all duration-150
            hover:bg-white/[0.11] hover:text-(--color-text-primary)
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
            active:scale-[0.97]
          "
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          Accounts
        </Link>
      </div>
    </div>
  );
});

TotalBalanceCard.displayName = 'TotalBalanceCard';
