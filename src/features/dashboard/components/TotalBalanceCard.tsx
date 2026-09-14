import React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
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
        border border-border
        px-5 py-5 shadow-card
      "
      style={{
        background:
          "linear-gradient(135deg, var(--color-card) 0%, color-mix(in srgb, var(--color-secondary) 18%, var(--color-card)) 100%)",
      }}
    >
      {/* Decorative corner glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Available Balance
        </p>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          aria-label={hidden ? "Show balance" : "Hide balance"}
          className="
            flex h-10 w-10 items-center justify-center rounded-lg
            text-muted-foreground
            hover:bg-muted/50 hover:text-foreground
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50
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
      <div className="mt-2 mb-2" aria-live="polite" aria-atomic="true">
        {hidden ? (
          <div
            className="flex items-center gap-1 mt-1"
            aria-label="Balance is hidden"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-muted-foreground/40"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <p
            className="font-mono text-3xl font-bold tracking-tight text-foreground leading-none"
            aria-label={`Available Balance: ${formatted}`}
          >
            {formatted}
          </p>
        )}
      </div>
    </div>
  );
});

TotalBalanceCard.displayName = "TotalBalanceCard";
