import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/brand";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { NAV_ITEMS, type NavItem } from "./nav-items";

interface RailItemProps {
  item: NavItem;
}

const RailItem: React.FC<RailItemProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
      aria-label={item.label}
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            weight={isActive ? "bold" : "regular"}
            aria-hidden="true"
            className="flex-shrink-0"
          />
          <span className="text-sm font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

// Memoized — stateless shell component (rerender-memo: no re-render on route change).
export const Sidebar = React.memo(function Sidebar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="
        hidden lg:flex flex-col
        w-52 shrink-0
        h-screen sticky top-0
        bg-card
        border-r border-border
        py-4 px-3
      "
      aria-label="Main navigation"
    >
      {/* Brand logo + name */}
      <div className="mb-4 flex items-center gap-2.5 px-1">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <svg
            className="h-4 w-4 text-primary"
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
        <span className="text-sm font-bold text-foreground tracking-tight">
          {APP_NAME}
        </span>
      </div>

      <nav
        className="flex flex-1 flex-col gap-1"
        aria-label="App sections"
      >
        {NAV_ITEMS.map((item) => (
          <RailItem key={item.to} item={item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out"
        className="
          flex w-full items-center gap-3 rounded-xl px-3 py-2.5
          text-muted-foreground
          hover:bg-destructive/10 hover:text-destructive
          transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40
          active:scale-[0.95]
        "
      >
        <SignOut size={20} aria-hidden="true" />
        <span className="text-sm font-medium">Log out</span>
      </button>
    </aside>
  );
});