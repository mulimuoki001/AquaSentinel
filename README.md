# 🌱 AquaSentinel

**AquaSentinel** is a full-stack smart irrigation monitoring dashboard tailored for Rwanda’s Small-Scale Irrigation Technology (SSIT) ecosystem. It enables farmers, irrigation service providers, and government actors to monitor real-time water usage, soil moisture, and system performance from a centralized platform.

---

## 📌 Project Overview

- 🔍 **Problem**: Farmers using SSIT kits lack real-time insights into their irrigation performance, leading to water waste and reduced yields.
- ✅ **Solution**: AquaSentinel provides role-based dashboards that visualize key data, deliver smart irrigation recommendations, and track usage history.

---

## 🔧 Tech Stack

### 💻 Frontend
- React + Vite + TypeScript
- React Router DOM
- Axios

### 🛠 Backend
- Node.js + Express + TypeScript
- PostgreSQL (via `pg` package)
- JWT-based Authentication

### ☁️ Deployment
- **Heroku** (Backend + PostgreSQL)
- Frontend bundled and served via Express static hosting

---

## 🚀 Features

### 👩‍🌾 Farmer Dashboard
- View real-time water usage
- Monitor soil moisture per plot
- Receive smart irrigation recommendations
- Access irrigation history and export logs

### 🛠 Provider Dashboard
- View connected farms & system health
- Generate usage and maintenance reports
- Assign technician tasks

### 🏛️ Government Dashboard
- Analyze irrigation coverage and performance
- Monitor subsidy impacts and district-level efficiency

---

## ⚙️ Installation (Local Setup)

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/aquasentinel.git
   cd aquasentinel/Backend
2. **Install Dependencies**
   ```bash
   npm install

3. **Build frontend**
   ```bash
    cd ../aquasentinel-frontend
    npm install
    npm run build
    cp -r dist ../Backend/public


4. **Set up PostgrSQL**
   ```bash
   DATABASE_URL=postgres://your_user:your_pass@localhost:5432/aquasentineldb
    JWT_SECRET=your_secret
    PORT=3000

5. **Build Backend**
   ```bash
    npm run build

6. **Run the app**
   ```bash
   node dist/server.js



---

## 🌍 Live Demo

🔗 [**Visit the Live App on Heroku**](https://aqua-sentinel-109c335846c9.herokuapp.com)

Use the app to:
- Monitor water usage by plot
- View current soil moisture status
- Receive AI-powered irrigation tips
- Access historical irrigation logs
- Export data (PDF/CSV)

---

## 🧑‍💻 User Roles and Dashboards

| Role             | Access Path                     | Features |
|------------------|----------------------------------|----------|
| **Farmer**       | `/dashboard/farmer`             | Real-time stats, smart tips, logs |
| **Service Provider** | `/dashboard/provider`        | Regional analytics, technician tasks |
| **RAB / Ministry**   | `/dashboard/RAB`             | Adoption metrics, performance reports |

➡️ Register and log in at:
- `/register`
- `/` (Login page)

---

## 🔐 Authentication

All dashboards require **login via JWT tokens**.

After login:
- A token is stored in `localStorage`
- All secure routes are protected on both frontend and backend

---

## ⚙️ Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (via Heroku Postgres)
- **Deployment**: Heroku
- **API Security**: JWT-based Auth
- **Other Tools**: Axios, React Router DOM, pg

---

## 🔎 API Highlights (Secured with Bearer Tokens)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /dashboard/farmer`
- `GET /dashboard/provider`
- `GET /dashboard/RAB`

