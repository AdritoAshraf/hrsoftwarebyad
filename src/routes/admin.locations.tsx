import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { AdminShell } from "@/components/hr/admin-shell";
import { Card, Field, GhostButton, Modal, PrimaryButton, inputCls } from "@/components/hr/bits";
import { useHR } from "@/lib/hr-store";
import type { LocationItem } from "@/lib/mock-data";

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

function LocationForm({ editing, onClose }: { editing: LocationItem | null; onClose: () => void }) {
  const { addLocation, updateLocation } = useHR();
  const [name, setName] = useState(editing?.name ?? "");
  const [address, setAddress] = useState(editing?.address ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateLocation(editing.id, { name, address });
    else addLocation(name, address);
    onClose();
  };

  return (
    <Modal
      title={editing ? "Edit location" : "Add location"}
      description="Locations feed the worker check-in dropdown."
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Location name">
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Camden Site" />
        </Field>
        <Field label="Address">
          <input required value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} placeholder="24 Camden High St, London" />
        </Field>
        <div className="flex justify-end gap-2">
          <GhostButton type="button" onClick={onClose}>
            Cancel
          </GhostButton>
          <PrimaryButton type="submit">{editing ? "Save changes" : "Add location"}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

function LocationsPage() {
  const { locations, deleteLocation, workersAt } = useHR();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LocationItem | null>(null);

  const start = (l: LocationItem | null) => {
    setEditing(l);
    setOpen(true);
  };

  return (
    <AdminShell
      title="Locations"
      action={
        <button
          onClick={() => start(null)}
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
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
                <Users className="size-3.5" /> {workersAt(l.name)} workers assigned
              </span>
              <div className="flex gap-1 text-muted-foreground">
                <button onClick={() => start(l)} className="rounded-md p-1.5 hover:bg-secondary hover:text-primary">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => deleteLocation(l.id)} className="rounded-md p-1.5 hover:bg-secondary hover:text-danger">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        <button
          onClick={() => start(null)}
          className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-6" />
          <span className="text-sm font-medium">Add new location</span>
        </button>
      </div>

      {open && (
        <LocationForm
          editing={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
        />
      )}
    </AdminShell>
  );
}
