import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/features/dashboard/store/dashboard-store", () => ({
  useTotalBalance: vi.fn().mockReturnValue(15750000),
  useDashboardStore: vi.fn((selector) =>
    selector({ lastUpdated: Date.now() }),
  ),
}));

import { TotalBalanceCard } from "./TotalBalanceCard";

describe("TotalBalanceCard", () => {
  it("renders 'Available Balance' label", () => {
    render(
      <MemoryRouter>
        <TotalBalanceCard />
      </MemoryRouter>,
    );
    expect(screen.getByText("Available Balance")).toBeInTheDocument();
  });

  it("renders balance formatted as VND", () => {
    render(
      <MemoryRouter>
        <TotalBalanceCard />
      </MemoryRouter>,
    );
    // 15,750,000 VND formatted by vi-VN locale contains "15.750.000"
    expect(screen.getByLabelText(/15.750.000/)).toBeInTheDocument();
  });

  it("hide/show toggle changes aria-label", async () => {
    const { getByRole } = render(
      <MemoryRouter>
        <TotalBalanceCard />
      </MemoryRouter>,
    );
    const btn = getByRole("button", { name: /hide balance/i });
    expect(btn).toBeInTheDocument();
  });
});