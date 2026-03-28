# 🏭 FactoryPay — Receipt Management System

A full-stack Next.js app for managing worker purchase receipts. Workers buy items for the factory, submit receipts to the admin, and the manager approves/rejects reimbursements.

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Supabase** for auth, database, and image storage

---

## 🚀 Setup Guide

### 1. Clone & Install
```bash
git clone <your-repo>
cd factory-receipts
npm install
```

### 2. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your Project URL and API keys

### 3. Run the Database Schema
In Supabase → **SQL Editor**, paste and run the contents of `supabase-schema.sql`

### 4. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 5. Create Test Users
In Supabase → **Authentication → Users → Add User**, create two users:
- `admin@factory.com` (role: admin)
- `manager@factory.com` (role: manager)

Then in **SQL Editor**, insert their profiles:
```sql
INSERT INTO profiles (id, full_name, role) VALUES
  ('<admin-uuid-from-auth>', 'Ahmed Admin', 'admin'),
  ('<manager-uuid-from-auth>', 'Hassan Manager', 'manager');
```

### 6. Update next.config.mjs
Replace `your-project.supabase.co` with your actual Supabase project domain.

### 7. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Features

### Admin Dashboard (`/admin`)
- View all submitted receipts with status
- Stats: total, pending, approved, reimbursed amount
- Submit new receipts with image upload (drag & drop)
- View receipt history with status filter

### Manager Dashboard (`/manager`)
- See ALL receipts from all admins
- Pending receipts highlighted for quick action
- Approve or reject with one click
- Add a note when rejecting
- Full receipt detail modal with image viewer

---

## 🗂 Project Structure
```
app/
  login/          — Login page
  admin/
    page.tsx      — Admin dashboard
    new/          — Submit new receipt
    history/      — Receipt history
  manager/
    page.tsx      — Manager dashboard
    pending/      — Only pending receipts
    all/          — All receipts
components/
  Sidebar.tsx     — Navigation sidebar
  ReceiptCard.tsx — Receipt summary card
  ReceiptModal.tsx — Detail view + approve/reject
lib/
  supabase.ts     — Supabase client
types/
  index.ts        — TypeScript types
supabase-schema.sql — Run this in Supabase SQL Editor
```
"# factory-receipts" 
