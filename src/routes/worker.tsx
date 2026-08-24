import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MapPin, LogIn, LogOut, CheckCircle2, ArrowLeft } from "lucide-react";
import { Card, DataTable, Td, Th } from "@/components/hr/bits";
import { locations, workerHistory, avatarUrl } from "@/lib/mock-data";

export const Route = createFileRoute("/worker")({
  head: () => ({
    meta: [
      { title: "Worker Dashboard — WorkHR" },
      { name: "description", content: "Check in and out of your shift and review your own attendance history." },
      { property: "og:title", content: "Worker Dashboard — WorkHR" },
      { property: "og:description", content: "Check in and out of your shift and review your own attendance history." },
    ],
  }),
  component: WorkerDashboard,
});

const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function WorkerDashboard() {
  const [step, setStep] = useState<"idle" | "picking" | "in">("idle");
  const [location, setLocation] = useState(locations[0]?.name ?? "");
  const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
  const [tab, setTab] = useState<"dashboard" | "history">("dashboard");
  const me = "Hazel Nutt";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-5 py-4">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">WorkHR</span>

          <nav className="ml-6 flex gap-1">
            {(["dashboard", "history"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                  tab === t ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground"
                }`}
              >
                {t === "history" ? "Attendance History" : "Dashboard"}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Switch role
            </Link>
            <img src={avatarUrl(me)} alt={me} className="size-9 rounded-full bg-secondary" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-3 px-5 py-6">
        {tab === "dashboard" && (
          <Card className="p-8 text-center">
            <img src={avatarUrl(me)} alt={me} className="mx-auto size-16 rounded-full bg-secondary" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Good Morning, {me}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>

            {step === "idle" && (
              <button
                onClick={() => setStep("picking")}
                className="mx-auto mt-8 flex h-14 items-center gap-2.5 rounded-2xl bg-primary px-10 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <LogIn className="size-5" /> Check In
              </button>
            )}

            {step === "picking" && (
              <div className="mx-auto mt-8 max-w-sm text-left">
                <label className="text-sm font-medium">Select your work location</label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute top-3 left-3 size-4 text-muted-foreground" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-border bg-card pl-9 text-sm outline-none focus:border-primary"
                  >
                    {locations.map((l) => (
                      <option key={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    setCheckedInAt(now());
                    setStep("in");
                  }}
                  className="mt-4 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  Confirm Check In
                </button>
                <button onClick={() => setStep("idle")} className="mt-2 h-10 w-full rounded-xl text-sm text-muted-foreground">
                  Cancel
                </button>
              </div>
            )}

            {step === "in" && (
              <div className="mt-8">
                <div className="mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-success-soft p-4 text-left text-success">
                  <CheckCircle2 className="size-5 shrink-0" />
                  <p className="text-sm font-medium">
                    Checked in at {checkedInAt} — {location}
                  </p>
                </div>
                <button
                  onClick={() => setStep("idle")}
                  className="mx-auto mt-6 flex h-14 items-center gap-2.5 rounded-2xl bg-danger px-10 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <LogOut className="size-5" /> Check Out
                </button>
              </div>
            )}
          </Card>
        )}

        <Card className="p-0">
          <div className="p-5">
            <h2 className="text-base font-semibold">My Attendance History</h2>
            <p className="text-sm text-muted-foreground">Your own records only.</p>
          </div>
          <DataTable
            head={
              <>
                <Th>Date</Th>
                <Th>Location</Th>
                <Th>Time In</Th>
                <Th>Time Out</Th>
                <Th>Total Hours</Th>
              </>
            }
          >
            {workerHistory.map((h) => (
              <tr key={h.date} className="hover:bg-secondary/40">
                <Td className="font-medium">{h.date}</Td>
                <Td>{h.location}</Td>
                <Td>{h.in}</Td>
                <Td>{h.out}</Td>
                <Td className="font-medium">{h.hours.toFixed(2)} h</Td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </main>
    </div>
  );
}
