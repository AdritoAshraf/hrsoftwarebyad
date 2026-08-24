import { createFileRoute } from "@tanstack/react-router";
import { Plus, ChevronDown, Pencil } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, DataTable, Person, StatusBadge, Td, Th, StatCard } from "@/components/hr/bits";
import { attendance } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — WorkHR" },
      { name: "description", content: "Daily check-in and check-out records per worker, location and source." },
      { property: "og:title", content: "Attendance — WorkHR" },
      { property: "og:description", content: "Daily check-in and check-out records per worker, location and source." },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  return (
    <AdminShell
      title="Attendance"
      action={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" /> Add Entry
        </button>
      }
    >
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Checked In Today" value="132" delta="↗ 8" hint="workers" />
          <StatCard label="Average Hours / Day" value="8.7h" delta="↗ 0.3h" hint="this week" />
          <StatCard label="Missing Check-Outs" value="3" delta="↘ 1" tone="down" hint="needs review" />
        </div>

        <Card className="p-0">
          <div className="flex flex-wrap items-center gap-3 p-5">
            <h2 className="mr-auto text-base font-semibold">Attendance Log</h2>
            <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm">
              01 Aug - 31 Aug 2026 <ChevronDown className="size-4 text-muted-foreground" />
            </button>
            <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground">
              All Workers <ChevronDown className="size-4" />
            </button>
          </div>

          <DataTable
            head={
              <>
                <Th>Worker</Th>
                <Th>Date</Th>
                <Th>Check-In</Th>
                <Th>Check-Out</Th>
                <Th>Location</Th>
                <Th>Total Hours</Th>
                <Th>Source</Th>
                <Th className="text-right">Action</Th>
              </>
            }
          >
            {attendance.map((a) => (
              <tr key={a.id} className="hover:bg-secondary/40">
                <Td><Person name={a.worker} /></Td>
                <Td>{a.date}</Td>
                <Td>{a.in}</Td>
                <Td>{a.out}</Td>
                <Td>{a.location}</Td>
                <Td className="font-medium">{a.hours.toFixed(2)} h</Td>
                <Td><StatusBadge status={a.source} /></Td>
                <Td>
                  <div className="flex justify-end">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary">
                      <Pencil className="size-4" />
                    </button>
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
