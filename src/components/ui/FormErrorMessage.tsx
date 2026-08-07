import React from "react";
import { AlertCircle } from "lucide-react";
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
        // CSS var: dark shell = #F85149, light-context = #B91C1C
        "text-danger",
        className,
      )}
      {...props}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
});
FormErrorMessage.displayName = "FormErrorMessage";
