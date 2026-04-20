# 🗄️ Neon Database Setup Guide

## The Issue

The database migration failed because `DATABASE_URL` in `.env` is pointing to a non-existent or inaccessible database. You need to set up a **Neon** PostgreSQL project first.

## ✅ Quick Setup (5 minutes)

### Step 1: Create Neon Project

1. Go to **[console.neon.tech](https://console.neon.tech)**
2. Sign up (free) or log in
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `ocr-app` (or any name)
   - **Password**: Generate a strong one (copy it!)
   - **Region**: Pick closest to you
5. Click **"Create Project"**

### Step 2: Get Connection String

1. Once project is created, you'll see the dashboard
2. Click on your database name (usually `neondb`)
3. Go to **"Connection strings"** tab
4. Copy the **"Connection string"** (looks like: `postgresql://user:password@host/dbname?sslmode=require`)

### Step 3: Update `.env` File

Edit `backend/.env`:

```bash
# Replace ENTIRE line with your Neon connection string
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR_ENDPOINT.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Generate a secure JWT secret (use this online, or any random string)
JWT_SECRET=your_secure_random_string_at_least_32_chars_long

PORT=5000
NODE_ENV=development
```

⚠️ **Keep these credentials private!** Never commit `.env` to git (it's in `.gitignore`).

### Step 4: Test Connection & Create Tables

```bash
cd backend

# Verify connection
npm run db:push
```

If successful, your `users` table will be created automatically! 🎉

---

## 🔧 Troubleshooting

### Still getting ETIMEDOUT?

**Cause**: Connection string is invalid or database doesn't exist

**Fix**:

1. Go back to [console.neon.tech](https://console.neon.tech)
2. Create a new project (old one might be deleted after 7 days of inactivity)
3. Copy the **new** connection string
4. Update `.env` file
5. Run `npm run db:push` again

### Command not found: npm run db:push?

Make sure you're in the `backend/` folder:

```bash
cd backend
npm run db:push
```

### Still doesn't work?

Generate migrations without pushing (for development):

```bash
npm run db:generate
```

Then when you have a live database connection, run:

```bash
npm run db:push
```

---

## 📚 Useful Neon Features

- **Free tier**: 3 projects, unlimited databases
- **Auto-suspend**: Projects sleep after 7 days of inactivity (can wake up)
- **Branching**: Create dev/staging branches easily
- **Monitoring**: View query logs, performance stats

---

## ✨ Once Database is Set Up

Your backend is ready to:

- Register new users (hashed passwords with bcrypt)
- Login with JWT tokens
- Protect OCR routes

Then start both servers:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

Visit `http://localhost:4000` → Register → Use OCR! 🎉
