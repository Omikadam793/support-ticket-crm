# Support Ticket CRM — Customer Operations Command Deck

A production-ready, full-stack Customer Support Ticketing CRM application engineered as part of the Datastraw Assessment Test for the Data Engineer Intern position. This platform empowers support agents to monitor operational metrics, log incoming customer tracking payloads securely, execute real-time property searches, filter by lifecycle statuses, and manage individual issue resolution workspaces.

## 🚀 Live Production Links
* **Live Frontend Interface (Vercel):** https://support-crm-frontend-11bep7tdd-omi-kadam-s-projects.vercel.app/
* **Live Backend Engine API (Render):** https://support-crm-backend.onrender.com
* **Walkthrough Demo Video:** *[Paste your Loom/Drive video link here]*

---

## 🛠️ Tech Stack & Structural Architecture
The application uses a decoupled Single Page Application (SPA) architecture engineered to maintain state reactivity and low-latency API handshaking:

* **Frontend Framework:** React.js (built via Vite for highly optimized asset compilation and fast modular reloads).
* **Routing Engine:** React Router Dom (enables dynamic client-side pagination routing without inducing full browser viewport refreshes).
* **Backend Runtime Environment:** Node.js with the Express.js framework for handling secure RESTful routing structures.
* **Network Handshaking:** Axios Client with cross-origin resource sharing (`CORS`) configurations.
* **Data Persistence Partition:** In-memory collection schemas structured with defensive programmatic calculations to prevent data collisions.

---

## ✨ Features Implemented

1. **Support Agent Command Center Dashboard:** A data grid interface displaying key system metrics ("Total Managed Cases" and "Active/Open Tickets") alongside real-time data table streams.
2. **Dynamic Multi-Property Search Engine:** On-the-fly search calculations matching string substrings across **Ticket ID**, **Customer Name**, or **Subject Title** keys instantly.
3. **Segmented Status Filtering Toolbar:** Single-click UI filtering tabs enabling agents to isolate issues down to their specific lifecycle parameters (`All`, `Open`, `In Progress`, `Closed`).
4. **Interactive Status & Notes Workspace:** Dedicated, parameterized view panels allowing full lifecycle updates (`PUT` operations) to alter status badge matrices and save internal administrative logs.
5. **Defensive Form Validation & UI States:** Custom error banners capturing missing form fields or email format issues, paired with global loading spinners and structured "No matching records found" empty state views.
6. **100% Mobile Responsive Grid layout:** Custom layout properties featuring horizontal swiping table enclosures (`overflowX`) and flexible wrap styling (`flexWrap`) ensuring full suitability for mobile screens.

---

## 💻 Local Installation & Setup

To replicate and audit this infrastructure sequence on your local terminal environment, clone this repository and follow the initialization procedures:

### 1. Initialize the Backend API Engine
```bash
cd backend
npm install
npm start

2. Initialize the Frontend Workspace

cd ../frontend
npm install
npm run dev

🧠 Technical Approaches & Overcoming Challenges

    CI/CD Build Pipeline Restructuring: During production compilation, the bundler encountered strict duplicate component layout exports. I ran local npm run build diagnostic checks to sweep the source structure, isolated the conflicting state hook contexts, and deployed clean rewrite rules to funnel trailing paths securely back to the React root template.

    Auto-Increment Key Collision Prevention: To safeguard our in-memory data arrays from duplicating ID integers when modifying entries, I refactored the database ingestion layer (POST) to actively search for the maximum ID value present via Math.max() arithmetic algorithms before executing push routines.