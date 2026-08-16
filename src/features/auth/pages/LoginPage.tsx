import { LoginForm } from "../components/LoginForm";
import { AppLogo } from "@/components/shared/AppLogo";
import { ShieldCheck, Lightning, Globe } from "@phosphor-icons/react";

// rendering-hoist-jsx: module-level — never re-created on re-renders
const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    label: "Bank-grade encryption",
    sub: "256-bit SSL protection",
  },
  { icon: Lightning, label: "Instant transfers", sub: "Real-time settlement" },
  { icon: Globe, label: "24/7 availability", sub: "Always-on infrastructure" },
] as const;

export const LoginPage = () => {
  return (
    <main className="min-h-dvh w-full grid lg:grid-cols-2">
      {/* ── LEFT: Dark brand panel (desktop only, decorative) ─────────────── */}
      <section
        className="
          hidden lg:flex flex-col justify-between
          relative overflow-hidden
          bg-(--color-background) text-(--color-foreground)
          px-14 py-12
        "
        aria-hidden="true"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/login-banner.jpg')" }}
          role="presentation"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-(--color-background)/60 via-(--color-background)/40 to-(--color-background)/80" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <AppLogo variant="light" />

          <div className="animate-fade-slide-up animation-delay-100">
            <p className="text-xs font-mono tracking-[0.18em] uppercase text-(--color-primary) mb-4 select-none">
              Secure Digital Banking
            </p>
            <p className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-(--color-foreground) max-w-sm text-balance">
              Modern banking, built for{" "}
              <span className="text-(--color-primary)">clarity.</span>
            </p>
            <p className="mt-5 text-[15px] text-(--color-foreground)/50 leading-relaxed max-w-xs">
              Manage your accounts, track every transaction, and move money with
              confidence.
            </p>
          </div>

          <div className="animate-fade-slide-up animation-delay-300 space-y-3">
            <p className="text-[11px] font-mono tracking-widest uppercase text-(--color-foreground)/30 mb-4 select-none">
              Why customers trust us
            </p>
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-(--color-foreground)/5 border border-(--color-foreground)/10 flex items-center justify-center transition-colors group-hover:bg-(--color-foreground)/10">
                  <Icon
                    size={16}
                    className="text-(--color-primary)"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-(--color-foreground)/80 leading-none">
                    {label}
                  </p>
                  <p className="text-xs text-(--color-foreground)/35 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RIGHT: Form panel — white background, light context ───────────── */}
      {/*
       * .light-context restores light-mode tokens on this section only.
       * bg-white is explicit — guarantees white even if token resolves differently.
       * All text uses --color-foreground / --color-muted-foreground tokens
       * which .light-context maps to dark values (#020617 / #475569).
       */}
      <section
        className="
          light-context
          flex flex-col justify-center items-center
          min-h-dvh lg:min-h-0
          bg-white
          px-6 py-12 sm:px-10
        "
      >
        {/* Logo — mobile only (left panel is hidden on mobile) */}
        <div className="lg:hidden mb-10 self-start">
          <AppLogo variant="dark" />
        </div>

        <div className="w-full max-w-sm animate-fade-slide-up">
          <div className="mb-8">
            {/*
             * h1 is the page title for screen readers.
             * Left panel is aria-hidden so this is the only heading.
             * text-balance prevents a widow on narrow screens.
             */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-[11px] text-subtle-foreground leading-relaxed">
            Protected by 256-bit TLS encryption.
            <br />
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()} KM BANK. All rights reserved.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
};
