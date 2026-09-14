import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the store — we control data, don't need a real Zustand provider
vi.mock("@/features/dashboard/store/dashboard-store", () => ({
  useRecentTransactions: vi.fn(),
}));

import { useRecentTransactions } from "@/features/dashboard/store/dashboard-store";
import { CompletedTransactionSection } from "./CompletedTransactionSection";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

const mockUseRecentTransactions = useRecentTransactions as ReturnType<typeof vi.fn>;

const makeTxn = (id: string, createdAt: string): Transaction => ({
  id,
  referenceNumber: `REF-${id}`,
  amount: 100000,
  fee: 0,
  currency: "VND",
  transactionType: "TRANSFER",
  direction: "OUT",
  status: "COMPLETED",
  description: `Transaction ${id}`,
  createdAt,
  valueDate: createdAt.slice(0, 10),
});

describe("CompletedTransactionSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T03:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders 'Today' group header for today's transactions", () => {
    mockUseRecentTransactions.mockReturnValue([
      makeTxn("1", "2026-09-14T08:00:00.000Z"),
    ]);

    render(
      <MemoryRouter>
        <CompletedTransactionSection />
      </MemoryRouter>,
    );

    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders 'Yesterday' group header for yesterday's transactions", () => {
    mockUseRecentTransactions.mockReturnValue([
      makeTxn("1", "2026-09-13T08:00:00.000Z"),
    ]);

    render(
      <MemoryRouter>
        <CompletedTransactionSection />
      </MemoryRouter>,
    );

    expect(screen.getByText("Yesterday")).toBeInTheDocument();
  });

  it("renders two group headers when transactions span two days", () => {
    mockUseRecentTransactions.mockReturnValue([
      makeTxn("1", "2026-09-14T08:00:00.000Z"),
      makeTxn("2", "2026-09-13T08:00:00.000Z"),
    ]);

    render(
      <MemoryRouter>
        <CompletedTransactionSection />
      </MemoryRouter>,
    );

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
  });

  it("renders empty state when no transactions", () => {
    mockUseRecentTransactions.mockReturnValue([]);

    render(
      <MemoryRouter>
        <CompletedTransactionSection />
      </MemoryRouter>,
    );

    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });
});