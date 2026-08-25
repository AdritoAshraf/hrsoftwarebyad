import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, AlertCircle, LogIn } from "lucide-react";
import { inputCls } from "@/components/hr/bits";
import { useHR } from "@/lib/hr-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Log In — WorkHR HR & Payroll" },
      {
        name: "description",
        content:
          "Sign in to WorkHR to manage workers, attendance and payroll, or to check in and out of your shift.",
      },
      { property: "og:title", content: "Log In — WorkHR HR & Payroll" },
      {
        property: "og:description",
        content: "Sign in to WorkHR to manage workers, attendance and payroll.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, session, authReady } = useHR();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authReady && session) {
      void navigate({ to: session.role === "admin" ? "/admin" : "/worker", replace: true });
    }
  }, [authReady, session, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = login(email, password);
    if (!s) {
      setError("Invalid email or password.");
      return;
    }
    setError(null);
    void navigate({ to: s.role === "admin" ? "/admin" : "/worker", replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">WorkHR</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your HR &amp; Payroll workspace.
          </p>
        </div>

        <form onSubmit={submit} className="card-surface space-y-4 p-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute top-3 left-3 size-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@workhr.com"
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute top-3 left-3 size-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger">
              <AlertCircle className="size-4 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <LogIn className="size-4" /> Log In
          </button>

          <div className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo accounts</p>
            <p className="mt-1">Admin — admin@workhr.com / admin123</p>
            <p>Worker — worker@workhr.com / worker123</p>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Applying for work?{" "}
          <Link to="/register" className="font-medium text-primary">
            Complete the registration form
          </Link>
        </p>
      </div>
    </div>
  );
}
