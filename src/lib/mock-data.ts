export type Status = "Active" | "Expired" | "On Leave" | "Completed" | "Pending" | "Rejected";

export const admin = { name: "Turja Sen", role: "HR Administrator" };

export const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ede9fe,ddd6fe,cffafe,fef3c7`;

export type Worker = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  joined: string;
  status: Extract<Status, "Active" | "Expired" | "On Leave">;
  role: string;
  rate: number;
  probationEndsIn: number; // days
};

export const workers: Worker[] = [
  { id: "WRK-10241", name: "Hazel Nutt", phone: "+44 7700 900123", email: "hazel.n@mail.com", location: "Camden Site", joined: "12 Jan 2024", status: "Active", role: "Site Operative", rate: 14.5, probationEndsIn: 210 },
  { id: "WRK-10242", name: "Simon Cyrene", phone: "+44 7700 900456", email: "simon.c@mail.com", location: "Hackney Depot", joined: "03 Feb 2024", status: "Active", role: "Forklift Driver", rate: 16.0, probationEndsIn: 30 },
  { id: "WRK-10243", name: "Aida Bugg", phone: "+44 7700 900789", email: "aida.b@mail.com", location: "Stratford Yard", joined: "21 Feb 2024", status: "On Leave", role: "Packer", rate: 12.75, probationEndsIn: 7 },
  { id: "WRK-10244", name: "Peg Legge", phone: "+44 7700 900222", email: "peg.l@mail.com", location: "Camden Site", joined: "09 Mar 2024", status: "Active", role: "Warehouse Assistant", rate: 13.2, probationEndsIn: 88 },
  { id: "WRK-10245", name: "Marcus Ohms", phone: "+44 7700 900333", email: "marcus.o@mail.com", location: "Croydon Hub", joined: "18 Mar 2024", status: "Expired", role: "Cleaner", rate: 11.9, probationEndsIn: 0 },
  { id: "WRK-10246", name: "Nadia Karim", phone: "+44 7700 900444", email: "nadia.k@mail.com", location: "Hackney Depot", joined: "02 Apr 2024", status: "Active", role: "Team Lead", rate: 19.5, probationEndsIn: 7 },
  { id: "WRK-10247", name: "Owen Blake", phone: "+44 7700 900555", email: "owen.b@mail.com", location: "Stratford Yard", joined: "27 Apr 2024", status: "Active", role: "Site Operative", rate: 14.5, probationEndsIn: 30 },
  { id: "WRK-10248", name: "Priya Anand", phone: "+44 7700 900666", email: "priya.a@mail.com", location: "Croydon Hub", joined: "14 May 2024", status: "Active", role: "Quality Checker", rate: 15.25, probationEndsIn: 120 },
];

export type Application = {
  id: string;
  name: string;
  submitted: string;
  phone: string;
  email: string;
  address: string;
  nid: string;
  appliedFor: string;
};

export const applications: Application[] = [
  { id: "APP-3301", name: "Colin Sample", submitted: "18 Aug 2026", phone: "+44 7700 901111", email: "colin.s@mail.com", address: "42 Fenwick Road, London E15 3QD", nid: "NID-8823-4491", appliedFor: "Site Operative" },
  { id: "APP-3302", name: "Rita Book", submitted: "19 Aug 2026", phone: "+44 7700 902222", email: "rita.b@mail.com", address: "17 Marlow Street, London SE1 6BQ", nid: "NID-1187-2093", appliedFor: "Packer" },
  { id: "APP-3303", name: "Tim Burr", submitted: "20 Aug 2026", phone: "+44 7700 903333", email: "tim.b@mail.com", address: "9 Bramley Close, Croydon CR0 2LX", nid: "NID-7741-0038", appliedFor: "Forklift Driver" },
  { id: "APP-3304", name: "Sana Chowdhury", submitted: "22 Aug 2026", phone: "+44 7700 904444", email: "sana.c@mail.com", address: "88 Kingsland Road, London E2 8AA", nid: "NID-5520-7712", appliedFor: "Quality Checker" },
];

export type Attendance = {
  id: string;
  worker: string;
  date: string;
  in: string;
  out: string;
  location: string;
  hours: number;
  source: "Self" | "Admin";
};

export const attendance: Attendance[] = [
  { id: "ATT-9001", worker: "Hazel Nutt", date: "22 Aug 2026", in: "08:02", out: "17:04", location: "Camden Site", hours: 9.0, source: "Self" },
  { id: "ATT-9002", worker: "Simon Cyrene", date: "22 Aug 2026", in: "07:55", out: "16:30", location: "Hackney Depot", hours: 8.6, source: "Self" },
  { id: "ATT-9003", worker: "Peg Legge", date: "22 Aug 2026", in: "09:10", out: "18:00", location: "Camden Site", hours: 8.8, source: "Admin" },
  { id: "ATT-9004", worker: "Nadia Karim", date: "21 Aug 2026", in: "08:00", out: "17:30", location: "Hackney Depot", hours: 9.5, source: "Self" },
  { id: "ATT-9005", worker: "Owen Blake", date: "21 Aug 2026", in: "08:15", out: "16:45", location: "Stratford Yard", hours: 8.5, source: "Admin" },
  { id: "ATT-9006", worker: "Priya Anand", date: "21 Aug 2026", in: "07:45", out: "16:15", location: "Croydon Hub", hours: 8.5, source: "Self" },
  { id: "ATT-9007", worker: "Aida Bugg", date: "20 Aug 2026", in: "08:30", out: "17:00", location: "Stratford Yard", hours: 8.5, source: "Self" },
];

export type Payroll = {
  id: string;
  worker: string;
  hours: number;
  rate: number;
  advance: number;
  status: "Completed" | "Pending";
  date: string;
};

export const payrolls: Payroll[] = [
  { id: "PYRL-12024", worker: "Hazel Nutt", hours: 168, rate: 14.5, advance: 200, status: "Completed", date: "21 Aug 2026 - 05:05 pm" },
  { id: "PYRL-12025", worker: "Simon Cyrene", hours: 172, rate: 16.0, advance: 100, status: "Completed", date: "21 Aug 2026 - 05:03 pm" },
  { id: "PYRL-12026", worker: "Aida Bugg", hours: 140, rate: 12.75, advance: 350, status: "Pending", date: "21 Aug 2026 - 05:01 pm" },
  { id: "PYRL-12027", worker: "Peg Legge", hours: 160, rate: 13.2, advance: 0, status: "Pending", date: "21 Aug 2026 - 05:00 pm" },
  { id: "PYRL-12028", worker: "Nadia Karim", hours: 176, rate: 19.5, advance: 500, status: "Completed", date: "20 Aug 2026 - 04:52 pm" },
  { id: "PYRL-12029", worker: "Owen Blake", hours: 152, rate: 14.5, advance: 120, status: "Completed", date: "20 Aug 2026 - 04:41 pm" },
  { id: "PYRL-12030", worker: "Priya Anand", hours: 164, rate: 15.25, advance: 0, status: "Pending", date: "20 Aug 2026 - 04:30 pm" },
];

export const gross = (p: Payroll) => p.hours * p.rate;
export const net = (p: Payroll) => gross(p) - p.advance;

export const payrollChart = [
  { month: "Mar", cost: 8200, expense: 2100 },
  { month: "Apr", cost: 9400, expense: 2400 },
  { month: "May", cost: 11200, expense: 2650 },
  { month: "Jun", cost: 10100, expense: 2300 },
  { month: "Jul", cost: 12500, expense: 2560 },
  { month: "Aug", cost: 9800, expense: 2200 },
  { month: "Sep", cost: 10800, expense: 2450 },
  { month: "Oct", cost: 11600, expense: 2700 },
  { month: "Nov", cost: 12100, expense: 2900 },
];

export const deductions = [
  { name: "Advances", value: 5100 },
  { name: "Tax & NI", value: 3200 },
  { name: "Other", value: 2200 },
];

export const billingChart = [
  { week: "W1", cost: 4200, billing: 6100 },
  { week: "W2", cost: 4600, billing: 6800 },
  { week: "W3", cost: 5100, billing: 7000 },
  { week: "W4", cost: 4800, billing: 7400 },
  { week: "W5", cost: 5300, billing: 7900 },
  { week: "W6", cost: 5000, billing: 7200 },
];

export type LocationItem = { id: string; name: string; address: string; workers: number };

export const locations: LocationItem[] = [
  { id: "LOC-01", name: "Camden Site", address: "24 Camden High St, London NW1 0JH", workers: 18 },
  { id: "LOC-02", name: "Hackney Depot", address: "112 Morning Lane, London E9 6LH", workers: 24 },
  { id: "LOC-03", name: "Stratford Yard", address: "3 Angel Lane, London E15 1DF", workers: 12 },
  { id: "LOC-04", name: "Croydon Hub", address: "60 George St, Croydon CR0 1PB", workers: 9 },
];

export type Notice = { id: string; worker: string; message: string; urgency: "critical" | "warning" | "info"; when: string };

export const notifications: Notice[] = [
  { id: "N-1", worker: "Aida Bugg", message: "Probation period expires in 7 days", urgency: "critical", when: "2 hours ago" },
  { id: "N-2", worker: "Nadia Karim", message: "Probation period expires in 7 days", urgency: "critical", when: "5 hours ago" },
  { id: "N-3", worker: "Simon Cyrene", message: "Probation period expires in 1 month", urgency: "warning", when: "Yesterday" },
  { id: "N-4", worker: "Owen Blake", message: "Probation period expires in 1 month", urgency: "warning", when: "Yesterday" },
  { id: "N-5", worker: "Priya Anand", message: "Documents verified and archived", urgency: "info", when: "2 days ago" },
  { id: "N-6", worker: "Peg Legge", message: "Attendance edited by admin for 20 Aug", urgency: "info", when: "3 days ago" },
];

export const workerHistory = [
  { date: "22 Aug 2026", location: "Camden Site", in: "08:02", out: "17:04", hours: 9.0 },
  { date: "21 Aug 2026", location: "Camden Site", in: "08:00", out: "16:45", hours: 8.75 },
  { date: "20 Aug 2026", location: "Hackney Depot", in: "07:58", out: "17:10", hours: 9.2 },
  { date: "19 Aug 2026", location: "Camden Site", in: "08:20", out: "16:30", hours: 8.1 },
  { date: "18 Aug 2026", location: "Stratford Yard", in: "08:05", out: "17:00", hours: 8.9 },
];

export const money = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export const money2 = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 });
