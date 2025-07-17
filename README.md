# 🌱 AquaSentinel

**AquaSentinel** is a full-stack smart irrigation monitoring dashboard tailored for Rwanda’s Small-Scale Irrigation Technology (SSIT) ecosystem. It enables farmers, irrigation service providers, and government actors to monitor real-time water usage, soil moisture, and system performance from a centralized platform.

---

## 📌 Project Overview

- 🔍 **Problem**: Farmers using SSIT kits lack real-time insights into their irrigation performance, leading to water waste and reduced yields.
- ✅ **Solution**: AquaSentinel provides role-based dashboards that visualize key data, deliver smart irrigation recommendations, and track usage history.

---

## [**Repo Link**](https://github.com/mulimuoki001/AquaSentinel)

## 🔧 Tech Stack

### 💻 Frontend
- React + Vite + TypeScript
- React Router DOM
- Axios
- i18n

### 🛠 Backend
- Node.js + Express + TypeScript
- PostgreSQL (via `pg` package)
- JWT-based Authentication
- Twilio

### ☁️ Deployment
- **Railway** (Backend + PostgreSQL)
- The Railway is connected to the repo and is always listening to any changes made in the repo.
- There is a Dockerfile  at the root of the project, which is used by Railway to create an image  and run the app in a container.

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
2. **Run the app-run.sh file at the root of the project**
   This file installs all dependencies, both frontend and backend, builds the frontend, copies the static frontend to the backend, and runs the backend
   ```bash
   ./app-run.sh

The app should be running on:
      
      http://localhost:3000/

   Or follow this process to run the app step by step
1. **Build frontend**
   ```bash
    cd ../aquasentinel-frontend
    npm install
    npm run build
    cp -r dist ../Backend/public


2. **Set up PostgreSQL**
   Make sure you have a PostgreSQL DB set up already, then use these steps to connect it to the backend API
   ```bash
   DATABASE_URL=postgres://your_user:your_pass@localhost:5432/aquasentineldb
    JWT_SECRET=your_secret
    PORT=3000

3. **Run the app**
   Note//: There is no need to build the backend.
      
   ```bash
     npm run start

---

## Live Demo and Deployed App Access
Visit Google for more information, including the testing and analysis write-up.

🔗 [**Final Product Demo and Deployed App Details**](https://docs.google.com/document/d/1Ume-R8rSJPZJruNv_J3eBipydOcets3vu34gub3ZptM/edit?usp=sharing)


Use the app to:
- Monitor water usage by plot
- View current soil moisture status
- Receive AI-powered irrigation tips
- Access historical irrigation logs
- Export data (PDF/CSV)

---

## User Roles and Dashboards

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
- All secure routes are protected on both the frontend and backend

---

## 🔎 API Highlights (Secured with Bearer Tokens)

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /dashboard/farmer`
- `GET /dashboard/provider`
- `GET /dashboard/RAB`

---
## 🎨 UX/UI Design

The user interface and experience of AquaSentinel were designed using **Figma**, following a role-based, mobile-first approach to ensure clarity, usability, and accessibility across different user types.

Key design considerations:
- 📱 **Mobile-first responsiveness** for accessibility in rural field environments
- 🧭 **Clear navigation flow** for farmers, service providers, and government officials
- 🎯 **Role-based UI layouts** tailored to the specific needs of each user type
- 🖍️ **Accessible color palette** to enhance visibility for low-light field usage
- 📐 **Component-based structure** for scalable and consistent styling
- 💡 **Smart recommendations and alert icons** to highlight critical irrigation issues

🔗 [View Figma Design Prototype](https://www.figma.com/design/zGQKLuGimZMtkcjFn0JGZS/AquaSentinel-Dashboard-Designs?node-id=308-14250&t=M8WpbPqWjnarsdtz-1)  


---

## The End.





