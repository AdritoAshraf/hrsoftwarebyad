import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, MessageCircle, LifeBuoy } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card } from "@/components/hr/bits";

export const Route = createFileRoute("/admin/help")({
  head: () => ({
    meta: [
      { title: "Help & Center — WorkHR" },
      { name: "description", content: "Guides, FAQs and support contacts for the WorkHR admin dashboard." },
      { property: "og:title", content: "Help & Center — WorkHR" },
      { property: "og:description", content: "Guides, FAQs and support contacts for the WorkHR admin dashboard." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  ["How do I approve a new worker?", "Open Registration Approvals, click a row to review the bio-data, then choose Approve."],
  ["How is net pay calculated?", "Gross pay (hours × hourly rate) minus advances and deductions set in Settings."],
  ["When are probation alerts sent?", "30 days and 7 days before the probation end date, configurable in Settings."],
];

function HelpPage() {
  return (
    <AdminShell title="Help & Center">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: "Documentation", desc: "Step-by-step guides for every module." },
            { icon: MessageCircle, title: "Live chat", desc: "Talk to the support team, Mon–Fri 9–6." },
            { icon: LifeBuoy, title: "Raise a ticket", desc: "Report an issue and track its progress." },
          ].map((c) => (
            <Card key={c.title}>
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="mb-2 text-base font-semibold">Frequently asked</h2>
          <div className="divide-y divide-border">
            {faqs.map(([q, a]) => (
              <div key={q} className="py-3.5">
                <p className="text-sm font-medium">{q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
