import React from "react";
import { useNavigate } from "react-router-dom";
import { SignOut, Bell } from "@phosphor-icons/react";
import { useAuthStore } from "@/features/auth/store/auth-store";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Memoized — stateless shell component (rerender-memo: no re-render on route change).
export const DashboardHeader = React.memo(function DashboardHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.fullName ?? user?.username ?? "";
  const firstName = displayName.split(" ")[0];
  const initials = displayName ? getInitials(displayName) : "?";

  return (
    <header
      className="
        flex items-center justify-between
        px-5 py-3
        border-b border-border
        bg-card
      "
      aria-label="Dashboard header"
    >
      {/* Greeting + user info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full
            bg-primary/15 border border-primary/20
            text-primary text-sm font-semibold
            select-none
          "
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-sm text-muted-foreground leading-none">
            {getGreeting()}
          </p>
          <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">
            {firstName || "Welcome"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label="Notifications"
          className="
            flex h-10 w-10 items-center justify-center rounded-lg
            text-muted-foreground
            hover:bg-muted/50 hover:text-foreground
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
            active:scale-[0.94]
          "
        >
          <Bell size={16} aria-hidden="true" />
        </button>

        {/* Mobile-only sign out (sidebar handles it on desktop) */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          className="
            lg:hidden
            flex h-10 w-10 items-center justify-center rounded-lg
            text-muted-foreground
            hover:bg-destructive/10 hover:text-destructive
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40
            active:scale-[0.94]
          "
        >
          <SignOut size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
});
