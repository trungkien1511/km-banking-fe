import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarningCircle, ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import type { LoginFormData } from "@/features/auth/types/login.types";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/services/api-client";

export const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();

  const serverError = error
    ? ((error as unknown as ApiError).formattedMessage ?? error.message)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", rememberMe: false },
  });

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      login({ identifier: data.identifier, password: data.password });
    },
    [login],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Sign in form"
    >
      {serverError && (
        <div
          role="alert"
          className="animate-error-in flex items-start gap-2.5 rounded-lg border px-4 py-3 border-destructive/25 bg-destructive/10"
        >
          <WarningCircle
            size={16}
            className="mt-0.5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p className="text-sm text-destructive leading-snug">{serverError}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-foreground"
        >
          Phone number or email
        </label>
        <Input
          id="identifier"
          type="text"
          autoComplete="username"
          autoFocus
          spellCheck={false}
          placeholder="0912 345 678 or name@example.com"
          error={!!errors.identifier}
          disabled={isPending}
          aria-describedby={errors.identifier ? "identifier-err" : undefined}
          {...register("identifier")}
        />
        {errors.identifier && (
          <FormErrorMessage
            id="identifier-err"
            role="alert"
            className="animate-error-in"
            message={errors.identifier.message}
          />
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Password
          </label>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:text-primary-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={!!errors.password}
          disabled={isPending}
          aria-describedby={errors.password ? "password-err" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <FormErrorMessage
            id="password-err"
            role="alert"
            className="animate-error-in"
            message={errors.password.message}
          />
        )}
      </div>

      <Checkbox
        id="rememberMe"
        label="Keep me signed in"
        disabled={isPending}
        {...register("rememberMe")}
      />

      {/* --color-primary token adapts: navy in light-context, gold in dark shell */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "relative w-full h-11 rounded-lg font-semibold text-sm",
          "flex items-center justify-center gap-2",
          "bg-primary text-primary-fg",
          "hover:bg-primary-hover",
          "transition-[transform,box-shadow,background-color,opacity] duration-150",
          "active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-60",
          "shadow-sm hover:shadow-md",
        )}
      >
        {isPending ? (
          <>
            <CircleNotch
              size={16}
              className="animate-spin"
              aria-hidden="true"
            />
            <span>Signing in…</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
      </button>

      {/* Screen reader announcement for loading state */}
      {isPending && (
        <div aria-live="polite" className="sr-only">
          Signing in, please wait…
        </div>
      )}
    </form>
  );
};
