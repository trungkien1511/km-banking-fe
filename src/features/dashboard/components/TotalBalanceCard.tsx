import React from "react";
import { ArrowsLeftRight, Plus, Eye, EyeSlash } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useTotalBalance } from "@/features/dashboard/store/dashboard-store";

const balanceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export const TotalBalanceCard = React.memo(() => {
  const totalBalance = useTotalBalance();
  const [hidden, setHidden] = React.useState(false);
  const formatted = balanceFormatter.format(totalBalance);

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        bg-(--color-card) border border-(--color-border)
        px-5 py-5 shadow-(--shadow-card)
      "
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 6%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-(--color-muted-foreground) uppercase tracking-widest">
          Total balance
        </p>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          aria-label={hidden ? "Show balance" : "Hide balance"}
          className="
            flex h-7 w-7 items-center justify-center rounded-lg
            text-(--color-muted-foreground)
            hover:bg-(--color-muted)/50 hover:text-(--color-foreground)
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)/50
            touch-manipulation
          "
        >
          {hidden ? (
            <EyeSlash size={14} aria-hidden="true" />
          ) : (
            <Eye size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* aria-live="polite" — screen reader announces balance visibility change */}
      <div className="mt-2 mb-5" aria-live="polite" aria-atomic="true">
        {hidden ? (
          <div
            className="flex items-center gap-1 mt-1"
            aria-label="Balance hidden"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-(--color-muted-foreground)/40"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <p
            className="font-mono text-3xl font-bold tracking-tight text-(--color-foreground) leading-none"
            aria-label={`Total balance: ${formatted}`}
          >
            {formatted}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/transfer"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-(--color-primary) px-4 py-2.5
            text-xs font-semibold text-(--color-primary-fg)
            transition-[background-color,box-shadow,transform,opacity] duration-150
            hover:bg-(--color-primary-hover)
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/50
            active:scale-[0.97]
            touch-manipulation
          "
        >
          <ArrowsLeftRight
            size={14}
            weight="bold"
            aria-hidden="true"
          />
          Transfer
        </Link>

        <Link
          to="/accounts"
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-(--color-muted) border border-(--color-border) px-4 py-2.5
            text-xs font-semibold text-(--color-muted-foreground)
            transition-[background-color,color,border-color,transform,opacity] duration-150
            hover:bg-(--color-surface-elevated) hover:text-(--color-foreground)
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)/50
            active:scale-[0.97]
            touch-manipulation
          "
        >
          <Plus size={14} weight="bold" aria-hidden="true" />
          Accounts
        </Link>
      </div>
    </div>
  );
});

TotalBalanceCard.displayName = "TotalBalanceCard";
