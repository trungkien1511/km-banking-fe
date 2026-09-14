import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowsLeftRight,
  Clock,
  CreditCard,
  Gear,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface QuickActionItem {
  label: string;
  to: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const ACTIONS: QuickActionItem[] = [
  {
    label: "Transfer",
    to: "/transfer",
    icon: ArrowsLeftRight,
    iconBg: "bg-primary/12",
    iconColor: "text-primary",
  },
  {
    label: "History",
    to: "/transactions",
    icon: Clock,
    iconBg: "bg-accent/12",
    iconColor: "text-accent",
  },
  {
    label: "Accounts",
    to: "/accounts",
    icon: CreditCard,
    iconBg: "bg-info/12",
    iconColor: "text-info",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Gear,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
];

export const QuickActions = React.memo(function QuickActions() {
  return (
    <nav aria-label="Quick Actions">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {ACTIONS.map(({ label, to, icon: Icon, iconBg, iconColor }) => (
          <Link
            key={to}
            to={to}
            className="
              group flex items-center gap-3
              rounded-xl border border-border
              bg-card
              px-4 py-3
              transition-[background-color,border-color] duration-150 ease-out
              hover:border-border-hover hover:bg-muted/30
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40
              active:scale-[0.98]
              touch-manipulation
            "
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                iconBg,
              )}
              aria-hidden="true"
            >
              <Icon size={18} className={iconColor} aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
});