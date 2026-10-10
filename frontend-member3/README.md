# HomeCare — Smart Home Management System

A modern, responsive frontend web application built with **React.js**, **Vite**, **CSS3**, **React Router DOM**, **Lucide React**, and **Recharts**.

HomeCare enables homeowners to manage property conditions, maintenance schedules, appliance warranties, service technicians, utility bills, and expenditures from a single, unified interface.

---

## 🚀 Live Demo & Key Modules

### 1. Home Dashboard (`/`)
* **Real-Time Property Health Score**: Dynamically calculated based on pending repairs, urgent alerts, and overdue maintenance.
* **Metric Stat Cards**:
  * Home Condition (Health score & status)
  * Pending Repairs (with urgent/overdue indicators)
  * Upcoming Maintenance
  * Appliance Service Due (within 14 days)
  * Active Service Requests
  * Monthly Home Expenses
  * Pending Bills Total
* **Interactive Recharts Spending Chart**: Monthly utility and maintenance breakdown.
* **Important Attention Items**: Direct banners for overdue items, warranties nearing expiration, and urgent issues.
* **Quick Action Modals**: One-click modals to **Add Repair**, **Add Asset**, **Request Service**, and **Add Bill** that update state and metrics instantly.

---

### 2. Maintenance & Repairs (`/maintenance`)
* **13 Issue Categories**: Plumbing, Electrical, Painting, Cleaning, Roof, Flooring, Bathroom, Kitchen, Doors & Windows, Pest Control, Water Tank, Garden, and General Repairs.
* **Comprehensive Record Fields**: Problem name, Category, Description, Location/Room, Priority (Low, Medium, High, Urgent), Reported Date, Target Due Date, Estimated Cost vs. Actual Cost, Status, Assigned Contractor, Resolution Notes, and Completion Date.
* **Status Workflow**: `Reported` → `Scheduled` → `In Progress` → `Completed`.
* **View Modes**: Switch seamlessly between **Table View** and **Card Grid View**.
* **Filtering & Search**: Search by keywords or room; filter by category, priority, and status; sort by newest, priority, or cost.
* **Full CRUD**: Add, edit, view details modal, and delete with safety confirmation.

---

### 3. Appliances & Assets (`/assets`)
* **Appliances Tracked**: Air Conditioner, Refrigerator, Washing Machine, Television, Water Purifier, Water Heater, Inverter, Microwave, Water Tank, Solar System, Security Equipment, and more.
* **Dynamic Warranty & Service Calculations**:
  * Real-time calculation of **days remaining** until warranty expiration.
  * Active, Expiring Soon (≤45 days), and Expired status badges.
  * Upcoming maintenance highlight (services due within 14 days or overdue).
* **Service History Timeline**: Detailed log of past maintenance visits, technician names, cost, and notes.
* **Direct Actions**:
  * Log maintenance visits directly for each appliance.
  * One-click **"Link / Schedule Repair Ticket"** to automatically generate a repair ticket pre-filled with appliance details.

---

### 4. Home Services Marketplace (`/services`)
* **Certified Professionals**: Plumbers, Electricians, Carpenters, Painters, Cleaners, AC Technicians, Masons, Pest Control Workers, Appliance Technicians, and Gardeners.
* **Contractor Cards**: View rating, reviews count, years of experience, hourly/visit rates, service zone, and availability status.
* **Interactive Modals**:
  * **Provider Profile Modal**: Detailed bio, verified phone and email, and coverage zone.
  * **Book Service Modal**: Select preferred date, morning/afternoon/evening time slots, describe the problem, specify budget, and optionally link to an existing repair ticket.
* **Service Requests Tab**: Track workflow status (`Requested` → `Accepted` → `In Progress` → `Completed` / `Cancelled`) with inline status update controls.

---

### 5. Expenses & Bills (`/expenses`)
* **Utility & Maintenance Invoices**: Track Electricity, Water, Maintenance, Cleaning, Appliance Repairs, and other bills.
* **Visual Data**:
  * 6-Month spending trend bar chart.
  * Category expense distribution donut chart.
* **Bill Settlement**: One-click **"Pay Now"** updates status to `Paid` and automatically syncs the settlement into monthly expense records.
* **Search & Filters**: Filter by bill status (Paid / Pending) and categories.

---

### 6. Notification Center (`/notifications`)
* Centralized hub displaying alerts for:
  * Urgent repairs requiring prompt intervention.
  * Approaching appliance routine maintenance dates.
  * Expiring manufacturer warranties.
  * Pending utility invoices.
  * Contractor service acceptance updates.
* **Actions**: Mark individual notifications as read, mark all as read, delete alerts, or click to jump directly to the relevant module.

---

### 7. System & Home Settings (`/settings`)
* **Owner Profile**: Name, contact email, phone, and avatar URL.
* **Property Specifications**: Home nickname, property type, living area (sq ft), construction year, and room breakdown.
* **Alert Preferences**: Toggle email/SMS alerts and configure reminder lookahead thresholds.
* **Demo Data Reset**: Instant one-click restore to sample state if needed.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Modern CSS3 (CSS Variables, Flexbox, Grid, Plus Jakarta Sans) |
| **Icons** | Lucide React |
| **Charts** | Recharts (ResponsiveContainer, BarChart, PieChart) |
| **State & Persistence** | React Context API + Browser `localStorage` |

---

## 💻 Installation & Running Locally

### Prerequisites
* **Node.js** (v18+ or v20+)
* **npm** (v9+)

### Steps

1. Navigate to the project directory:
   ```powershell
   cd C:\Users\hp\.gemini\antigravity\scratch\smart-home-management
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173/
   ```

5. Build for production:
   ```powershell
   npm run build
   ```

---

## 🎨 Theme & Design Philosophy
* **Primary Color**: Green (`#16A34A` / `#15803d`) representing home vitality, care, and efficiency.
* **Backgrounds**: Crisp white (`#ffffff`) and soft slate grays (`#f8fafc`, `#f1f5f9`).
* **Typography**: Clean hierarchy with subtle shadows, rounded cards (`14px` border radius), and consistent spacing.
* **Responsive**: Collapsible sidebar navigation, mobile overlay drawer, and fluid grid layouts for desktop, tablet, and mobile displays.
