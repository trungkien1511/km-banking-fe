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

export const DashboardHeader: React.FC = () => {
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
        border-b border-(--color-border)
        bg-(--color-card)
      "
      aria-label="Dashboard header"
    >
      {/* Left: greeting */}
      <div className="flex items-center gap-3">
        {/* User avatar initials - mobile only (desktop sidebar has logo) */}
        <div
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            bg-(--color-primary)/15 border border-(--color-primary)/20
            text-(--color-primary) text-xs font-semibold
            select-none
          "
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground leading-none">
            {getGreeting()}
          </p>
          <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">
            {firstName || "Welcome"}
          </p>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label="Notifications"
          className="
            flex h-8 w-8 items-center justify-center rounded-lg
            text-muted-foreground
            hover:bg-(--color-muted)/50 hover:text-foreground
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)/50
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
            flex h-8 w-8 items-center justify-center rounded-lg
            text-muted-foreground
            hover:bg-(--color-destructive)/10 hover:text-(--color-destructive)
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-destructive)/40
            active:scale-[0.94]
          "
        >
          <SignOut size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
