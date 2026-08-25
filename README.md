# HR Hub Dashboard

Design and build the full frontend UI for an HR & Payroll Management System, styled as a modern, clean SaaS admin dashboard (similar to Ocupite/TurHR style dashboards) — with a fixed left sidebar navigation, a top header bar, card-based stat widgets, charts, and data tables with status badges.

IMPORTANT: Do NOT connect any backend, database, or authentication provider. Do not use Lovable Cloud or Supabase. Build this as a pure frontend UI using local mock/dummy data (hardcoded arrays or JSON) so every screen is visually complete and interactive-looking, but with no real backend logic yet. All buttons and forms can be non-functional placeholders for now.

OVERALL LAYOUT

- Left sidebar: logo/app name at top, "Main Menu" section (Dashboard, Attendance, Payrolls, Notifications, Settings, Help & Center), a "Team Management" section (Worker Directory, Registration Approvals, Locations, Reports), and a bottom card showing plan/trial status.

- Top header: page title on the left, search bar, icon buttons (mail, refresh, notifications), stacked avatar group, and a primary action button (e.g. "+ New Payroll" or "Invite").

- Rounded cards, soft shadows, generous white space, rounded pill-shaped status badges (green = Completed/Active, yellow/orange = Pending, red = Expired), avatar thumbnails next to names, clean sans-serif typography, a single accent color (purple or teal) used for primary buttons and chart highlights.

BUILD THE FOLLOWING SCREENS

1. Admin Dashboard (Home)

- Greeting header ("Good Morning, [Admin Name]") with a date range selector and "Export Data" button.

- Stat cards: Total Active Workers, Total Payroll Cost (this month), Pending Registrations, Workers Expiring Soon (3-month probation).

- A bar chart "Payroll Cost Overview" showing monthly cost vs expense, similar to the reference image, with hover tooltip showing exact figures.

- A donut/ring chart summarizing "Advance & Deductions" or "Bonuses and Incentives" style breakdown.

- A "Recent Notifications" panel showing upcoming probation expiry alerts (1 month left / 7 days left).

2. Worker Directory

- Table with columns: Worker ID, Photo, Name, Phone/Email, Location, Joining Date, Status (Active/Expired/On Leave — as colored pill badges), Action menu.

- Search bar, filter dropdowns (Status, Location, Joining Month), export button.

3. Registration Approvals

- List/table of pending worker applications with photo, name, submitted date, and Approve/Reject action buttons.

- Clicking a row opens a detail view showing full bio-data: name, address, phone, email, NID upload preview, profile photo.

4. Attendance Page

- Table showing Worker, Date, Check-In Time, Check-Out Time, Location, Total Hours, Source (Self/Admin) as a small tag.

- A "+ Add Entry" button for admin to manually add/edit attendance.

- Filter by date range and worker.

5. Payrolls Page (style this closely after the reference "Payrolls" screen)

- Top stat cards: Payroll Cost, Total Expense, Pending Payments, Total Payrolls.

- Bar chart "Payroll Cost Overview" (cost vs expense per month).

- Side donut chart for "Deductions & Advances" breakdown.

- "Payroll list" table: Payroll ID, Worker Name (with avatar), Hours Worked, Hourly Rate, Gross Pay, Advance Deducted, Net Pay, Status (Completed/Pending pill badge), Action icons (view/print payslip, more options).

- "+ New Payroll" button top right and a date range selector.

6. Locations Management Page

- Simple card/list view of work locations admin has added (name, address), with Add/Edit/Delete actions.

7. Notifications Center

- List of system alerts: probation expiring in 1 month / 7 days, grouped by urgency (color-coded), each with worker name, photo, and a "View Worker" action.

8. Reports Page

- Filter bar (date range, worker, location).

- Cards for Total Hours Worked, Total Labor Cost, Profit/Loss summary.

- A chart comparing cost vs client billing over weeks/months.

- Exportable table view below.

9. Worker Dashboard (separate simplified layout for the Worker role)

- Minimal single-screen view (no sidebar full menu — just Dashboard and maybe Attendance History).

- Large "Check In" button, which on click reveals a location dropdown (populated from admin's location list) then confirms check-in with a timestamp.

- After checking in, button changes to "Check Out".

- Below, a simple table/list of the worker's own past attendance history (Date, Location, Time In, Time Out, Total Hours).

- No access to any other worker's data, payroll, or admin menus.

10. Settings Page

- Simple form-style page with sections: Hourly Rate defaults, Overtime Multiplier, Tax/NI rate fields, Notification timing (1 month / 7 days), all as editable input fields (non-functional for now).

DESIGN NOTES

- Keep consistent spacing, card corner radius (~16px), and a light gray page background (#F7F7FB or similar) with white cards.

- Use placeholder avatars/photos for worker mock data.

- Make the sidebar highlight the active page.

- Fully responsive layout is not required — desktop-first admin dashboard is fine.

- Use realistic-looking mock data (worker names, dates, amounts) across all tables and charts so the app looks populated and real, not empty.

Do not add authentication/login logic yet — just build a role switcher (a simple toggle or two entry links: "Admin View" and "Worker View") so both dashboards can be previewed without real login.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://hrsoftwarebyad.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/03435997-ed4e-43e6-995f-630d5db50aa2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
