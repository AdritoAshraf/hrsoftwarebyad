import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Download } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, DataTable, SectionTitle, StatCard, Td, Th } from "@/components/hr/bits";
import { BillingLineChart } from "@/components/hr/charts";
import { billingChart, money } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports — WorkHR" },
      { name: "description", content: "Labour cost, hours worked and client billing performance reports." },
      { property: "og:title", content: "Reports — WorkHR" },
      { property: "og:description", content: "Labour cost, hours worked and client billing performance reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AdminShell
      title="Reports"
      action={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Download className="size-4" /> Export Report
        </button>
      }
    >
      <div className="space-y-3">
        <Card className="flex flex-wrap items-center gap-3 py-3">
          <span className="text-sm font-medium">Filters</span>
          {["01 Aug - 31 Aug 2026", "All Workers", "All Locations"].map((f) => (
            <button key={f} className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground">
              {f} <ChevronDown className="size-4" />
            </button>
          ))}
        </Card>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Total Hours Worked" value="4,182 h" delta="↗ 6%" hint="vs last period" />
          <StatCard label="Total Labour Cost" value={money(29000)} delta="↗ 4%" hint="vs last period" />
          <StatCard label="Profit / Loss" value={money(13400)} delta="↗ 11%" hint="margin 31%" />
        </div>

        <Card>
          <SectionTitle title="Labour Cost vs Client Billing" action={<span className="text-xs text-muted-foreground">Last 6 weeks</span>} />
          <BillingLineChart />
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-base font-semibold">Weekly Breakdown</h2>
            <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm">
              <Download className="size-4" /> Export CSV
            </button>
          </div>
          <DataTable
            head={
              <>
                <Th>Week</Th>
                <Th>Labour Cost</Th>
                <Th>Client Billing</Th>
                <Th>Profit</Th>
                <Th>Margin</Th>
              </>
            }
          >
            {billingChart.map((r) => {
              const profit = r.billing - r.cost;
              return (
                <tr key={r.week} className="hover:bg-secondary/40">
                  <Td className="font-medium">{r.week}</Td>
                  <Td>{money(r.cost)}</Td>
                  <Td>{money(r.billing)}</Td>
                  <Td className="font-semibold text-success">{money(profit)}</Td>
                  <Td>{Math.round((profit / r.billing) * 100)}%</Td>
                </tr>
              );
            })}
          </DataTable>
        </Card>
      </div>
    </AdminShell>
  );
}
