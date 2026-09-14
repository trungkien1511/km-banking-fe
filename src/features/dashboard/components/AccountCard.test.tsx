import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { AccountCard } from "./AccountCard";
import type { Account } from "@/features/dashboard/types/dashboard.types";

const BASE_ACCOUNT: Account = {
  id: "acc-1",
  accountNumber: "970422000001234",
  accountType: "PRIMARY",
  balance: 5000000,
  availableBalance: 5000000,
  currency: "VND",
  status: "ACTIVE",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("AccountCard", () => {
  it("displays masked account number instead of full number", () => {
    render(
      <MemoryRouter>
        <AccountCard account={BASE_ACCOUNT} />
      </MemoryRouter>,
    );
    // Masked format should appear
    expect(screen.getByText("9704 •••• 1234")).toBeInTheDocument();
    // Full raw number must NOT appear
    expect(screen.queryByText("970422000001234")).not.toBeInTheDocument();
  });

  it("has translate='no' on the account number element", () => {
    render(
      <MemoryRouter>
        <AccountCard account={BASE_ACCOUNT} />
      </MemoryRouter>,
    );
    const numEl = screen.getByText("9704 •••• 1234");
    expect(numEl).toHaveAttribute("translate", "no");
  });
});