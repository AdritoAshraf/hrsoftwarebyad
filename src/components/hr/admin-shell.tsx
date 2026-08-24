import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  Bell,
  Settings,
  LifeBuoy,
  Users,
  UserCheck,
  MapPin,
  BarChart3,
  Search,
  Mail,
  RefreshCw,
  UserPlus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { admin, avatarUrl } from "@/lib/mock-data";

const mainMenu = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/admin/payrolls", label: "Payrolls", icon: Wallet },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/help", label: "Help & Center", icon: LifeBuoy },
] as const;

const teamMenu = [
  { to: "/admin/workers", label: "Worker Directory", icon: Users },
  { to: "/admin/approvals", label: "Registration Approvals", icon: UserCheck },
  { to: "/admin/locations", label: "Locations", icon: MapPin },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
] as const;

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Users }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-primary-soft font-semibold text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

export function AdminShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background p-3 gap-3">
      <aside className="card-surface sticky top-3 hidden h-[calc(100vh-1.5rem)] w-64 shrink-0 flex-col p-4 lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-1">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">WorkHR</span>
        </Link>

        <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-muted-foreground/70">
          MAIN MENU
        </p>
        <nav className="flex flex-col gap-1">
          {mainMenu.map((i) => (
            <NavItem key={i.to} {...i} />
          ))}
        </nav>

        <p className="px-3 pt-6 pb-2 text-[11px] font-semibold tracking-widest text-muted-foreground/70">
          TEAM MANAGEMENT
        </p>
        <nav className="flex flex-col gap-1">
          {teamMenu.map((i) => (
            <NavItem key={i.to} {...i} />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-border bg-secondary/60 p-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <Sparkles className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Upgrade plan</p>
              <p className="text-xs text-muted-foreground">Trial ends soon</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[71%] rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Day 5 of 7</p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="card-surface mb-3 flex flex-wrap items-center gap-3 px-5 py-3">
          <h1 className="mr-auto text-lg font-semibold tracking-tight">{title}</h1>

          <div className="relative hidden md:block">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <input
              placeholder="Search anything..."
              className="h-9 w-64 rounded-lg border border-border bg-background pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {[Mail, RefreshCw, Bell].map((Icon, i) => (
            <button
              key={i}
              className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary"
            >
              <Icon className="size-4" />
            </button>
          ))}

          <div className="hidden items-center xl:flex">
            {["Hazel Nutt", "Simon Cyrene", "Nadia Karim"].map((n, i) => (
              <img
                key={n}
                src={avatarUrl(n)}
                alt={n}
                className={cn("size-8 rounded-full border-2 border-card bg-secondary", i && "-ml-2.5")}
              />
            ))}
            <span className="-ml-2.5 grid size-8 place-items-center rounded-full border-2 border-card bg-primary-soft text-[10px] font-semibold text-primary">
              +10
            </span>
          </div>

          {action ?? (
            <button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <UserPlus className="size-4" /> Invite
            </button>
          )}
        </header>

        <main className="pb-6">{children}</main>
      </div>
    </div>
  );
}
