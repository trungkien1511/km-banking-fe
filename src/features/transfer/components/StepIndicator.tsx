import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

function Connector({
  filled,
  index,
}: {
  filled: boolean;
  index: number;
}) {
  return (
    <div
      className="relative flex-1 h-px mx-2 bg-border overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 right-0 bg-primary origin-left",
          "transition-transform duration-(--duration-slow) ease-(--easing-standard)",
          "motion-reduce:transition-none",
          filled ? "scale-x-100" : "scale-x-0",
        )}
        style={{ transitionDelay: filled ? `${index * 45}ms` : "0ms" }}
      />
    </div>
  );
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels,
}) => {
  return (
    <div
      className="mb-8 select-none"
      role="group"
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      {/* Text label — always visible for screen readers + small screens */}
      <p className="text-xs font-medium text-muted-foreground mb-4 text-center">
        Step {currentStep} of {totalSteps}
      </p>

      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={stepNum}>
              {idx > 0 && <Connector filled={isCompleted} index={idx - 1} />}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    "text-sm font-semibold border transition-colors duration-(--duration-normal)",
                    isActive && "animate-step-active motion-reduce:animate-none",
                    isCompleted
                      ? "bg-primary border-primary text-primary-fg"
                      : isActive
                        ? "bg-card border-primary text-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                        : "bg-card border-border text-subtle-foreground",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {stepNum}
                </div>

                <span
                  className={cn(
                    "text-xs font-medium hidden sm:inline whitespace-nowrap",
                    "transition-colors duration-(--duration-normal)",
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-subtle-foreground",
                  )}
                >
                  {labels[idx]}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};