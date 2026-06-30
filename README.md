# SMU Prototype
### Supply Management Unit System

> A web-based supply management system for tracking purchase orders, deliveries, suppliers, and inspection & acceptance reports.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel (PHP) |
| Frontend | React + TypeScript |
| Routing / SSR | Inertia.js |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Build Tool | Vite |
| Package Manager | pnpm |
| Auth | Laravel Fortify + Passkeys |

---

## Features

### Purchase Orders
- View all purchase orders in a table with status badges
- Add new POs via a dialog form overlay
- Fields: PO Number, PO Date, PO Amount, Unit/Office, Supplier, Delivery Term, Fund Cluster, PR Number, PR Date, ORS/BUR Number, ORS/BUR Date, Status, Remarks
- Status tracking: `pending` `partial` `completed` `cancelled`
- Quick stats: Total POs, Pending, Completed, Cancelled

### Supplier Directory
- View and manage registered suppliers
- Add new suppliers via a dialog form overlay
- Fields: Company Name, Office Address, TIN, Email, Contact Number, Status, Internal Remarks
- Status tracking: `active` `inactive`
- Quick stats: Total, Active, Inactive

### Delivery Tracking
- Record and track deliveries linked to purchase orders
- Fields: PO Number, Invoice Number, Invoice Date, DR Number, DR Date
- PO Number linked via dropdown from existing records
- Quick stats: Total Deliveries, With Invoice, With DR

### Inspection & Acceptance Reports (IAR)
- Manage IAR entries linked to deliveries and purchase orders
- Fields: IAR Number, PO Number, Delivery/Invoice, IAR Date, Inspected By, Inspection Date, Status, Remarks
- Delivery dropdown auto-filters based on selected PO
- Status tracking: `pending` `passed` `failed`
- Quick stats: Total IARs, Pending, Passed

### Authentication
- Login and registration via Laravel Fortify
- Two-factor authentication (2FA)
- Passkey support
- Email verification and password reset

### UI / UX
- Full dark mode support using shadcn/ui CSS variable tokens
- Sidebar navigation per module
- Dialog overlays for all create forms
- Responsive tables with hover states
- Empty state messaging with call-to-action

---

## Local Setup

### Requirements
- PHP 8.2+
- Composer
- Node.js + pnpm
- MySQL or SQLite
- Laravel Herd (recommended)

### Installation

```bash
git clone https://github.com/desciii/prototype.git
cd prototype

composer install
pnpm install

cp .env.example .env
php artisan key:generate

# configure your DB in .env then:
php artisan migrate

# run dev servers
php artisan serve
pnpm run dev
```

---

## Planned Features

- [ ] Post PO Transactions (extensions, terminations, waivers)
- [ ] System Audit Logs
- [ ] User Management with role/level assignment
- [ ] Enhanced sidebar and UI/UX improvements

---

## Project Info

**Developer:** desciii  
**Program:** BSIT - Business Technology Management  
**School:** University of Southeastern Philippines