# IN-PACT — Civic Intelligence & Grievance Portal

**IN-PACT** (Integrated National Grievance & Civic Action Portal) is a full-stack civic intelligence platform designed to empower citizens to report, track, and upvote local civic issues while providing administrative bodies with analytics and issue lifecycle management tools.

---

## 🏗️ Project Architecture

```
IN-PACT/
├── Backend/                 # Express.js + MongoDB API
│   ├── server.js            # Server entry point
│   ├── src/
│   │   ├── app.js           # Express app & middleware setup
│   │   ├── config/          # DB connection & system constants
│   │   ├── controllers/     # Auth & issue route handlers
│   │   ├── middleware/      # JWT auth, error handler, async wrapper
│   │   ├── models/          # Mongoose schemas (User, Issue)
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Token generation & utilities
│   └── scripts/             # Seed scripts for initial setup
│
├── Frontend/                # React (Vite) + Tailwind CSS client
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite build configuration
│   └── src/
│       ├── App.jsx          # Main application component
│       ├── components/      # UI components (Header, IssueCard, Stats, etc.)
│       ├── pages/           # Application views/pages
│       └── services/        # API integration services
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (local instance running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### 1. Backend Setup

1. **Navigate to the Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create or verify `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/in-pact
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
   ```

4. **Start the backend development server**:
   ```bash
   npm run dev
   ```
   The API will be available at: `http://localhost:5000/api`

5. *(Optional)* **Seed Database**:
   ```bash
   node scripts/seed.js
   ```

---

### 2. Frontend Setup

1. **Navigate to the Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create or verify `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at: `http://localhost:5173`

---

## 📡 API Reference

### Authentication (`/api/auth`)

| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new citizen account (role defaults to `citizen`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Fetch authenticated user profile (`Bearer <token>`) |

### Issues & Grievances (`/api/issues`)

| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/issues` | Public (optional auth) | Fetch issues (supports `?status=`, `?severity=`, `?category=`, `?department=`, `?page=`, `?limit=`) |
| `GET` | `/api/issues/:id` | Public (optional auth) | Get detailed information for a single issue |
| `POST` | `/api/issues` | Private (Citizen) | Submit a new civic grievance |
| `PATCH` | `/api/issues/:id/status`| Private (Admin) | Update status & resolution notes (`{ status, note }`) |
| `POST` | `/api/issues/:id/upvote`| Private | Toggle upvote on an issue |
| `GET` | `/api/issues/stats` | Private (Admin) | Fetch platform analytics & department metrics |

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ODM), JWT, Helmet, Morgan, CORS, Bcrypt.js
