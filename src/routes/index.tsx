import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, HardHat, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkHR — HR & Payroll Management Dashboard" },
      {
        name: "description",
        content:
          "WorkHR is a clean HR and payroll admin dashboard for worker directories, attendance, payroll runs and reporting.",
      },
      { property: "og:title", content: "WorkHR — HR & Payroll Management Dashboard" },
      {
        property: "og:description",
        content: "Preview the admin and worker dashboards for HR, attendance and payroll management.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">WorkHR</h1>
          <p className="mt-2 text-muted-foreground">
            HR &amp; Payroll Management System — choose a view to preview.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin"
            className="card-surface group p-6 transition-shadow hover:shadow-lg"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Admin View</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Dashboard, worker directory, approvals, attendance, payrolls, reports and settings.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open admin dashboard <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link to="/worker" className="card-surface group p-6 transition-shadow hover:shadow-lg">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-teal">
              <HardHat className="size-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Worker View</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Simple check-in / check-out with location selection and personal attendance history.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Open worker dashboard <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
