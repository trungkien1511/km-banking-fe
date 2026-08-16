import React from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(({ className, message, ...props }, ref) => {
  // rendering-conditional-render: ternary not && — avoids "0" render bug
  if (!message) return null;

  return (
    <p
      ref={ref}
      className={cn(
        "flex items-center gap-1 mt-1",
        "text-sm font-medium",
        // Semantic token: --color-destructive in both dark shell and light-context
        "text-destructive",
        className,
      )}
      {...props}
    >
      <WarningCircle size={14} className="shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
});
FormErrorMessage.displayName = "FormErrorMessage";
