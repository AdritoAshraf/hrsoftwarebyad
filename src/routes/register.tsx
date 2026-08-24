import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";
import { Card, Field, PrimaryButton, inputCls } from "@/components/hr/bits";
import { useHR } from "@/lib/hr-store";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Worker Registration — WorkHR" },
      { name: "description", content: "Submit your bio-data to apply for work. Applications go straight to the HR approvals queue." },
      { property: "og:title", content: "Worker Registration — WorkHR" },
      { property: "og:description", content: "Submit your bio-data to apply for work. Applications go straight to the HR approvals queue." },
    ],
  }),
  component: RegisterPage,
});

const roles = ["Site Operative", "Packer", "Forklift Driver", "Cleaner", "Quality Checker", "Team Lead"];

function RegisterPage() {
  const { submitApplication, locations, settings } = useHR();
  const [done, setDone] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    nid: "",
    appliedFor: roles[0]!,
    location: locations[0]?.name ?? "",
    rate: String(settings.hourlyRate),
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = submitApplication({
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      nid: form.nid,
      appliedFor: form.appliedFor,
      location: form.location,
      rate: Number(form.rate) || settings.hourlyRate,
    });
    setDone(app.id);
    setForm((f) => ({ ...f, name: "", phone: "", email: "", address: "", nid: "" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">WorkHR</span>
          <Link to="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Worker Registration</h1>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Fill in your bio-data. HR will review it in the approvals queue.
        </p>

        {done && (
          <div className="card-surface mb-3 flex items-center gap-3 px-5 py-4 text-sm">
            <CheckCircle2 className="size-5 text-success" />
            <span>
              Application <strong>{done}</strong> submitted. It now appears under Registration Approvals.
            </span>
            <Link to="/admin/approvals" className="ml-auto text-sm font-medium text-primary">
              View queue ›
            </Link>
          </div>
        )}

        <Card>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input required value={form.name} onChange={set("name")} className={inputCls} placeholder="Jane Doe" />
            </Field>
            <Field label="Phone">
              <input required value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+44 7700 900000" />
            </Field>
            <Field label="Email">
              <input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="jane@mail.com" />
            </Field>
            <Field label="NID number">
              <input required value={form.nid} onChange={set("nid")} className={inputCls} placeholder="NID-0000-0000" />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input required value={form.address} onChange={set("address")} className={inputCls} placeholder="Street, city, postcode" />
            </Field>
            <Field label="Applying for">
              <select value={form.appliedFor} onChange={set("appliedFor")} className={inputCls}>
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Preferred location">
              <select value={form.location} onChange={set("location")} className={inputCls}>
                {locations.map((l) => (
                  <option key={l.id}>{l.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Expected hourly rate (£)">
              <input type="number" step="0.25" min="0" value={form.rate} onChange={set("rate")} className={inputCls} />
            </Field>
            <div className="flex items-end">
              <PrimaryButton type="submit" className="w-full">
                Submit application
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
