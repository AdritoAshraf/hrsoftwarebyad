import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, ChevronDown, MoreVertical, Eye } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, DataTable, Person, StatusBadge, Td, Th } from "@/components/hr/bits";
import { workers } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/workers")({
  head: () => ({
    meta: [
      { title: "Worker Directory — WorkHR" },
      { name: "description", content: "Browse every worker with contact details, location, joining date and status." },
      { property: "og:title", content: "Worker Directory — WorkHR" },
      { property: "og:description", content: "Browse every worker with contact details, location, joining date and status." },
    ],
  }),
  component: WorkerDirectory,
});

function Filter({ label }: { label: string }) {
  return (
    <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground">
      {label} <ChevronDown className="size-4" />
    </button>
  );
}

function WorkerDirectory() {
  return (
    <AdminShell title="Worker Directory">
      <Card className="p-0">
        <div className="flex flex-wrap items-center gap-3 p-5">
          <h2 className="mr-auto text-base font-semibold">All Workers ({workers.length})</h2>
          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <input
              placeholder="Search worker"
              className="h-9 w-56 rounded-lg border border-border bg-card pl-9 text-sm outline-none focus:border-primary"
            />
          </div>
          <Filter label="All Status" />
          <Filter label="All Locations" />
          <Filter label="Joining Month" />
          <button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm">
            <Download className="size-4" /> Export
          </button>
        </div>

        <DataTable
          head={
            <>
              <Th>Worker ID</Th>
              <Th>Name</Th>
              <Th>Phone / Email</Th>
              <Th>Location</Th>
              <Th>Joining Date</Th>
              <Th>Status</Th>
              <Th className="text-right">Action</Th>
            </>
          }
        >
          {workers.map((w) => (
            <tr key={w.id} className="hover:bg-secondary/40">
              <Td className="font-medium">{w.id}</Td>
              <Td><Person name={w.name} sub={w.role} /></Td>
              <Td>
                <div className="leading-tight">
                  <p>{w.phone}</p>
                  <p className="text-xs text-muted-foreground">{w.email}</p>
                </div>
              </Td>
              <Td>{w.location}</Td>
              <Td>{w.joined}</Td>
              <Td><StatusBadge status={w.status} /></Td>
              <Td>
                <div className="flex justify-end gap-1 text-muted-foreground">
                  <button className="rounded-md p-1.5 hover:bg-secondary"><Eye className="size-4" /></button>
                  <button className="rounded-md p-1.5 hover:bg-secondary"><MoreVertical className="size-4" /></button>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </AdminShell>
  );
}
