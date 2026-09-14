import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { QuickActions } from "./QuickActions";

describe("QuickActions", () => {
  it("renders all four action labels", () => {
    render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>,
    );
    expect(screen.getByText("Transfer")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("Transfer link points to /transfer", () => {
    render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /transfer/i });
    expect(link).toHaveAttribute("href", "/transfer");
  });

  it("all action items are links (not buttons)", () => {
    render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>,
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(4);
  });

  it("icons are aria-hidden", () => {
    const { container } = render(
      <MemoryRouter>
        <QuickActions />
      </MemoryRouter>,
    );
    // All SVG icons inside the component should be aria-hidden
    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });
});