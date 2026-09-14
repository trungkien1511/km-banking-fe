import React from "react";
import { NavLink } from "react-router-dom";
import {
  SquaresFour,
  CreditCard,
  ArrowsLeftRight,
  Clock,
  Gear,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: SquaresFour },
  { label: "Accounts", to: "/accounts", icon: CreditCard },
  { label: "Transfer", to: "/transfer", icon: ArrowsLeftRight },
  { label: "History", to: "/transactions", icon: Clock },
  { label: "Settings", to: "/settings", icon: Gear },
];

export const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="
        lg:hidden
        fixed bottom-0 left-0 right-0 z-40
        bg-card/95 backdrop-blur-md
        border-t border-border
        px-2 py-1.5
        shadow-[0_-4px_12px_rgba(0,0,0,0.15)]
      "
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-1 px-2.5 rounded-lg min-w-[56px] min-h-[44px]",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    weight={isActive ? "fill" : "regular"}
                    aria-hidden="true"
                    className={cn(
                      "transition-transform duration-150",
                      isActive && "scale-110",
                    )}
                  />
                  <span className="text-[11px] mt-0.5 leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
