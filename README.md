# Support Ticket CRM — Customer Operations Command Deck

A professional full-stack Support Ticketing System built to monitor, manage, and resolve customer support queries in real-time.

## 🔗 Project Links

**Live Application:**
https://support-crm-frontend.vercel.app/

**GitHub Repository:**
https://github.com/Omikadam793/support-ticket-crm

## 🚀 Features

* **Real-time Analytics:** Automated calculation of backlog and resolution metrics.
* **Full CRUD Operations:** Create, Read, Update, and Delete support tickets.
* **Persistent Data:** Integrated with PostgreSQL for secure cloud storage.
* **Dynamic Deployment:** Configured for seamless deployment on Vercel and Render.

## 🛠 Tech Stack

* **Frontend:** React, Vite, Axios, React Router.
* **Backend:** Node.js, Express, CORS, dotenv.
* **Database:** PostgreSQL (via Supabase).
* **Hosting:** Vercel (Frontend), Render (Backend).

## ⚙️ Local Development Setup

### Clone the repository

```bash
git clone <your-repo-url>
cd <your-folder-name>
```

### Backend Setup

```bash
cd backend
npm install
# Create a .env file with DATABASE_URL=<your-supabase-connection-string>
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000
npm run dev
```

## 🌐 Deployment Architecture

The application uses environment variables to switch automatically between local development and cloud production.

* **Frontend (Vercel):** Automatically builds and deploys on push to main.
* **Backend (Render):** Automatically restarts and serves the API on push to main.

## 📝 Environment Variables

| Variable     | Usage                                 |
| ------------ | ------------------------------------- |
| DATABASE_URL | Supabase/PostgreSQL connection string |
| VITE_API_URL | Production URL of the Render backend  |