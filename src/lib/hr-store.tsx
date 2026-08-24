import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  seedWorkers,
  seedApplications,
  seedAttendance,
  seedPayrolls,
  seedLocations,
  seedActivity,
  seedSettings,
  type Application,
  type Attendance,
  type LocationItem,
  type Notice,
  type Payroll,
  type Settings,
  type Worker,
  type WorkerStatus,
} from "./mock-data";
import {
  addDays,
  addMonths,
  fmtDate,
  daysUntil,
  hoursBetween,
  nowTime,
  rid,
  todayISO,
  weekStart,
  MONTHS,
} from "./hr-utils";

export type OpenShift = { workerId: string; date: string; in: string; location: string };
export type RejectedApp = Application & { rejectedOn: string };

type Ctx = ReturnType<typeof useHRState>;
const HRContext = createContext<Ctx | null>(null);

const round = (n: number) => Math.round(n * 100) / 100;

function useHRState() {
  const [workers, setWorkers] = useState<Worker[]>(seedWorkers);
  const [applications, setApplications] = useState<Application[]>(seedApplications);
  const [rejected, setRejected] = useState<RejectedApp[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>(seedAttendance);
  const [payrolls, setPayrolls] = useState<Payroll[]>(seedPayrolls);
  const [locations, setLocations] = useState<LocationItem[]>(seedLocations);
  const [activity, setActivity] = useState<Notice[]>(seedActivity);
  const [settings, setSettings] = useState<Settings>(seedSettings);
  const [openShifts, setOpenShifts] = useState<OpenShift[]>([]);
  const [currentWorkerId, setCurrentWorkerId] = useState<string>(seedWorkers[0]!.id);

  const logActivity = (worker: string, message: string) =>
    setActivity((a) =>
      [{ id: rid("N"), worker, message, urgency: "info" as const, when: "Just now" }, ...a].slice(0, 20),
    );

  /* ---------------- registration & approvals ---------------- */

  const submitApplication = (
    input: Omit<Application, "id" | "submitted"> & Partial<Pick<Application, "rate">>,
  ) => {
    const app: Application = {
      ...input,
      rate: input.rate || settings.hourlyRate,
      id: rid("APP", 4),
      submitted: todayISO(),
    };
    setApplications((a) => [app, ...a]);
    return app;
  };

  const approveApplication = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return null;
    const joined = todayISO();
    const worker: Worker = {
      id: rid("WRK", 5),
      name: app.name,
      phone: app.phone,
      email: app.email,
      location: app.location || locations[0]?.name || "Unassigned",
      role: app.appliedFor,
      rate: app.rate || settings.hourlyRate,
      joined,
      expiry: addMonths(joined, settings.contractMonths),
    };
    setWorkers((w) => [worker, ...w]);
    setApplications((a) => a.filter((x) => x.id !== id));
    logActivity(worker.name, `Approved — worker code ${worker.id} issued`);
    return worker;
  };

  const rejectApplication = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    setRejected((r) => [{ ...app, rejectedOn: todayISO() }, ...r]);
    setApplications((a) => a.filter((x) => x.id !== id));
    logActivity(app.name, "Application rejected");
  };

  /* ---------------- attendance ---------------- */

  const addAttendance = (entry: Omit<Attendance, "id" | "hours"> & { hours?: number }) => {
    const row: Attendance = {
      ...entry,
      hours: entry.hours ?? hoursBetween(entry.in, entry.out),
      id: rid("ATT", 4),
    };
    setAttendance((a) => [row, ...a]);
    return row;
  };

  const updateAttendance = (id: string, patch: Partial<Attendance>) =>
    setAttendance((rows) =>
      rows.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        next.hours = hoursBetween(next.in, next.out);
        return next;
      }),
    );

  const deleteAttendance = (id: string) => setAttendance((rows) => rows.filter((r) => r.id !== id));

  const openShiftFor = (workerId: string) => openShifts.find((s) => s.workerId === workerId) ?? null;

  const checkIn = (workerId: string, location: string) => {
    if (openShiftFor(workerId)) return;
    setOpenShifts((s) => [...s, { workerId, location, date: todayISO(), in: nowTime() }]);
  };

  const checkOut = (workerId: string) => {
    const shift = openShiftFor(workerId);
    if (!shift) return null;
    const w = workers.find((x) => x.id === workerId);
    const row = addAttendance({
      workerId,
      worker: w?.name ?? "Unknown",
      date: shift.date,
      in: shift.in,
      out: nowTime(),
      location: shift.location,
      source: "Self",
    });
    setOpenShifts((s) => s.filter((x) => x.workerId !== workerId));
    return row;
  };

  /* ---------------- payroll ---------------- */

  const hoursInRange = (workerId: string, from: string, to: string) =>
    round(
      attendance
        .filter((a) => a.workerId === workerId && a.date >= from && a.date <= to)
        .reduce((sum, a) => sum + a.hours, 0),
    );

  const previewPayroll = (workerId: string, from: string, to: string, advance: number) => {
    const w = workers.find((x) => x.id === workerId);
    const rate = w?.rate ?? settings.hourlyRate;
    const hours = hoursInRange(workerId, from, to);
    const weeks = Math.max(1, Math.ceil((daysUntil(to) - daysUntil(from) + 1) / 7));
    const normal = Math.min(hours, settings.overtimeThreshold * weeks);
    const overtime = Math.max(0, hours - normal);
    const gross = round(normal * rate + overtime * rate * settings.overtimeMultiplier);
    const tax = round(gross * ((settings.taxRate + settings.niRate) / 100));
    const net = round(gross - tax - advance);
    return { workerId, worker: w?.name ?? "", rate, hours, overtime, gross, tax, advance, net, from, to };
  };

  const createPayroll = (workerId: string, from: string, to: string, advance: number) => {
    const p = previewPayroll(workerId, from, to, advance);
    const row: Payroll = { ...p, id: rid("PYRL", 5), status: "Pending", created: todayISO() };
    setPayrolls((rows) => [row, ...rows]);
    logActivity(row.worker, `Payroll ${row.id} generated`);
    return row;
  };

  const setPayrollStatus = (id: string, status: Payroll["status"]) =>
    setPayrolls((rows) => rows.map((p) => (p.id === id ? { ...p, status } : p)));

  const deletePayroll = (id: string) => setPayrolls((rows) => rows.filter((p) => p.id !== id));

  /* ---------------- locations ---------------- */

  const addLocation = (name: string, address: string) =>
    setLocations((l) => [...l, { id: rid("LOC", 3), name, address }]);

  const updateLocation = (id: string, patch: Partial<LocationItem>) => {
    const prev = locations.find((l) => l.id === id);
    setLocations((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    if (prev && patch.name && patch.name !== prev.name) {
      setWorkers((ws) => ws.map((w) => (w.location === prev.name ? { ...w, location: patch.name! } : w)));
      setAttendance((as) => as.map((a) => (a.location === prev.name ? { ...a, location: patch.name! } : a)));
    }
  };

  const deleteLocation = (id: string) => setLocations((l) => l.filter((x) => x.id !== id));

  const workersAt = (name: string) => workers.filter((w) => w.location === name).length;

  /* ---------------- workers ---------------- */

  const workerStatus = (w: Worker): WorkerStatus => {
    const left = daysUntil(w.expiry);
    if (left < 0) return "Expired";
    if (w.onLeave) return "On Leave";
    if (left <= settings.firstReminderDays) return "Expiring Soon";
    return "Active";
  };

  const reactivateWorker = (id: string) => {
    setWorkers((ws) =>
      ws.map((w) => (w.id === id ? { ...w, expiry: addMonths(todayISO(), settings.contractMonths), onLeave: false } : w)),
    );
    const w = workers.find((x) => x.id === id);
    if (w) logActivity(w.name, "Contract reactivated for another 3 months");
  };

  const deleteWorker = (id: string) => setWorkers((ws) => ws.filter((w) => w.id !== id));

  /* ---------------- derived ---------------- */

  const expiryNotices = useMemo<Notice[]>(() => {
    return workers
      .map((w) => {
        const left = daysUntil(w.expiry);
        if (left > settings.firstReminderDays) return null;
        const urgency: Notice["urgency"] = left <= settings.finalReminderDays ? "critical" : "warning";
        const message =
          left < 0
            ? `Contract expired ${Math.abs(left)} day${Math.abs(left) === 1 ? "" : "s"} ago (${fmtDate(w.expiry)})`
            : `Contract expires in ${left} day${left === 1 ? "" : "s"} (${fmtDate(w.expiry)})`;
        return { id: `EXP-${w.id}`, worker: w.name, workerId: w.id, message, urgency, when: fmtDate(w.expiry) };
      })
      .filter(Boolean) as Notice[];
  }, [workers, settings.firstReminderDays, settings.finalReminderDays]);

  const notices = useMemo(() => [...expiryNotices, ...activity], [expiryNotices, activity]);

  const payrollChart = useMemo(() => {
    const buckets: { key: string; month: string; cost: number; expense: number }[] = [];
    for (let i = 8; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      buckets.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        month: MONTHS[d.getMonth()]!,
        cost: 0,
        expense: 0,
      });
    }
    for (const p of payrolls) {
      const b = buckets.find((x) => x.key === p.created.slice(0, 7));
      if (!b) continue;
      b.cost = round(b.cost + p.gross);
      b.expense = round(b.expense + p.tax + p.advance);
    }
    return buckets;
  }, [payrolls]);

  const deductionsData = useMemo(() => {
    const advances = round(payrolls.reduce((s, p) => s + p.advance, 0));
    const tax = round(payrolls.reduce((s, p) => s + p.tax, 0));
    const pension = round(payrolls.reduce((s, p) => s + p.gross * (settings.pensionRate / 100), 0));
    return [
      { name: "Advances", value: advances },
      { name: "Tax & NI", value: tax },
      { name: "Pension", value: pension },
    ];
  }, [payrolls, settings.pensionRate]);

  const weeklyReport = useMemo(() => {
    const rateOf = (id: string) => workers.find((w) => w.id === id)?.rate ?? settings.hourlyRate;
    const starts: string[] = [];
    for (let i = 5; i >= 0; i--) starts.push(weekStart(addDays(todayISO(), -7 * i)));
    return starts.map((s, idx) => {
      const end = addDays(s, 6);
      const rows = attendance.filter((a) => a.date >= s && a.date <= end);
      const hours = round(rows.reduce((t, a) => t + a.hours, 0));
      const cost = round(rows.reduce((t, a) => t + a.hours * rateOf(a.workerId), 0));
      return {
        week: `W${idx + 1}`,
        label: fmtDate(s),
        hours,
        cost,
        billing: round(cost * settings.billingMultiplier),
      };
    });
  }, [attendance, workers, settings.billingMultiplier, settings.hourlyRate]);

  const totals = useMemo(() => {
    const rateOf = (id: string) => workers.find((w) => w.id === id)?.rate ?? settings.hourlyRate;
    const totalHours = round(attendance.reduce((t, a) => t + a.hours, 0));
    const labourCost = round(attendance.reduce((t, a) => t + a.hours * rateOf(a.workerId), 0));
    const billing = round(labourCost * settings.billingMultiplier);
    const payrollCost = round(payrolls.reduce((t, p) => t + p.gross, 0));
    const pending = round(payrolls.filter((p) => p.status === "Pending").reduce((t, p) => t + p.net, 0));
    const expenses = round(payrolls.reduce((t, p) => t + p.tax + p.advance, 0));
    return {
      totalHours,
      labourCost,
      billing,
      profit: round(billing - labourCost),
      payrollCost,
      pending,
      pendingCount: payrolls.filter((p) => p.status === "Pending").length,
      expenses,
      activeWorkers: workers.filter((w) => daysUntil(w.expiry) >= 0).length,
      expiringSoon: workers.filter((w) => {
        const l = daysUntil(w.expiry);
        return l >= 0 && l <= settings.firstReminderDays;
      }).length,
    };
  }, [attendance, workers, payrolls, settings]);

  return {
    workers,
    applications,
    rejected,
    attendance,
    payrolls,
    locations,
    activity,
    settings,
    openShifts,
    currentWorkerId,
    setCurrentWorkerId,
    submitApplication,
    approveApplication,
    rejectApplication,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    checkIn,
    checkOut,
    openShiftFor,
    hoursInRange,
    previewPayroll,
    createPayroll,
    setPayrollStatus,
    deletePayroll,
    addLocation,
    updateLocation,
    deleteLocation,
    workersAt,
    workerStatus,
    reactivateWorker,
    deleteWorker,
    updateSettings: (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })),
    expiryNotices,
    notices,
    payrollChart,
    deductionsData,
    weeklyReport,
    totals,
  };
}

export function HRProvider({ children }: { children: ReactNode }) {
  const value = useHRState();
  return <HRContext.Provider value={value}>{children}</HRContext.Provider>;
}

export function useHR() {
  const ctx = useContext(HRContext);
  if (!ctx) throw new Error("useHR must be used inside HRProvider");
  return ctx;
}
