# Dasturly 🍱 - Restaurant Operating System (SaaS)

Dasturly is a premium, multi-tenant restaurant management platform designed for scale. It provides a complete end-to-end solution for restaurant owners, managers, and staff, featuring real-time synchronization and a sophisticated "Slate and Gold" design language.

## 🚀 Key Features

### 🏢 SaaS Multi-tenancy
- **Super Admin Control Tower**: Manage all restaurants, monitor global analytics (Turnover, Active Tenants), and broadcast system-wide notifications.
- **Isolated Databases**: Secure data separation between different restaurant tenants.
- **Restaurant Onboarding**: Atomic creation of new restaurants and their initial management accounts.

### 📊 Manager Dashboard
- **Real-time Analytics**: Live tracking of revenue, orders, and peak hours using Recharts.
- **Financial Management**: Built-in expense tracking with category breakdowns and automatic Net Revenue calculation.
- **Operations Guard**: Complete CRUD for Users, Rooms, and Tables with real-time status updates.

### 📱 Staff Interfaces
- **Waiter Tablet**: Swipe-optimized interface for table management and ordering.
- **Kitchen Display System (KDS)**: Real-time, color-coded order tracking for kitchen staff.
- **Mobile Responsive**: Fully optimized for mobile and tablet across all user roles with a sleek hamburger navigation system.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Lucide Icons, Recharts, Vanilla CSS (Premium Glassmorphism).
- **Backend**: Node.js, Express, Socket.io (Real-time events).
- **Database**: PostgreSQL with Prisma ORM.
- **Security**: JWT Authentication, Bcrypt Password Hashing, RBAC (Role-Based Access Control).

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. **Clone the repository**
2. **Setup Backend**
   - `cd backend`
   - `npm install`
   - Configure `.env` with `DATABASE_URL` and `JWT_SECRET`.
   - `npx prisma migrate dev`
   - `node server.js`
3. **Setup Frontend**
   - `cd frontend`
   - `npm install`
   - `npm run dev`

### Default Credentials
- **Super Admin**: `admin` / `adminpassword`
- **Demo Manager**: `manager1` / `manager123`

## 🛡️ Production Readiness
The system has undergone a comprehensive audit covering:
- ✅ Multi-tenant data isolation.
- ✅ Robust JWT/RBAC security.
- ✅ Database query optimization.
- ✅ Mobile UX validation.

---
*Dasturly - Professional tools for modern gastronomy.*