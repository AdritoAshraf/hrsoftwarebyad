import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card } from "@/components/hr/bits";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkHR" },
      { name: "description", content: "Configure default hourly rates, overtime, tax rates and alert timings." },
      { property: "og:title", content: "Settings — WorkHR" },
      { property: "og:description", content: "Configure default hourly rates, overtime, tax rates and alert timings." },
    ],
  }),
  component: SettingsPage,
});

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        defaultValue={value}
        className="mt-1.5 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary"
      />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-0.5 mb-4 text-sm text-muted-foreground">{desc}</p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

function SettingsPage() {
  return (
    <AdminShell
      title="Settings"
      action={
        <button className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          Save changes
        </button>
      }
    >
      <div className="grid max-w-4xl gap-3">
        <Section title="Pay Defaults" desc="Applied to new workers unless overridden on their profile.">
          <Field label="Default hourly rate (£)" value="14.50" />
          <Field label="Overtime multiplier" value="1.5" hint="Applied after 40 hours per week" />
        </Section>

        <Section title="Tax & Deductions" desc="Used when calculating net pay on payroll runs.">
          <Field label="Tax rate (%)" value="20" />
          <Field label="National Insurance (%)" value="12" />
          <Field label="Pension contribution (%)" value="5" />
          <Field label="Max advance per month (£)" value="500" />
        </Section>

        <Section title="Notification Timing" desc="When probation expiry alerts should be raised.">
          <Field label="First reminder (days before)" value="30" />
          <Field label="Final reminder (days before)" value="7" />
        </Section>

        <Section title="Organisation" desc="Basic company details shown on payslips.">
          <Field label="Company name" value="WorkHR Staffing Ltd" />
          <Field label="Payroll contact email" value="payroll@workhr.co.uk" />
        </Section>
      </div>
    </AdminShell>
  );
}
