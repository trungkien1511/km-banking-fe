import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SkeletonDashboard } from "./SkeletonDashboard";

describe("SkeletonDashboard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonDashboard />);
    expect(container.firstChild).not.toBeNull();
  });

  it("contains shimmer elements (animate-shimmer class)", () => {
    const { container } = render(<SkeletonDashboard />);
    const shimmerEls = container.querySelectorAll(".animate-shimmer");
    expect(shimmerEls.length).toBeGreaterThan(0);
  });

  it("has aria-busy='true' on the container", () => {
    render(<SkeletonDashboard />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });
});