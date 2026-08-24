import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Download, Printer, Check, Trash2, Search } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import {
  Card,
  DataTable,
  EmptyRow,
  Field,
  GhostButton,
  Modal,
  Person,
  PrimaryButton,
  SectionTitle,
  StatCard,
  StatusBadge,
  Td,
  Th,
  inputCls,
} from "@/components/hr/bits";
import { PayrollBarChart, DonutChart, donutColors } from "@/components/hr/charts";
import { useHR } from "@/lib/hr-store";
import { addDays, fmtDate, money, money2, todayISO } from "@/lib/hr-utils";
import type { Payroll } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/payrolls")({
  head: () => ({
    meta: [
      { title: "Payrolls — WorkHR" },
      { name: "description", content: "Generate payroll runs from attendance, track deductions and issue payslips." },
      { property: "og:title", content: "Payrolls — WorkHR" },
      { property: "og:description", content: "Generate payroll runs from attendance, track deductions and issue payslips." },
    ],
  }),
  component: PayrollsPage,
});

function NewPayrollForm({ onClose }: { onClose: () => void }) {
  const { workers, previewPayroll, createPayroll, settings } = useHR();
  const [workerId, setWorkerId] = useState(workers[0]?.id ?? "");
  const [from, setFrom] = useState(addDays(todayISO(), -30));
  const [to, setTo] = useState(todayISO());
  const [advance, setAdvance] = useState("0");

  const preview = useMemo(
    () => (workerId ? previewPayroll(workerId, from, to, Number(advance) || 0) : null),
    [workerId, from, to, advance, previewPayroll],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId) return;
    createPayroll(workerId, from, to, Number(advance) || 0);
    onClose();
  };

  return (
    <Modal
      title="New payroll run"
      description="Hours are summed from attendance in the selected period."
      onClose={onClose}
      wide
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Worker" className="sm:col-span-2">
          <select value={workerId} onChange={(e) => setWorkerId(e.target.value)} className={inputCls}>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} — £{w.rate.toFixed(2)}/h
              </option>
            ))}
          </select>
        </Field>
        <Field label="Period from">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Period to">
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Advance taken (£)" hint={`Max advance ${money(settings.maxAdvance)}`}>
          <input
            type="number"
            min="0"
            step="10"
            value={advance}
            onChange={(e) => setAdvance(e.target.value)}
            className={inputCls}
          />
        </Field>

        {preview && (
          <div className="sm:col-span-2 rounded-xl bg-secondary/60 p-4">
            <p className="mb-2 text-sm font-semibold">Calculation preview</p>
            <dl className="grid gap-y-1 text-sm sm:grid-cols-2">
              {[
                ["Hours in period", `${preview.hours.toFixed(2)} h`],
                ["Overtime hours", `${preview.overtime.toFixed(2)} h × ${settings.overtimeMultiplier}`],
                ["Hourly rate", money2(preview.rate)],
                ["Gross pay", money2(preview.gross)],
                [`Tax + NI (${settings.taxRate + settings.niRate}%)`, `-${money2(preview.tax)}`],
                ["Advance", `-${money2(preview.advance)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 pr-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 pr-4 font-semibold">
                <dt>Net pay</dt>
                <dd>{money2(preview.net)}</dd>
              </div>
            </dl>
            {preview.hours === 0 && (
              <p className="mt-2 text-xs text-danger">
                No attendance found in this period — the payroll will be zero.
              </p>
            )}
          </div>
        )}

        <div className="sm:col-span-2 flex justify-end gap-2">
          <GhostButton type="button" onClick={onClose}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit">Generate payroll</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

function Payslip({ p, onClose }: { p: Payroll; onClose: () => void }) {
  const { settings } = useHR();
  return (
    <Modal title="Payslip preview" description={p.id} onClose={onClose}>
      <div className="rounded-xl border border-border p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold">{settings.companyName}</p>
            <p className="text-xs text-muted-foreground">{settings.payrollEmail}</p>
          </div>
          <StatusBadge status={p.status} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Worker", p.worker],
            ["Worker ID", p.workerId],
            ["Period", `${fmtDate(p.from)} – ${fmtDate(p.to)}`],
            ["Issued", fmtDate(p.created)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground">{k}</p>
              <p className="text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          {[
            ["Hours worked", `${p.hours.toFixed(2)} h`],
            ["Hourly rate", money2(p.rate)],
            ["Gross pay", money2(p.gross)],
            ["Tax & NI", `-${money2(p.tax)}`],
            ["Advance deducted", `-${money2(p.advance)}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="flex justify-between pt-1 text-base font-semibold">
            <dt>Net pay</dt>
            <dd>{money2(p.net)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <GhostButton onClick={() => window.print()}>
          <Printer className="size-4" /> Print
        </GhostButton>
        <PrimaryButton onClick={onClose}>Close</PrimaryButton>
      </div>
    </Modal>
  );
}

function PayrollsPage() {
  const { payrolls, payrollChart, deductionsData, totals, setPayrollStatus, deletePayroll } = useHR();
  const [open, setOpen] = useState(false);
  const [slip, setSlip] = useState<Payroll | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = payrolls.filter(
    (p) =>
      (status === "all" || p.status === status) &&
      (!q.trim() || p.worker.toLowerCase().includes(q.trim().toLowerCase()) || p.id.toLowerCase().includes(q.trim().toLowerCase())),
  );

  const deductionTotal = deductionsData.reduce((t, d) => t + d.value, 0);

  return (
    <AdminShell
      title="Payrolls"
      action={
        <button
          onClick={() => setOpen(true)}
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          <Plus className="size-4" /> New Payroll
        </button>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard label="Payroll Cost" value={money(totals.payrollCost)} hint="gross, all runs" />
          <StatCard label="Deductions & Advances" value={money(totals.expenses)} hint="tax, NI, advances" />
          <StatCard
            label="Pending Payments"
            value={money(totals.pending)}
            tone="down"
            hint={`${totals.pendingCount} runs`}
          />
          <StatCard label="Total Payrolls" value={String(payrolls.length)} hint="all time" />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <SectionTitle title="Payroll Cost Overview" action={<span className="text-xs text-muted-foreground">Last 9 months</span>} />
            <PayrollBarChart data={payrollChart} />
          </Card>
          <Card>
            <SectionTitle title="Deductions & Advances" />
            <DonutChart data={deductionsData} total={money(deductionTotal)} label="Totals" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {deductionsData.map((d, i) => (
                <div key={d.name} className="border-l-2 pl-2" style={{ borderColor: donutColors[i] }}>
                  <p className="text-sm font-semibold">{money(d.value)}</p>
                  <p className="text-xs text-muted-foreground">{d.name}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-0">
          <div className="flex flex-wrap items-center gap-3 p-5">
            <h2 className="mr-auto text-base font-semibold">Payroll list ({rows.length})</h2>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search worker"
                className="h-9 w-full rounded-lg sm:w-52 border border-border bg-card pl-9 text-sm outline-none focus:border-primary"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm">
              <Download className="size-4" /> Export
            </button>
          </div>

          <DataTable
            labels={["Payroll ID", "Worker", "Period", "Hours", "Rate", "Gross Pay", "Advance", "Net Pay", "Status", "Action"]}
            head={
              <>
                <Th>Payroll ID</Th>
                <Th>Worker Name</Th>
                <Th>Period</Th>
                <Th>Hours</Th>
                <Th>Rate</Th>
                <Th>Gross Pay</Th>
                <Th>Advance</Th>
                <Th>Net Pay</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </>
            }
          >
            {rows.length === 0 && <EmptyRow colSpan={10} text="No payroll runs yet." />}
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/40">
                <Td className="font-medium">{p.id}</Td>
                <Td><Person name={p.worker} sub={fmtDate(p.created)} /></Td>
                <Td className="whitespace-nowrap text-xs text-muted-foreground">
                  {fmtDate(p.from)} – {fmtDate(p.to)}
                </Td>
                <Td>{p.hours.toFixed(2)} h</Td>
                <Td>{money2(p.rate)}</Td>
                <Td>{money2(p.gross)}</Td>
                <Td className={p.advance ? "text-danger" : "text-muted-foreground"}>
                  {p.advance ? `-${money2(p.advance)}` : "—"}
                </Td>
                <Td className="font-semibold">{money2(p.net)}</Td>
                <Td><StatusBadge status={p.status} /></Td>
                <Td>
                  <div className="flex justify-end gap-1 text-muted-foreground">
                    <button title="View payslip" onClick={() => setSlip(p)} className="rounded-md p-1.5 hover:bg-secondary hover:text-primary">
                      <Printer className="size-4" />
                    </button>
                    {p.status === "Pending" && (
                      <button
                        title="Mark completed"
                        onClick={() => setPayrollStatus(p.id, "Completed")}
                        className="rounded-md p-1.5 hover:bg-secondary hover:text-success"
                      >
                        <Check className="size-4" />
                      </button>
                    )}
                    <button title="Delete" onClick={() => deletePayroll(p.id)} className="rounded-md p-1.5 hover:bg-secondary hover:text-danger">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </div>

      {open && <NewPayrollForm onClose={() => setOpen(false)} />}
      {slip && <Payslip p={slip} onClose={() => setSlip(null)} />}
    </AdminShell>
  );
}
