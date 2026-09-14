import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { loginSchema } from "@/features/auth/schemas/login-schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import type { LoginFormData } from "@/features/auth/types/login.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormErrorMessage } from "@/components/ui/FormErrorMessage";
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
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
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

      {/* Uses the shared Button component — isLoading shows spinner + disables.
          --color-primary adapts via .light-context: navy on login panel, gold in app shell. */}
      <Button
        type="submit"
        isLoading={isPending}
        disabled={isPending}
        className="w-full"
      >
        {!isPending && (
          <>
            <span>Sign in</span>
            <ArrowRight size={16} aria-hidden="true" />
          </>
        )}
        {isPending && <span>Signing in…</span>}
      </Button>

      {/* Screen reader announcement for loading state */}
      {isPending && (
        <div aria-live="polite" className="sr-only">
          Signing in, please wait…
        </div>
      )}
    </form>
  );
};
