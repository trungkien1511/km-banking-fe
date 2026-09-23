import React, { useState, useMemo } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useAccounts } from "@/features/dashboard/store/dashboard-store";
import { useTransactionHistory } from "../hooks/useTransactionHistory";
import { AccountPickerBar } from "../components/AccountPickerBar";
import { TransactionFilterBar } from "../components/TransactionFilterBar";
import { TransactionLedger } from "../components/TransactionLedger";
import { PaginationBar } from "../components/PaginationBar";
import { TransactionDetailDrawer } from "../components/TransactionDetailDrawer";
import type { DirectionFilter } from "../types/transactions.types";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

export const TransactionHistoryPage: React.FC = () => {
  const accounts = useAccounts();
  const activeAccounts = useMemo(
    () => accounts.filter((a) => a.status === "ACTIVE"),
    [accounts]
  );

  const { accountId: pathAccountId } = useParams<{ accountId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Account ID resolution: path param -> query param -> first active account
  const queryAccountId = searchParams.get("account");
  const selectedAccountId =
    pathAccountId ||
    queryAccountId ||
    activeAccounts[0]?.id ||
    "";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const [direction, setDirection] = useState<DirectionFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Default limit 50 records per page for rich monthly auditing
  const { data, isLoading, error } = useTransactionHistory(selectedAccountId, page, 50);

  const handleSelectAccount = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("account", id);
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", newPage.toString());
      return next;
    });
  };

  const rawTransactions = useMemo(() => data?.content ?? [], [data]);

  // Client-side filtering on current page
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((txn) => {
      if (direction === "IN" && txn.direction !== "IN") return false;
      if (direction === "OUT" && txn.direction !== "OUT") return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const desc = (txn.description || "").toLowerCase();
        const ref = txn.referenceNumber.toLowerCase();
        if (!desc.includes(q) && !ref.includes(q)) return false;
      }
      return true;
    });
  }, [rawTransactions, direction, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-slide-up">
      {/* Page Title */}
      <div>
        <h1 className="text-page-title text-foreground mb-1">Transaction History</h1>
        <p className="text-sm text-muted-foreground">
          View, search, and audit your account activity and receipts.
        </p>
      </div>

      {/* Account Switcher */}
      <AccountPickerBar
        accounts={activeAccounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={handleSelectAccount}
      />

      {/* Search & Filters */}
      <TransactionFilterBar
        direction={direction}
        onDirectionChange={setDirection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={rawTransactions.length}
        filteredCount={filteredTransactions.length}
        currentPage={page}
      />

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-semibold">
          Unable to load transactions. Please try again.
        </div>
      )}

      {/* Transaction Ledger */}
      <TransactionLedger
        transactions={filteredTransactions}
        onSelectTransaction={setSelectedTransaction}
        isLoading={isLoading}
        onClearFilters={() => {
          setDirection("ALL");
          setSearchQuery("");
        }}
      />

      {/* Pagination Controls */}
      {data && (
        <PaginationBar
          page={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={data.size}
          onPageChange={handlePageChange}
        />
      )}

      {/* Slide-Over Inspection Drawer */}
      <TransactionDetailDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};