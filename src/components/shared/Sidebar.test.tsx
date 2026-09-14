import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/features/auth/store/auth-store", () => ({
  useAuthStore: vi.fn((selector) =>
    selector({
      user: { fullName: "Nguyen Van Kien", username: "kienvn", role: "CUSTOMER" },
      logout: vi.fn(),
    }),
  ),
}));

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renders KM Banking brand name", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getByText("KM Banking")).toBeInTheDocument();
  });

  it("renders the five nav items", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("Transfer")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});