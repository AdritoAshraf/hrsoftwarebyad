import { addDays, todayISO, toISO, money, money2 } from "./hr-utils";

export { money, money2 };

export const admin = { name: "Turja Sen", role: "HR Administrator" };

export const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ede9fe,ddd6fe,cffafe,fef3c7`;

export type WorkerStatus = "Active" | "Expiring Soon" | "Expired" | "On Leave";

export type Worker = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  joined: string; // ISO
  expiry: string; // ISO
  onLeave?: boolean;
  role: string;
  rate: number;
  address?: string;
  nid?: string;
};

/** expiry = today + daysLeft, joined = expiry - 90 days */
const seedWorker = (
  id: string,
  name: string,
  phone: string,
  email: string,
  location: string,
  role: string,
  rate: number,
  daysLeft: number,
  onLeave = false,
): Worker => {
  const expiry = addDays(todayISO(), daysLeft);
  return { id, name, phone, email, location, role, rate, expiry, joined: addDays(expiry, -90), onLeave };
};

export const seedWorkers: Worker[] = [
  seedWorker("WRK-10241", "Hazel Nutt", "+44 7700 900123", "hazel.n@mail.com", "Camden Site", "Site Operative", 14.5, 62),
  seedWorker("WRK-10242", "Simon Cyrene", "+44 7700 900456", "simon.c@mail.com", "Hackney Depot", "Forklift Driver", 16, 24),
  seedWorker("WRK-10243", "Aida Bugg", "+44 7700 900789", "aida.b@mail.com", "Stratford Yard", "Packer", 12.75, 5, true),
  seedWorker("WRK-10244", "Peg Legge", "+44 7700 900222", "peg.l@mail.com", "Camden Site", "Warehouse Assistant", 13.2, 71),
  seedWorker("WRK-10245", "Marcus Ohms", "+44 7700 900333", "marcus.o@mail.com", "Croydon Hub", "Cleaner", 11.9, -4),
  seedWorker("WRK-10246", "Nadia Karim", "+44 7700 900444", "nadia.k@mail.com", "Hackney Depot", "Team Lead", 19.5, 6),
  seedWorker("WRK-10247", "Owen Blake", "+44 7700 900555", "owen.b@mail.com", "Stratford Yard", "Site Operative", 14.5, 21),
  seedWorker("WRK-10248", "Priya Anand", "+44 7700 900666", "priya.a@mail.com", "Croydon Hub", "Quality Checker", 15.25, 84),
];

export type Application = {
  id: string;
  name: string;
  submitted: string; // ISO
  phone: string;
  email: string;
  address: string;
  nid: string;
  appliedFor: string;
  location: string;
  rate: number;
};

export const seedApplications: Application[] = [
  { id: "APP-3301", name: "Colin Sample", submitted: addDays(todayISO(), -6), phone: "+44 7700 901111", email: "colin.s@mail.com", address: "42 Fenwick Road, London E15 3QD", nid: "NID-8823-4491", appliedFor: "Site Operative", location: "Camden Site", rate: 14.5 },
  { id: "APP-3302", name: "Rita Book", submitted: addDays(todayISO(), -5), phone: "+44 7700 902222", email: "rita.b@mail.com", address: "17 Marlow Street, London SE1 6BQ", nid: "NID-1187-2093", appliedFor: "Packer", location: "Hackney Depot", rate: 12.75 },
  { id: "APP-3303", name: "Tim Burr", submitted: addDays(todayISO(), -4), phone: "+44 7700 903333", email: "tim.b@mail.com", address: "9 Bramley Close, Croydon CR0 2LX", nid: "NID-7741-0038", appliedFor: "Forklift Driver", location: "Croydon Hub", rate: 16 },
  { id: "APP-3304", name: "Sana Chowdhury", submitted: addDays(todayISO(), -2), phone: "+44 7700 904444", email: "sana.c@mail.com", address: "88 Kingsland Road, London E2 8AA", nid: "NID-5520-7712", appliedFor: "Quality Checker", location: "Stratford Yard", rate: 15.25 },
];

export type Attendance = {
  id: string;
  workerId: string;
  worker: string;
  date: string; // ISO
  in: string;
  out: string;
  location: string;
  hours: number;
  source: "Self" | "Admin";
};

const att = (
  id: string,
  workerId: string,
  worker: string,
  back: number,
  tin: string,
  tout: string,
  location: string,
  hours: number,
  source: "Self" | "Admin",
): Attendance => ({ id, workerId, worker, date: addDays(todayISO(), -back), in: tin, out: tout, location, hours, source });

export const seedAttendance: Attendance[] = [
  att("ATT-9001", "WRK-10241", "Hazel Nutt", 1, "08:02", "17:04", "Camden Site", 9.03, "Self"),
  att("ATT-9002", "WRK-10242", "Simon Cyrene", 1, "07:55", "16:30", "Hackney Depot", 8.58, "Self"),
  att("ATT-9003", "WRK-10244", "Peg Legge", 1, "09:10", "18:00", "Camden Site", 8.83, "Admin"),
  att("ATT-9004", "WRK-10246", "Nadia Karim", 2, "08:00", "17:30", "Hackney Depot", 9.5, "Self"),
  att("ATT-9005", "WRK-10247", "Owen Blake", 2, "08:15", "16:45", "Stratford Yard", 8.5, "Admin"),
  att("ATT-9006", "WRK-10248", "Priya Anand", 2, "07:45", "16:15", "Croydon Hub", 8.5, "Self"),
  att("ATT-9007", "WRK-10243", "Aida Bugg", 3, "08:30", "17:00", "Stratford Yard", 8.5, "Self"),
  att("ATT-9008", "WRK-10241", "Hazel Nutt", 3, "08:00", "16:45", "Camden Site", 8.75, "Self"),
  att("ATT-9009", "WRK-10241", "Hazel Nutt", 4, "07:58", "17:10", "Hackney Depot", 9.2, "Self"),
  att("ATT-9010", "WRK-10242", "Simon Cyrene", 4, "08:05", "17:00", "Hackney Depot", 8.92, "Admin"),
  att("ATT-9011", "WRK-10241", "Hazel Nutt", 7, "08:20", "16:30", "Camden Site", 8.17, "Self"),
  att("ATT-9012", "WRK-10244", "Peg Legge", 8, "08:00", "17:00", "Camden Site", 9, "Self"),
  att("ATT-9013", "WRK-10246", "Nadia Karim", 9, "08:10", "17:20", "Hackney Depot", 9.17, "Self"),
  att("ATT-9014", "WRK-10248", "Priya Anand", 10, "07:50", "16:20", "Croydon Hub", 8.5, "Self"),
];

export type Payroll = {
  id: string;
  workerId: string;
  worker: string;
  from: string; // ISO
  to: string; // ISO
  hours: number;
  rate: number;
  gross: number;
  advance: number;
  tax: number;
  net: number;
  status: "Completed" | "Pending";
  created: string; // ISO
};

const mkSeed = (
  id: string,
  workerId: string,
  worker: string,
  hours: number,
  rate: number,
  advance: number,
  status: "Completed" | "Pending",
  back: number,
): Payroll => {
  const gross = Math.round(hours * rate * 100) / 100;
  const tax = Math.round(gross * 0.32 * 100) / 100;
  return {
    id,
    workerId,
    worker,
    hours,
    rate,
    advance,
    gross,
    tax,
    net: Math.round((gross - tax - advance) * 100) / 100,
    status,
    from: addDays(todayISO(), -back - 30),
    to: addDays(todayISO(), -back),
    created: addDays(todayISO(), -back),
  };
};

export const seedPayrolls: Payroll[] = [
  mkSeed("PYRL-12024", "WRK-10241", "Hazel Nutt", 168, 14.5, 200, "Completed", 2),
  mkSeed("PYRL-12025", "WRK-10242", "Simon Cyrene", 172, 16, 100, "Completed", 2),
  mkSeed("PYRL-12026", "WRK-10243", "Aida Bugg", 140, 12.75, 350, "Pending", 3),
  mkSeed("PYRL-12027", "WRK-10244", "Peg Legge", 160, 13.2, 0, "Pending", 3),
  mkSeed("PYRL-12028", "WRK-10246", "Nadia Karim", 176, 19.5, 500, "Completed", 4),
  mkSeed("PYRL-12029", "WRK-10247", "Owen Blake", 152, 14.5, 120, "Completed", 5),
  mkSeed("PYRL-12030", "WRK-10248", "Priya Anand", 164, 15.25, 0, "Pending", 6),
];

export type LocationItem = { id: string; name: string; address: string };

export const seedLocations: LocationItem[] = [
  { id: "LOC-01", name: "Camden Site", address: "24 Camden High St, London NW1 0JH" },
  { id: "LOC-02", name: "Hackney Depot", address: "112 Morning Lane, London E9 6LH" },
  { id: "LOC-03", name: "Stratford Yard", address: "3 Angel Lane, London E15 1DF" },
  { id: "LOC-04", name: "Croydon Hub", address: "60 George St, Croydon CR0 1PB" },
];

export type Notice = {
  id: string;
  worker: string;
  workerId?: string;
  message: string;
  urgency: "critical" | "warning" | "info";
  when: string;
};

export const seedActivity: Notice[] = [
  { id: "N-A1", worker: "Priya Anand", message: "Documents verified and archived", urgency: "info", when: "2 days ago" },
  { id: "N-A2", worker: "Peg Legge", message: "Attendance edited by admin", urgency: "info", when: "3 days ago" },
];

export type Settings = {
  hourlyRate: number;
  overtimeMultiplier: number;
  overtimeThreshold: number;
  contractMonths: number;
  taxRate: number;
  niRate: number;
  pensionRate: number;
  maxAdvance: number;
  firstReminderDays: number;
  finalReminderDays: number;
  companyName: string;
  payrollEmail: string;
  billingMultiplier: number;
};

export const seedSettings: Settings = {
  hourlyRate: 14.5,
  overtimeMultiplier: 1.5,
  overtimeThreshold: 40,
  contractMonths: 3,
  taxRate: 20,
  niRate: 12,
  pensionRate: 5,
  maxAdvance: 500,
  firstReminderDays: 30,
  finalReminderDays: 7,
  companyName: "WorkHR Staffing Ltd",
  payrollEmail: "payroll@workhr.co.uk",
  billingMultiplier: 1.45,
};

export const seedToday = toISO(new Date());

/* ---------------- buyer income & other costs ---------------- */

export type BuyerIncome = {
  id: string;
  buyer: string;
  description: string;
  amount: number;
  date: string; // ISO
  status: "Received" | "Pending";
};

export type OtherCost = { id: string; description: string; amount: number; date: string };

export const seedBuyerIncome: BuyerIncome[] = [
  { id: "BIN-1001", buyer: "Halstead Construction", description: "Camden site labour — monthly invoice", amount: 18500, date: addDays(todayISO(), -6), status: "Received" },
  { id: "BIN-1002", buyer: "Northline Logistics", description: "Hackney depot night shifts", amount: 9400, date: addDays(todayISO(), -14), status: "Received" },
  { id: "BIN-1003", buyer: "Brightway Facilities", description: "Stratford yard cleaning crew", amount: 6200, date: addDays(todayISO(), -21), status: "Pending" },
  { id: "BIN-1004", buyer: "Halstead Construction", description: "Overtime supplement — previous period", amount: 4100, date: addDays(todayISO(), -38), status: "Received" },
  { id: "BIN-1005", buyer: "Kestrel Retail Group", description: "Seasonal warehouse staffing", amount: 12750, date: addDays(todayISO(), -52), status: "Received" },
];

export const seedOtherCosts: OtherCost[] = [
  { id: "COST-2001", description: "Crew transport & fuel", amount: 1350, date: addDays(todayISO(), -5) },
  { id: "COST-2002", description: "PPE and site materials", amount: 880, date: addDays(todayISO(), -17) },
  { id: "COST-2003", description: "Equipment hire", amount: 1600, date: addDays(todayISO(), -44) },
];
