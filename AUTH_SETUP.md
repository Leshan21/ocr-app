# Authentication & OCR App Setup Guide

This project now includes a complete authentication system with backend and frontend separation.

## ✨ Features Added

- **User Authentication**: Register and login with email/password
- **Password Hashing**: Secure password storage with bcrypt
- **JWT Tokens**: Secure session management with 7-day expiration
- **Protected Routes**: OCR app is only accessible when authenticated
- **Input Validation**: Zod schemas for robust type-safe validation
- **Security Headers**: Helmet.js for production-grade security
- **Database**: PostgreSQL with Neon (serverless) + Drizzle ORM

## 🗁️ Project Structure

```
ocr-app/
├── src/                          # Frontend (React + Vite)
│   ├── contexts/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── pages/
│   │   ├── LoginPage.jsx         # Login form
│   │   ├── RegisterPage.jsx      # Registration form
│   │   └── OcrApp.jsx            # Protected OCR app
│   ├── components/
│   │   ├── ProtectedRoute.jsx    # Auth guard component
│   │   └── [other components]
│   ├── App.jsx                   # Main routing setup
│   └── main.jsx                  # App entry point
│
└── backend/                      # Node.js + Express server
    ├── db/
    │   ├── schema.js             # Drizzle ORM schema
    │   └── index.js              # Database connection
    ├── middleware/
    │   └── auth.js               # JWT middleware
    ├── schemas/
    │   └── auth.js               # Zod validation schemas
    ├── routes/
    │   └── auth.js               # Authentication endpoints
    ├── server.js                 # Express server setup
    ├── drizzle.config.js         # Drizzle configuration
    └── package.json              # Backend dependencies
```

## 🚀 Getting Started

### Part 1: Backend Setup

1. **Navigate to backend**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Neon database**:
   - Go to [Neon Console](https://console.neon.tech)
   - Create a new PostgreSQL project
   - Copy the connection string

4. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your values:
   # DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
   # JWT_SECRET=your_super_secret_key_change_in_production
   ```

5. **Create database tables**:

   ```bash
   npm run db:push
   ```

6. **Start backend server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Part 2: Frontend Setup

1. **Back to project root**:

   ```bash
   cd ..
   ```

2. **Install dependencies** (if needed):

   ```bash
   npm install
   ```

3. **Configure frontend environment**:
   - Edit `.env.local` if needed (already created)
   - Verify `VITE_API_URL=http://localhost:5000`

4. **Start frontend dev server**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:4000` (or next available port)

## 🔐 API Endpoints

### POST `/api/auth/register`

Register a new user.

**Request**:

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Response**:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### POST `/api/auth/login`

Login with email and password.

**Request**:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response**:

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

## 🔒 Stack Technologies

- **Frontend**: React 19, Vite, React Router, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Security**: JWT, bcryptjs, Helmet
- **Validation**: Zod
- **Styling**: Tailwind CSS

## 📝 Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number

## 🛠️ Development Commands

**Frontend**:

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend**:

- `npm run dev` - Start dev server with auto-reload
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database

## 📦 Production Deployment

1. Build frontend:

   ```bash
   npm run build
   ```

2. Deploy frontend to Vercel, Netlify, or your hosting

3. Deploy backend to:
   - Heroku
   - Railway
   - Render
   - Fly.io

4. Update `VITE_API_URL` to production backend URL

5. Update JWT_SECRET to a strong random value in production

## ⚙️ Troubleshooting

**"Cannot find module" errors**: Ensure both frontend and backend node_modules are installed
**Database connection fails**: Verify DATABASE_URL is correct and Neon project is running
**CORS issues**: Check backend CORS settings match frontend URL
**Build fails**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📚 Learn More

- [Drizzle ORM](https://orm.drizzle.team)
- [Zod Validation](https://zod.dev)
- [JWT.io](https://jwt.io)
- [Neon Database](https://neon.tech)
