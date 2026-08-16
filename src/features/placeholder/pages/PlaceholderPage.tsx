import { useLocation } from "react-router-dom";

const TITLES: Record<string, string> = {
  "/accounts": "Accounts",
  "/transactions": "Transaction History",
  "/settings": "Settings",
  "/dashboard/history": "Transaction History",
  "/dashboard/pending": "Pending Transactions",
};

const pageTitle = (pathname: string): string => {
  if (pathname.startsWith("/accounts/")) return "Account Details";
  return TITLES[pathname] ?? "Coming Soon";
};

// Placeholder for sections that exist in the nav but are not implemented yet.
export const PlaceholderPage = () => {
  const { pathname } = useLocation();
  const title = pageTitle(pathname);

  return (
    <div className="space-y-4">
      <h1 className="text-page-title text-foreground mb-2">{title}</h1>
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
        <p className="text-sm text-muted-foreground">
          This section is under construction.
        </p>
      </div>
    </div>
  );
};
