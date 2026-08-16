import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels,
}) => {
  const progress =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;
  const progressWidth = `${Math.min(100, Math.max(0, progress))}%`;

  return (
    <div
      className="mb-8 select-none"
      role="group"
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      {/* Text label — always visible for screen readers + small screens */}
      <p className="text-xs font-medium text-(--color-muted-foreground) mb-4 text-center">
        Step {currentStep} of {totalSteps}
      </p>

      <div className="relative flex justify-between items-center isolate">
        {/* Track background */}
        <div
          className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-(--color-border) -z-10"
          aria-hidden="true"
        />

        {/* Active progress — width transition matches design system (350ms) */}
        <div
          className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-(--color-primary) -z-10 transition-[width] duration-[350ms] ease-out"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />

        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={stepNum} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  // Size + shape
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  "text-sm font-semibold border transition-all duration-200",
                  // animate-step-complete fires when step becomes active
                  isActive && "animate-step-complete motion-reduce:animate-none",
                  isCompleted
                    // Completed: filled amber gold
                    ? "bg-(--color-primary) border-(--color-primary) text-(--color-primary-fg)"
                    : isActive
                    // Active: outlined amber gold + subtle glow
                    ? "bg-(--color-card) border-(--color-primary) text-(--color-primary) shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                    // Future: muted
                    : "bg-(--color-card) border-(--color-border) text-(--color-subtle-foreground)"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {stepNum}
              </div>

              {/* Label — visible on sm+ */}
              <span
                className={cn(
                  "text-xs font-medium hidden sm:inline whitespace-nowrap",
                  isActive
                    ? "text-(--color-primary)"
                    : isCompleted
                    ? "text-(--color-foreground)"
                    : "text-(--color-subtle-foreground)"
                )}
              >
                {labels[idx]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
