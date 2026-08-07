import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
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
        border-b border-white/6
        bg-(--color-surface)
      "
      aria-label="Dashboard header"
    >
      {/* Left: greeting */}
      <div className="flex items-center gap-3">
        {/* User avatar initials - mobile only (desktop sidebar has logo) */}
        <div
          className="
            flex h-8 w-8 items-center justify-center rounded-full
            bg-(--color-gold-400)/15 border border-(--color-gold-400)/20
            text-(--color-gold-400) text-xs font-semibold
            select-none
          "
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-[11px] text-text-muted leading-none">
            {getGreeting()}
          </p>
          <p className="text-sm font-semibold text-text-primary leading-tight mt-0.5">
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
            text-text-muted
            hover:bg-white/6 hover:text-text-secondary
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)/50
            active:scale-[0.94]
          "
        >
          <Bell className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Mobile-only sign out (sidebar handles it on desktop) */}
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          className="
            lg:hidden
            flex h-8 w-8 items-center justify-center rounded-lg
            text-text-muted
            hover:bg-red-500/10 hover:text-red-400
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40
            active:scale-[0.94]
          "
        >
          <LogOut className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
