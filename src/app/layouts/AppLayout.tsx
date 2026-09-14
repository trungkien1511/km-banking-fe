import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-dvh bg-background">
      {/* Skip link — hidden until focused, allows keyboard users to jump past sidebar */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          fixed top-2 left-2 z-50
          rounded-lg px-4 py-2
          bg-accent text-accent-fg
          text-sm font-semibold
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        "
      >
        Skip to content
      </a>

      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 pb-16 lg:pb-0">
        <DashboardHeader />

        <main
          className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6"
          id="main-content"
          tabIndex={-1}
        >
          {/* max-w-2xl — banking content is narrow by design: cards, lists, forms */}
          <div className="mx-auto max-w-2xl">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};
