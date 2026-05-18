import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export const FormErrorMessage = React.forwardRef<HTMLParagraphElement, FormErrorMessageProps>(
  ({ className, message, ...props }, ref) => {
    if (!message) return null;

    return (
      <p
        ref={ref}
        className={cn("flex items-center text-sm font-medium text-danger mt-1", className)}
        {...props}
      >
        <AlertCircle className="mr-1 h-3.5 w-3.5 shrink-0" />
        {message}
      </p>
    );
  }
);
FormErrorMessage.displayName = "FormErrorMessage";
