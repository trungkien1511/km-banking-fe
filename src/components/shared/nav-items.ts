import type React from "react";
import {
  SquaresFour,
  CreditCard,
  ArrowsLeftRight,
  Clock,
  Gear,
} from "@phosphor-icons/react";

export interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", to: "/dashboard", icon: SquaresFour },
  { label: "Accounts", to: "/accounts", icon: CreditCard },
  { label: "Transfer", to: "/transfer", icon: ArrowsLeftRight },
  { label: "History", to: "/transactions", icon: Clock },
  { label: "Settings", to: "/settings", icon: Gear },
];
