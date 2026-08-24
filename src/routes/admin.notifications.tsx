import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, Info } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, Person } from "@/components/hr/bits";
import { notifications, type Notice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications Center — WorkHR" },
      { name: "description", content: "Probation expiry alerts and system notices grouped by urgency." },
      { property: "og:title", content: "Notifications Center — WorkHR" },
      { property: "og:description", content: "Probation expiry alerts and system notices grouped by urgency." },
    ],
  }),
  component: NotificationsPage,
});

const groups = [
  { key: "critical", title: "Urgent — 7 days or less", icon: AlertTriangle, tone: "bg-danger-soft text-danger" },
  { key: "warning", title: "Upcoming — within 1 month", icon: Clock, tone: "bg-warning-soft text-warning" },
  { key: "info", title: "General updates", icon: Info, tone: "bg-secondary text-muted-foreground" },
] as const;

function Row({ n, tone }: { n: Notice; tone: string }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <Person name={n.worker} sub={n.when} />
      <p className="text-sm text-muted-foreground">{n.message}</p>
      <span className={cn("ml-auto rounded-full px-2.5 py-1 text-xs font-medium capitalize", tone)}>
        {n.urgency}
      </span>
      <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
        View Worker
      </button>
    </div>
  );
}

function NotificationsPage() {
  return (
    <AdminShell title="Notifications Center">
      <div className="space-y-3">
        {groups.map((g) => {
          const items = notifications.filter((n) => n.urgency === g.key);
          if (!items.length) return null;
          return (
            <Card key={g.key}>
              <div className="mb-2 flex items-center gap-2.5">
                <span className={cn("grid size-8 place-items-center rounded-lg", g.tone)}>
                  <g.icon className="size-4" />
                </span>
                <h2 className="text-base font-semibold">{g.title}</h2>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="divide-y divide-border">
                {items.map((n) => (
                  <Row key={n.id} n={n} tone={g.tone} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
