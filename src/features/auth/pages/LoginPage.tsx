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

// js-cache-function-results: hoisted — constant within a session
const CURRENT_YEAR = new Date().getFullYear();

export const LoginPage = () => {
  return (
    <main className="min-h-dvh w-full grid lg:grid-cols-2">
      <section
        className="
          hidden lg:flex flex-col justify-between
          relative overflow-hidden
          bg-background text-foreground
          px-14 py-12
        "
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('/login-banner.jpg')" }}
          role="presentation"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/40 to-background/80" />
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
            <p className="text-sm font-mono tracking-[0.18em] uppercase text-primary mb-4 select-none">
              Secure Digital Banking
            </p>
            <p className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-foreground max-w-sm text-balance">
              Modern banking, built for{" "}
              <span className="text-primary">clarity.</span>
            </p>
            <p className="mt-5 text-base text-foreground/70 leading-relaxed max-w-xs">
              Manage your accounts, track every transaction, and move money with
              confidence.
            </p>
          </div>

          <div className="animate-fade-slide-up animation-delay-300 space-y-3">
            <p className="text-sm font-mono tracking-widest uppercase text-foreground/50 mb-4 select-none">
              Why customers trust us
            </p>
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center transition-colors group-hover:bg-foreground/10">
                  <Icon
                    size={16}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80 leading-none">
                    {label}
                  </p>
                  <p className="text-sm text-foreground/60 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form panel — light-context (white bg, light-mode tokens) */}
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
            {/* Screen-reader page title; left panel is aria-hidden so this is the only heading */}
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to access your account
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-muted-foreground leading-relaxed">
            Protected by 256-bit TLS encryption.
            <br />
            <span className="text-muted-foreground">
              &copy; {CURRENT_YEAR} KM BANK. All rights reserved.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
};
