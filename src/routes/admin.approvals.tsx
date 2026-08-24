import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, FileImage, ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, DataTable, Person, StatusBadge, Td, Th } from "@/components/hr/bits";
import { applications, avatarUrl, type Application } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({
    meta: [
      { title: "Registration Approvals — WorkHR" },
      { name: "description", content: "Review pending worker applications and approve or reject bio-data submissions." },
      { property: "og:title", content: "Registration Approvals — WorkHR" },
      { property: "og:description", content: "Review pending worker applications and approve or reject bio-data submissions." },
    ],
  }),
  component: Approvals,
});

function Detail({ app, onBack }: { app: Application; onBack: () => void }) {
  return (
    <Card>
      <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to applications
      </button>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="text-center">
          <img src={avatarUrl(app.name)} alt={app.name} className="mx-auto size-32 rounded-2xl bg-secondary" />
          <h2 className="mt-4 text-lg font-semibold">{app.name}</h2>
          <p className="text-sm text-muted-foreground">{app.appliedFor}</p>
          <div className="mt-3 flex justify-center"><StatusBadge status="Pending" /></div>
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Application ID", app.id],
              ["Submitted", app.submitted],
              ["Phone", app.phone],
              ["Email", app.email],
              ["Address", app.address],
              ["NID Number", app.nid],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary/60 p-3">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="mt-0.5 text-sm font-medium">{v}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 mb-2 text-sm font-semibold">Uploaded documents</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {["NID Front", "NID Back"].map((d) => (
              <div key={d} className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 text-muted-foreground">
                <FileImage className="size-6" />
                <span className="text-xs">{d} preview</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">
              <Check className="size-4" /> Approve
            </button>
            <button className="flex h-10 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-danger">
              <X className="size-4" /> Reject
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Approvals() {
  const [selected, setSelected] = useState<Application | null>(null);

  return (
    <AdminShell title="Registration Approvals">
      {selected ? (
        <Detail app={selected} onBack={() => setSelected(null)} />
      ) : (
        <Card className="p-0">
          <div className="flex items-center justify-between p-5">
            <h2 className="text-base font-semibold">Pending Applications ({applications.length})</h2>
            <p className="text-xs text-muted-foreground">Click a row to view full bio-data</p>
          </div>
          <DataTable
            head={
              <>
                <Th>Application ID</Th>
                <Th>Applicant</Th>
                <Th>Applied For</Th>
                <Th>Submitted</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </>
            }
          >
            {applications.map((a) => (
              <tr key={a.id} className="cursor-pointer hover:bg-secondary/40" onClick={() => setSelected(a)}>
                <Td className="font-medium">{a.id}</Td>
                <Td><Person name={a.name} sub={a.email} /></Td>
                <Td>{a.appliedFor}</Td>
                <Td>{a.submitted}</Td>
                <Td><StatusBadge status="Pending" /></Td>
                <Td>
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button className="flex h-8 items-center gap-1.5 rounded-lg bg-success-soft px-3 text-xs font-medium text-success">
                      <Check className="size-3.5" /> Approve
                    </button>
                    <button className="flex h-8 items-center gap-1.5 rounded-lg bg-danger-soft px-3 text-xs font-medium text-danger">
                      <X className="size-3.5" /> Reject
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Card>
      )}
    </AdminShell>
  );
}
