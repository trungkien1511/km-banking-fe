import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

// rendering-hoist-jsx: orientation class strings are static — defined outside component.
const ORIENTATION_CLASS = {
  horizontal: "h-[1px] w-full",
  vertical: "h-full w-[1px]",
} as const;

export const Divider: React.FC<DividerProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        // CSS var — works in both dark shell and .light-context panel
        "shrink-0 bg-border",
        ORIENTATION_CLASS[orientation],
        className,
      )}
      {...props}
    />
  );
};
