import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { TransactionCard } from "./TransactionCard";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

const BASE_TRANSACTION: Transaction = {
  id: "txn-1",
  referenceNumber: "REF001",
  amount: 500000,
  fee: 0,
  currency: "VND",
  transactionType: "TRANSFER",
  direction: "OUT",
  status: "COMPLETED",
  description: "Test transfer",
  createdAt: "2026-09-14T08:00:00.000Z",
  valueDate: "2026-09-14",
};

describe("TransactionCard", () => {
  it("renders visible status text for COMPLETED", () => {
    render(
      <MemoryRouter>
        <TransactionCard transaction={BASE_TRANSACTION} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders visible status text for PENDING", () => {
    render(
      <MemoryRouter>
        <TransactionCard
          transaction={{ ...BASE_TRANSACTION, status: "PENDING" }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders visible status text for FAILED", () => {
    render(
      <MemoryRouter>
        <TransactionCard
          transaction={{ ...BASE_TRANSACTION, status: "FAILED" }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders visible status text for CANCELLED", () => {
    render(
      <MemoryRouter>
        <TransactionCard
          transaction={{ ...BASE_TRANSACTION, status: "CANCELLED" }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("status text is not aria-hidden", () => {
    render(
      <MemoryRouter>
        <TransactionCard transaction={BASE_TRANSACTION} />
      </MemoryRouter>,
    );
    const statusEl = screen.getByText("Completed");
    expect(statusEl).not.toHaveAttribute("aria-hidden", "true");
  });
});