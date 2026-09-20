# 🏛️ IN-PACT — Integrated National Grievance & Civic Action Portal

<div align="center">

![IN-PACT Banner](https://img.shields.io/badge/Govt.%20of%20India-MoHUA%20%26%20GNIDA-002B49?style=for-the-badge&logo=india&logoColor=white)
![React](https://img.shields.io/badge/React_19-Vite_8-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Groq AI](https://img.shields.io/badge/Nagrik_AI-LLaMA_3.3_70B-F55036?style=for-the-badge&logo=openai&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend_Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend_Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

<br/>

**Official Civic Intelligence, AI Multi-Modal Grievance Redressal, and Statutory Governance System**  
*Built for the Ministry of Housing & Urban Affairs (MoHUA), Greater Noida Industrial Development Authority (GNIDA), and Indian Municipal Corporations.*

[🌐 Live Portal (Vercel)](https://in-pact-nu.vercel.app) • [📡 Backend API (Render)](https://in-pact.onrender.com/api/health) • [📂 GitHub Repository](https://github.com/Parth00231/IN-PACT)

</div>

---

## 🌟 Core Highlights & Capabilities

### 1. 🤖 Nagrik AI 24x7 Civic Assistant
* **Interactive AI Concierge**: Powered by Groq's high-throughput LLaMA 3.3 70B Versatile engine.
* **Instant Grievance Tracking**: Citizens can type natural inquiries or reference codes (e.g. `Track RN20260920A8091`) to retrieve real-time status cards, assigned nodal engineers, and SLA clocks.
* **Civic FAQ & Directory**: Explains citizen charters, escalation matrices, department contacts, and 24x7 emergency helplines (`1913`).

### 2. 📸 AI Multi-Modal Grievance Ingestion
* **Computer Vision & NLP Diagnostic**: Analyzes uploaded photos or live camera captures alongside problem descriptions to auto-determine:
  - **Category**: Roads, Drainage, Electrical, Solid Waste, Water Supply, Street Lighting.
  - **Nodal Department & Officer**: Public Works Dept (PWD), UP Jal Nigam, NPCL Grid, GNIDA Health.
  - **Priority & Mandated SLA**: Statutory response turnaround under the *UP Janhit Guarantee Act*.
* **Digital Verification Geotagging**: Captures GPS coordinates and reverse-geocodes them to verified municipal wards.

### 3. 🎫 Statutory Reference Numbering (`RN...`)
* Generates standardized Indian government grievance IDs formatted as:  
  `RN<YYYYMMDD><A-Z><XXXX>` (e.g., `RN20260920A8091`), ensuring seamless tracking across portal, chatbot, and SMS gateways.

### 4. 👥 Community Action Feed & Democratic Upvoting
* Local citizens can browse neighborhood complaints, upvote civic priorities ("Raise Hand"), and escalate community hazards to nodal supervisors.

### 5. 🛡️ Executive & Officer Command Console
* Real-time triage queues for field engineers and supervisors.
* Status update workflows (`Submitted` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved & Verified`).
* GIS hotspot heatmap, ward resolution analytics, and statutory audit logging.

### 6. 📱 100% Mobile & Desktop Responsive
* Custom Indian Government design system (NIC/MoHUA aesthetic) optimized for mobile browsers, tablets, and laptops.
* Features touch-friendly tab navigation, collapsable steppers, and responsive table wrappers.

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |         Citizen & Officer UI          |
                                  |    (React 19 + Vite + Tailwind CSS)   |
                                  |       Deployed on Vercel SPA          |
                                  +-------------------+-------------------+
                                                      |
                                    HTTPS / REST APIs | WebSocket / Geolocation
                                                      v
                                  +---------------------------------------+
                                  |          IN-PACT Backend API          |
                                  |      (Node.js + Express + Helmet)     |
                                  |         Deployed on Render            |
                                  +---------+-------------------+---------+
                                            |                   |
                     +----------------------+                   +----------------------+
                     |                                                                 |
                     v                                                                 v
+----------------------------------------+                           +----------------------------------------+
|           MongoDB Atlas DB             |                           |             Groq AI Engine             |
|   (Grievances, Users, Audit Logs,      |                           |     (Nagrik AI Assistant / LLaMA 3.3)  |
|          Ward SLA Analytics)           |                           |  Natural Language Grievance Tracking   |
+----------------------------------------+                           +----------------------------------------+
```

---

## 📂 Repository Structure

```
IN-PACT/
├── Backend/                        # Node.js + Express.js API
│   ├── server.js                   # Server entry point
│   ├── src/
│   │   ├── app.js                  # Express middleware, CORS, and route aggregation
│   │   ├── config/                 # MongoDB database connection
│   │   ├── controllers/            # Grievance, Auth, and Analytics business logic
│   │   ├── middleware/             # JWT authentication, RBAC, error handlers
│   │   ├── models/                 # Mongoose schemas (User, Issue, AuditLog)
│   │   ├── routes/                 # Express API route declarations
│   │   └── utils/                  # Token utilities & reference generators
│   └── package.json
│
├── Frontend/                       # React 19 + Vite Client
│   ├── index.html                  # HTML template with Gov of India meta tags
│   ├── vercel.json                 # Vercel SPA rewrite routing configuration
│   ├── vite.config.js              # Vite bundler configuration
│   ├── src/
│   │   ├── App.jsx                 # Main state, router, and session manager
│   │   ├── App.css                 # Government Portal CSS & Responsive design system
│   │   ├── components/             # Reusable UI (Navbar, Footer, NagrikAIChatbot, MapView, StatCard, Sidebar)
│   │   ├── pages/                  # CitizenDashboard, GovernmentDashboard, Home, CitizenLogin, GovernmentLogin
│   │   ├── services/               # API clients, AI Classifier, Nagrik AI service, Location service
│   │   └── utils/                  # Reference numbering algorithms & helpers
│   └── package.json
│
└── README.md                       # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0 or newer)
* [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)
* [Groq API Key](https://console.groq.com/) *(Optional, for live Nagrik AI chatbot)*

---

### 1. Backend Setup

1. **Navigate to the Backend folder**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `Backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/in-pact
   JWT_SECRET=inpact_super_secure_jwt_secret_key_2026
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173
   ```

4. **Start Backend Server**:
   ```bash
   npm run dev
   ```
   *The API will start at:* `http://localhost:5000/api`

---

### 2. Frontend Setup

1. **Navigate to the Frontend folder**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `Frontend/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   *The portal will be accessible at:* `http://localhost:5173`

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Citizen account |
| `POST` | `/api/auth/login` | Public | Login and receive signed JWT token |
| `GET` | `/api/auth/me` | Private | Fetch authenticated user profile (`Bearer <token>`) |

### 📋 Grievances & Issues (`/api/issues`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/issues` | Public | Query grievances (`?status=`, `?severity=`, `?category=`, `?ward=`) |
| `GET` | `/api/issues/:id` | Public | Fetch grievance by ID or reference number (`RN...`) |
| `POST` | `/api/issues` | Private | Submit a new civic grievance with geotag & image |
| `PATCH` | `/api/issues/:id/status` | Private (Officer) | Update grievance lifecycle status & resolution notes |
| `POST` | `/api/issues/:id/upvote` | Private | Toggle community "Raise Hand" vote on an issue |
| `GET` | `/api/issues/stats` | Private (Officer) | Retrieve ward resolution rates and statutory SLA metrics |

---

## 🌐 Production Deployment

| Service | Platform | Configuration |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Configured with `vercel.json` SPA rewrites & asset optimization. |
| **Backend** | **Render** | Node.js web service connected to MongoDB Atlas cluster with auto-health checks. |

---

## 📜 Statutory Compliance & Design Standards
* **Design Standards**: Compliant with **Guidelines for Indian Government Websites (GIGW 3.0)** and **National Informatics Centre (NIC)** aesthetics.
* **Legal Framework**: Aligned with the **Uttar Pradesh Janhit Guarantee Act** for mandatory public service turnaround times.

---

## 👨‍💻 Author & Attribution

* **Project**: IN-PACT (Integrated National Grievance & Civic Action Portal)
* **Lead Developer**: [Parth](https://github.com/Parth00231)
* **Repository**: [https://github.com/Parth00231/IN-PACT](https://github.com/Parth00231/IN-PACT)
* **License**: MIT License
