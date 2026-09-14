import { describe, it, expect, vi, beforeEach } from "vitest";
import { maskAccountNumber, formatDateGroup } from "./format";

describe("maskAccountNumber", () => {
  it("masks middle digits, showing first 4 and last 4", () => {
    expect(maskAccountNumber("970422000001234")).toBe("9704 •••• 1234");
  });

  it("handles exactly 8-char input (no middle)", () => {
    expect(maskAccountNumber("12345678")).toBe("1234 •••• 5678");
  });

  it("handles short strings gracefully — returns as-is if less than 8 chars", () => {
    expect(maskAccountNumber("123")).toBe("123");
  });
});

describe("formatDateGroup", () => {
  beforeEach(() => {
    // Pin current time to 2026-09-14T10:00:00 UTC+7
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T03:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Today' for a date string that is today", () => {
    expect(formatDateGroup("2026-09-14T08:30:00.000Z")).toBe("Today");
  });

  it("returns 'Yesterday' for a date string that is yesterday", () => {
    expect(formatDateGroup("2026-09-13T08:30:00.000Z")).toBe("Yesterday");
  });

  it("returns formatted date string for older dates", () => {
    const result = formatDateGroup("2026-09-10T08:30:00.000Z");
    // Should contain day and month in English
    expect(result).toMatch(/10/);
    expect(result).toMatch(/September/);
  });
});