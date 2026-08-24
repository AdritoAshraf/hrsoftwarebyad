import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MapPin, LogIn, LogOut, CheckCircle2, ArrowLeft, CalendarCheck } from "lucide-react";
import { Card, DataTable, EmptyRow, StatusBadge, Td, Th } from "@/components/hr/bits";
import { avatarUrl } from "@/lib/mock-data";
import { useHR } from "@/lib/hr-store";
import { fmtDate, hoursBetween, nowTime, todayISO } from "@/lib/hr-utils";

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

function WorkerDashboard() {
  const {
    workers,
    locations,
    attendance,
    currentWorkerId,
    setCurrentWorkerId,
    checkIn,
    checkOut,
    openShiftFor,
    workerStatus,
  } = useHR();

  const me = workers.find((w) => w.id === currentWorkerId) ?? workers[0];
  const shift = me ? openShiftFor(me.id) : null;
  const [picking, setPicking] = useState(false);
  const [location, setLocation] = useState(locations[0]?.name ?? "");
  const [tab, setTab] = useState<"dashboard" | "history">("dashboard");

  const history = useMemo(
    () =>
      attendance
        .filter((a) => a.workerId === me?.id)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [attendance, me?.id],
  );

  const weekHours = history
    .filter((h) => h.date >= todayISO().slice(0, 8) + "01")
    .reduce((t, h) => t + h.hours, 0);

  if (!me) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">No workers yet.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 md:flex-wrap md:px-5 md:py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">WorkHR</span>

          <nav className="ml-6 hidden gap-1 md:flex">
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

          <div className="ml-auto flex min-w-0 items-center gap-3">
            <select
              value={me.id}
              onChange={(e) => setCurrentWorkerId(e.target.value)}
              className="h-9 max-w-32 rounded-lg border border-border bg-card px-2 text-sm outline-none focus:border-primary"
              aria-label="Signed in as"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <Link to="/" className="hidden items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:flex">
              <ArrowLeft className="size-4" /> Switch role
            </Link>
            <img src={avatarUrl(me.name)} alt={me.name} className="size-9 rounded-full bg-secondary" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-3 px-4 py-5 pb-28 md:px-5 md:py-6 md:pb-6">
        {tab === "dashboard" && (
          <Card className="p-6 text-center md:p-8">
            <img src={avatarUrl(me.name)} alt={me.name} className="mx-auto size-16 rounded-full bg-secondary" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Good Morning, {me.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <StatusBadge status={workerStatus(me)} />
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                {me.id} · £{me.rate.toFixed(2)}/h · {weekHours.toFixed(1)} h this month
              </span>
            </div>

            {!shift && !picking && (
              <button
                onClick={() => setPicking(true)}
                className="mx-auto mt-8 flex h-14 items-center gap-2.5 rounded-2xl bg-primary px-10 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <LogIn className="size-5" /> Check In
              </button>
            )}

            {!shift && picking && (
              <div className="mx-auto mt-8 max-w-sm text-left">
                <label className="text-sm font-medium">Select your work location</label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute top-3 left-3 size-4 text-muted-foreground" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-card pl-9 text-sm outline-none focus:border-primary"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    checkIn(me.id, location || locations[0]?.name || "Unassigned");
                    setPicking(false);
                  }}
                  className="mt-4 h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
                >
                  Confirm Check In
                </button>
                <button onClick={() => setPicking(false)} className="mt-2 h-10 w-full rounded-xl text-sm text-muted-foreground">
                  Cancel
                </button>
              </div>
            )}

            {shift && (
              <div className="mt-8">
                <div className="mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-success-soft p-4 text-left text-success">
                  <CheckCircle2 className="size-5 shrink-0" />
                  <p className="text-sm font-medium">
                    Checked in at {shift.in} — {shift.location} · {hoursBetween(shift.in, nowTime()).toFixed(2)} h so far
                  </p>
                </div>
                <button
                  onClick={() => checkOut(me.id)}
                  className="mx-auto mt-6 flex h-14 items-center gap-2.5 rounded-2xl bg-danger px-10 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <LogOut className="size-5" /> Check Out
                </button>
              </div>
            )}
          </Card>
        )}

        <Card className={tab === "dashboard" ? "p-0 max-md:hidden" : "p-0"}>
          <div className="p-5">
            <h2 className="text-base font-semibold">My Attendance History</h2>
            <p className="text-sm text-muted-foreground">
              {history.length} record{history.length === 1 ? "" : "s"} — visible to admin instantly.
            </p>
          </div>
          <DataTable
            labels={["Date", "Location", "Time In", "Time Out", "Total Hours", "Source"]}
            head={
              <>
                <Th>Date</Th>
                <Th>Location</Th>
                <Th>Time In</Th>
                <Th>Time Out</Th>
                <Th>Total Hours</Th>
                <Th>Source</Th>
              </>
            }
          >
            {history.length === 0 && <EmptyRow colSpan={6} text="No attendance yet — check in to create your first record." />}
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-secondary/40">
                <Td className="font-medium">{fmtDate(h.date)}</Td>
                <Td>{h.location}</Td>
                <Td>{h.in}</Td>
                <Td>{h.out}</Td>
                <Td className="font-medium">{h.hours.toFixed(2)} h</Td>
                <Td><StatusBadge status={h.source} /></Td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </main>

      {/* mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        {([
          { key: "dashboard", label: "Dashboard", Icon: LogIn },
          { key: "history", label: "Attendance", Icon: CalendarCheck },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-col items-center gap-1 py-2 text-[10px] font-medium ${
              tab === key ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className={`grid h-7 w-14 place-items-center rounded-full ${tab === key ? "bg-primary-soft" : ""}`}>
              <Icon className="size-4" />
            </span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
