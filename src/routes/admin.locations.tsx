import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card } from "@/components/hr/bits";
import { locations } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/locations")({
  head: () => ({
    meta: [
      { title: "Locations — WorkHR" },
      { name: "description", content: "Manage the work locations workers can check in to." },
      { property: "og:title", content: "Locations — WorkHR" },
      { property: "og:description", content: "Manage the work locations workers can check in to." },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <AdminShell
      title="Locations"
      action={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Plus className="size-4" /> Add Location
        </button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {locations.map((l) => (
          <Card key={l.id}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <MapPin className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{l.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{l.address}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5" /> {l.workers} workers assigned
              </span>
              <div className="flex gap-1 text-muted-foreground">
                <button className="rounded-md p-1.5 hover:bg-secondary"><Pencil className="size-4" /></button>
                <button className="rounded-md p-1.5 hover:bg-secondary hover:text-danger"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </Card>
        ))}

        <button className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Plus className="size-6" />
          <span className="text-sm font-medium">Add new location</span>
        </button>
      </div>
    </AdminShell>
  );
}
