import { createFileRoute } from "@tanstack/react-router";
import { Plus, ChevronDown, Download, Printer, MoreVertical, Search, MoreHorizontal } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, DataTable, Person, SectionTitle, StatCard, StatusBadge, Td, Th } from "@/components/hr/bits";
import { PayrollBarChart, DonutChart } from "@/components/hr/charts";
import { payrolls, deductions, gross, net, money, money2 } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/payrolls")({
  head: () => ({
    meta: [
      { title: "Payrolls — WorkHR" },
      { name: "description", content: "Payroll runs, costs, deductions and payslip status for every worker." },
      { property: "og:title", content: "Payrolls — WorkHR" },
      { property: "og:description", content: "Payroll runs, costs, deductions and payslip status for every worker." },
    ],
  }),
  component: PayrollsPage,
});

function PayrollsPage() {
  return (
    <AdminShell
      title="Payrolls"
      action={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" /> New Payroll
        </button>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button className="card-surface mr-auto flex h-9 items-center gap-2 px-3 text-sm">
            01 Aug - 31 Aug 2026 <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
            <Download className="size-4" /> Export
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Payroll Cost" value={money(12500)} delta="↗ 20%" hint="last month" />
          <StatCard label="Total Expense" value={money(2560)} delta="↗ 0.1%" hint="last month" />
          <StatCard label="Pending Payments" value={money(4700)} delta="↘ 5" tone="down" hint="3 workers" />
          <StatCard label="Total Payrolls" value="200" delta="↗ 10" hint="new this month" />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <SectionTitle title="Payroll Cost Overview" action={<button className="text-xs text-muted-foreground">More details ›</button>} />
            <PayrollBarChart />
          </Card>
          <Card>
            <SectionTitle title="Deductions & Advances" action={<MoreHorizontal className="size-4 text-muted-foreground" />} />
            <DonutChart data={deductions} total={money(10500)} label="Totals" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="border-l-2 border-primary pl-2">
                <p className="text-sm font-semibold">{money(5100)}</p>
                <p className="text-xs text-muted-foreground">Advances</p>
              </div>
              <div className="border-l-2 border-teal pl-2">
                <p className="text-sm font-semibold">{money(5400)}</p>
                <p className="text-xs text-muted-foreground">Tax & Other</p>
              </div>
            </div>
            <button className="mt-4 h-9 w-full rounded-lg border border-border text-sm">More details</button>
          </Card>
        </div>

        <Card className="p-0">
          <div className="flex flex-wrap items-center gap-3 p-5">
            <h2 className="mr-auto text-base font-semibold">Payroll list</h2>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <input placeholder="Search worker" className="h-9 w-52 rounded-lg border border-border bg-card pl-9 text-sm outline-none focus:border-primary" />
            </div>
            <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground">
              All Status <ChevronDown className="size-4" />
            </button>
          </div>

          <DataTable
            head={
              <>
                <Th>Payroll ID</Th>
                <Th>Worker Name</Th>
                <Th>Hours</Th>
                <Th>Hourly Rate</Th>
                <Th>Gross Pay</Th>
                <Th>Advance</Th>
                <Th>Net Pay</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </>
            }
          >
            {payrolls.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/40">
                <Td className="font-medium">{p.id}</Td>
                <Td><Person name={p.worker} sub={p.date} /></Td>
                <Td>{p.hours} h</Td>
                <Td>{money2(p.rate)}</Td>
                <Td>{money2(gross(p))}</Td>
                <Td className={p.advance ? "text-danger" : "text-muted-foreground"}>{p.advance ? `-${money2(p.advance)}` : "—"}</Td>
                <Td className="font-semibold">{money2(net(p))}</Td>
                <Td><StatusBadge status={p.status} /></Td>
                <Td>
                  <div className="flex justify-end gap-1 text-muted-foreground">
                    <button className="rounded-md p-1.5 hover:bg-secondary"><Printer className="size-4" /></button>
                    <button className="rounded-md p-1.5 hover:bg-secondary"><MoreVertical className="size-4" /></button>
                  </div>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </div>
    </AdminShell>
  );
}
