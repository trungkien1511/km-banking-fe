import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  SquaresFour,
  CreditCard,
  ArrowsLeftRight,
  Clock,
  Gear,
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: SquaresFour },
  { label: "Accounts", to: "/accounts", icon: CreditCard },
  { label: "Transfer", to: "/transfer", icon: ArrowsLeftRight },
  { label: "History", to: "/transactions", icon: Clock },
  { label: "Settings", to: "/settings", icon: Gear },
];

interface TooltipProps {
  label: string;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ label, visible }) => (
  <div
    role="tooltip"
    className={cn(
      "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50",
      "whitespace-nowrap rounded-md px-2.5 py-1.5",
      "bg-(--color-surface-elevated) border border-(--color-border)",
      "text-xs font-medium text-(--color-foreground)",
      "shadow-(--shadow-elevated)",
      "transition-all duration-150",
      visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1",
    )}
  >
    {label}
  </div>
);

interface RailItemProps {
  item: NavItem;
}

const RailItem: React.FC<RailItemProps> = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
      aria-label={item.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) =>
        cn(
          "relative flex h-11 w-11 items-center justify-center rounded-xl",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/50",
          isActive
            ? "bg-(--color-primary)/10 text-(--color-primary)"
            : "text-(--color-muted-foreground) hover:bg-(--color-muted)/50 hover:text-(--color-foreground)",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            weight={isActive ? "bold" : "regular"}
            aria-hidden="true"
          />
          <Tooltip label={item.label} visible={hovered} />
        </>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const [logoutHovered, setLogoutHovered] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="
        hidden lg:flex flex-col items-center
        w-16 shrink-0
        h-screen sticky top-0
        bg-(--color-card)
        border-r border-(--color-border)
        py-4
      "
      aria-label="Main navigation"
    >
      {/* Logo mark - hexagon icon only */}
      <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-primary)/10">
        <svg
          className="h-5 w-5 text-(--color-primary)"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6L7.5 8.5V13.5L12 16L16.5 13.5V8.5L12 6Z"
            fill="currentColor"
            fillOpacity="0.35"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Nav rail */}
      <nav
        className="flex flex-1 flex-col items-center gap-1"
        aria-label="App sections"
      >
        {NAV_ITEMS.map((item) => (
          <RailItem key={item.to} item={item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="relative">
        <button
          type="button"
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHovered(true)}
          onMouseLeave={() => setLogoutHovered(false)}
          aria-label="Sign out"
          className="
            flex h-11 w-11 items-center justify-center rounded-xl
            text-(--color-muted-foreground)
            hover:bg-(--color-destructive)/10 hover:text-(--color-destructive)
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-destructive)/40
            active:scale-[0.95]
          "
        >
          <SignOut size={20} aria-hidden="true" />
          <Tooltip label="Sign out" visible={logoutHovered} />
        </button>
      </div>
    </aside>
  );
};
