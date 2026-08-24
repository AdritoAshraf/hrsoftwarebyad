import { createFileRoute } from "@tanstack/react-router";
import { Download, ChevronDown, MoreHorizontal, Users, Wallet, UserPlus, Clock } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, SectionTitle, StatCard, Person } from "@/components/hr/bits";
import { PayrollBarChart, DonutChart } from "@/components/hr/charts";
import { admin, deductions, notifications, money } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — WorkHR" },
      { name: "description", content: "Workforce, payroll cost and probation overview for HR admins." },
      { property: "og:title", content: "Admin Dashboard — WorkHR" },
      { property: "og:description", content: "Workforce, payroll cost and probation overview for HR admins." },
    ],
  }),
  component: Dashboard,
});

const urgencyTone = {
  critical: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  info: "bg-secondary text-muted-foreground",
} as const;

function Dashboard() {
  return (
    <AdminShell title="Dashboard">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="mr-auto text-2xl font-bold tracking-tight">
            Good Morning, {admin.name}
          </h2>
          <button className="card-surface flex h-9 items-center gap-2 px-3 text-sm">
            01 Aug - 31 Aug 2026 <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            <Download className="size-4" /> Export Data
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Active Workers" value="148" delta="↗ 12" hint="this month" icon={<Users className="size-4" />} />
          <StatCard label="Total Payroll Cost" value={money(12500)} delta="↗ 20%" hint="vs last month" icon={<Wallet className="size-4" />} />
          <StatCard label="Pending Registrations" value="4" delta="↗ 2" hint="awaiting review" icon={<UserPlus className="size-4" />} />
          <StatCard label="Workers Expiring Soon" value="6" delta="↘ 3" tone="down" hint="probation" icon={<Clock className="size-4" />} />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <SectionTitle
              title="Payroll Cost Overview"
              action={<button className="text-xs text-muted-foreground">More details ›</button>}
            />
            <PayrollBarChart />
          </Card>

          <Card>
            <SectionTitle title="Advance & Deductions" action={<MoreHorizontal className="size-4 text-muted-foreground" />} />
            <DonutChart data={deductions} total={money(10500)} label="Total" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {deductions.map((d, i) => (
                <div key={d.name} className="border-l-2 pl-2" style={{ borderColor: ["oklch(0.55 0.23 291)", "oklch(0.72 0.12 195)", "oklch(0.84 0.08 291)"][i] }}>
                  <p className="text-sm font-semibold">{money(d.value)}</p>
                  <p className="text-xs text-muted-foreground">{d.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <SectionTitle title="Recent Notifications" action={<button className="text-xs text-muted-foreground">View all ›</button>} />
          <div className="divide-y divide-border">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-center gap-3 py-3">
                <Person name={n.worker} sub={n.when} />
                <p className="ml-4 text-sm text-muted-foreground">{n.message}</p>
                <span className={cn("ml-auto rounded-full px-2.5 py-1 text-xs font-medium capitalize", urgencyTone[n.urgency])}>
                  {n.urgency}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
