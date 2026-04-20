# Dasturly 🍱 - Enterprise Restaurant OS

Dasturly is a high-performance, multi-tenant SaaS platform built to modernize restaurant operations. It combines deep business analytics with real-time staff tools in a sleek, glassmorphic "Slate and Gold" interface.

## 🌟 Premium Features

### 🏢 SaaS Infrastructure
- **Tiered Multi-tenancy**: Securely isolated restaurant environments with a dedicated Super Admin Control Tower.
- **Onboarding Engine**: Transactional restaurant setup including automated management account provisioning.
- **System Broadcasting**: Real-time global notification system for SaaS-wide communication.

### 📈 Manager Insights
- **Advanced Analytics**: Visualized revenue, expense dynamics, and peak-hour heatmaps (Powered by Recharts).
- **Financial Suite**: Holistic expense management with category tagging and automatic Net Revenue (Profit) tracking.
- **Operational Control**: Full CRUD lifecycle for Users, Rooms, and Tables with real-time occupancy status.

### 📱 Staff Mobility
- **Waiter Tablet**: Minimalist, swipe-optimized interface for ultra-fast table service.
- **Kitchen Display (KDS)**: Real-time, color-coded order lifecycle tracking for optimal kitchen pace.
- **Universal Responsiveness**: Mobile-first architecture with custom hamburger navigation for all device sizes.

## ⚙️ Tech Stack
- **Frontend**: React, Vite, Lucide, Recharts - *Glassmorphism & High-end Typography*.
- **Backend**: Node.js, Express, Socket.io - *Real-time event streaming*.
- **Data**: PostgreSQL, Prisma ORM - *ACID transactions & strict schemas*.
- **Security**: JWT, Bcrypt, Role-Based Access Control (RBAC).

---

## 🚀 Deployment Guide

### Prerequisites
- Node.js v18+ & PostgreSQL

### Quick Setup

1. **Backend**
   ```bash
   cd backend && npm install
   # Configure .env: DATABASE_URL, JWT_SECRET, PORT
   npx prisma migrate dev
   node server.js
   ```

2. **Frontend**
   ```bash
   cd frontend && npm install
   npm run dev
   ```

### Access
- **Super Admin**: `admin` / `adminpassword`
- **Manager**: `manager1` / `manager123`

---
*Dasturly - Gastronomy perfected through technology.*
