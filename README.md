# OCR App

A full-stack OCR web application with authentication, multilingual text extraction, speech playback, and AI-assisted post-processing.

## Features

- User authentication (register/login) with JWT
- Protected OCR workspace route
- OCR extraction using `tesseract.js`
- Language presets for:
  - English
  - Sinhala
  - Tamil
  - All three combined
- Image preprocessing with OpenCV.js:
  - Grayscale
  - Adaptive threshold
  - Denoise
  - Sharpen
  - Full enhancement pipeline
- Image crop controls before OCR
- Text-to-speech playback (ResponsiveVoice)
- Copy extracted text to clipboard
- Download extracted text as `.doc`
- AI chat assistant for summarize/translate/fix OCR output (Groq API)

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router
- Tailwind CSS
- Tesseract.js
- OpenCV.js (loaded from CDN)

### Backend

- Node.js + Express
- PostgreSQL (Neon recommended)
- Drizzle ORM / Drizzle Kit
- Zod validation
- bcryptjs
- JWT (`jsonwebtoken`)
- Helmet + CORS

## Project Structure

```text
ocr-app/
├── src/
│   ├── components/          # UI building blocks
│   ├── contexts/            # Auth context/state
│   ├── hooks/               # OCR, OpenCV, speech, AI chat hooks
│   ├── pages/               # Login, register, OCR app pages
│   ├── utils/               # Image preprocessing/language detection helpers
│   └── constants/           # OCR/TTS/preprocessing presets
├── backend/
│   ├── db/                  # Drizzle schema + DB connection
│   ├── middleware/          # JWT helpers/middleware
│   ├── routes/              # Auth endpoints
│   ├── schemas/             # Zod request schemas
│   ├── server.js            # Express entrypoint
│   └── drizzle.config.js    # Drizzle configuration
├── AUTH_SETUP.md
├── NEON_SETUP.md
└── README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL database (Neon suggested)

## Environment Variables

### Frontend (`/home/runner/work/ocr-app/ocr-app/.env`)

The project includes `/home/runner/work/ocr-app/ocr-app/.env.example`:

```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Recommended additional frontend variable:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is not set, frontend defaults to `http://localhost:5000`.

### Backend (`/home/runner/work/ocr-app/ocr-app/backend/.env`)

The project includes `/home/runner/work/ocr-app/ocr-app/backend/.env.example`:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require&channel_binding=require
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

## Setup and Run

### 1) Install dependencies

Frontend:

```bash
cd /home/runner/work/ocr-app/ocr-app
npm install
```

Backend:

```bash
cd /home/runner/work/ocr-app/ocr-app/backend
npm install
```

### 2) Configure environment files

Frontend:

```bash
cd /home/runner/work/ocr-app/ocr-app
cp .env.example .env
# then edit .env and add VITE_API_URL if needed
```

Backend:

```bash
cd /home/runner/work/ocr-app/ocr-app/backend
cp .env.example .env
# then edit .env with DATABASE_URL and JWT_SECRET
```

### 3) Push database schema

```bash
cd /home/runner/work/ocr-app/ocr-app/backend
npm run db:push
```

### 4) Start backend

```bash
cd /home/runner/work/ocr-app/ocr-app/backend
npm run dev
```

Backend default URL: `http://localhost:5000`

### 5) Start frontend

```bash
cd /home/runner/work/ocr-app/ocr-app
npm run dev
```

Frontend default URL: `http://localhost:5173` (or next free port)

## Available Scripts

### Frontend (`/home/runner/work/ocr-app/ocr-app/package.json`)

- `npm run dev` – start Vite dev server
- `npm run build` – build production frontend bundle
- `npm run lint` – run ESLint
- `npm run preview` – preview production build

### Backend (`/home/runner/work/ocr-app/ocr-app/backend/package.json`)

- `npm run dev` – run backend with Node watch mode
- `npm run start` – run backend in normal mode
- `npm run db:push` – push Drizzle schema to PostgreSQL

## API Endpoints

Base URL (local): `http://localhost:5000`

### Health

- `GET /health` → `{ "status": "OK" }`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

#### Register request

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

Password rules:

- Minimum 8 characters
- At least one uppercase letter
- At least one number

#### Login request

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Successful auth responses return:

- `message`
- `user` object (`id`, `email`, `name`)
- `token` (JWT)

## OCR Workflow

1. Register or login
2. Upload an image
3. Optionally crop image
4. Optionally apply preprocessing
5. Select OCR language preset
6. Extract text
7. Copy, download, speak, or chat about extracted text

## External Services and Runtime Notes

- OpenCV.js is loaded from `https://docs.opencv.org/4.x/opencv.js`
- ResponsiveVoice script is loaded from `https://code.responsivevoice.org/...`
- AI chat uses Groq Chat Completions API and requires `VITE_GROQ_API_KEY`
- Internet access is required for those external scripts/APIs

## Security Notes

- Do not commit `.env` files
- Use a strong random `JWT_SECRET` in production
- Restrict CORS origins in production backend deployments
- Rotate API/database credentials if exposed

## Troubleshooting

- **`eslint: not found`**  
  Run `npm install` in the project root first.

- **Database push fails**  
  Verify `DATABASE_URL` and your Neon/PostgreSQL connectivity. See `NEON_SETUP.md`.

- **Auth requests fail from frontend**  
  Confirm backend is running and `VITE_API_URL` points to it.

- **Chat says API key missing**  
  Set `VITE_GROQ_API_KEY` in frontend `.env`.

- **Preprocessing unavailable**  
  Wait for OpenCV to finish loading; UI shows readiness state.

## Additional Docs

- `/home/runner/work/ocr-app/ocr-app/AUTH_SETUP.md`
- `/home/runner/work/ocr-app/ocr-app/NEON_SETUP.md`
