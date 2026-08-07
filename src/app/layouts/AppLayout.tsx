import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { DashboardHeader } from "@/components/shared/DashboardHeader";

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader />

        <main
          className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6"
          id="main-content"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
