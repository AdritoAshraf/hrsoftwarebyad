import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { avatarUrl } from "@/lib/mock-data";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-surface p-5", className)}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  Active: "bg-success-soft text-success",
  Completed: "bg-success-soft text-success",
  Approved: "bg-success-soft text-success",
  "Full-time": "bg-success-soft text-success",
  Pending: "bg-warning-soft text-warning",
  "On Leave": "bg-warning-soft text-warning",
  Expired: "bg-danger-soft text-danger",
  Rejected: "bg-danger-soft text-danger",
  Self: "bg-primary-soft text-primary",
  Admin: "bg-secondary text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        badgeTones[status] ?? "bg-secondary text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function Person({ name, sub }: { name: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={avatarUrl(name)} alt={name} className="size-8 rounded-full bg-secondary" />
      <div className="leading-tight">
        <div className="text-sm font-medium">{name}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  tone = "up",
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
  tone?: "up" | "down";
  icon?: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {delta && (
          <span
            className={cn(
              "mb-1 rounded-full px-2 py-0.5 text-xs font-medium",
              tone === "up" ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
            )}
          >
            {delta}
          </span>
        )}
        {hint && <span className="mb-1 text-xs text-muted-foreground">{hint}</span>}
      </div>
    </Card>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("px-4 py-3 text-left text-xs font-medium text-muted-foreground", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 text-sm", className)}>{children}</td>;
}

export function DataTable({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-secondary/70">
          <tr>{head}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
