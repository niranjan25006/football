# Football Club Management System (FCMS) ⚽

A modern, full-stack web application designed for Football Clubs to manage their players, tournaments, fixtures, and grounds. Built as a College Project Submission.

## 🌟 Features
- **Authentication**: JWT-based Admin and User registration/login.
- **Player Management**: Full CRUD operations for players.
- **Tournaments**: Create tournaments and register teams.
- **Fixtures Scheduling**: Automated round-robin fixture generation.
- **Ground Allocation**: Add grounds, capacity checks, and allocate to fixtures.
- **Admin Dashboard**: Modern, glassmorphic UI displaying live statistics.

---

## 🏗 Tech Stack
- **Frontend**: HTML5, CSS3 (Modern Glassmorphism UI), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Security**: JWT Authentication, bcryptjs for password hashing.

---

## 📂 Folder Structure
```text
project/
│
├── client/                 # Frontend Side
│   ├── index.html          # Landing Page & Auth Modal
│   ├── dashboard.html      # Main Dashboard App
│   ├── css/
│   │   └── style.css       # Unified Styles (Dark/Sports Theme)
│   └── js/
│       ├── app.js          # Auth Logic
│       └── dashboard.js    # Data loading and GUI Logic
│
├── server/                 # Backend Node.js API
│   ├── config/
│   │   └── db.js           # Mongoose Connection
│   ├── controllers/        # Express Route Handlers
│   ├── middleware/         # Auth Protections
│   ├── models/             # Mongoose Schemas (*Admin, User, Player, Game...*)
│   ├── routes/             # API Endpoints
│   ├── server.js           # Server Entry Point
│   ├── .env                # Environment Variables (Ignore in Prod)
│   └── package.json
│
└── README.md               # You're reading this!
```

---

## 🚀 Setup Instructions (Local Development)

### Prerequisites
- Node.js installed (v16+)
- MongoDB Community Server installed and running natively, or a MongoDB Atlas URI.

### 1. Backend Setup
1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Initialize Environment Variables. Ensure the `.env` file exists inside `server/` with the following variables:
   ```ini
   MONGO_URI=mongodb://127.0.0.1:27017/football_club
   JWT_SECRET=supersecretkey_college_project
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *(You should see "MongoDB Connected..." and "Server running on port 5000")*

### 2. Frontend Setup
1. The frontend uses plain HTML/CSS/JS, meaning no bundler (like Webpack or Vite) is required!
2. You can simply use **Live Server** (VS Code Extension) on `client/index.html`.
3. Alternatively, simply open `client/index.html` in your browser. (The backend must be running on port `5000` because `API_URL` is hardcoded to `http://localhost:5000/api`).

---

## 🌍 Deployment Guide

### Deploying the Backend
We recommend deploying the backend on **Render.com** or **Railway.app**.

1. Create a `MongoDB Atlas` database cluster online and get the connection string.
2. Push your code to a GitHub Repository.
3. Sign into Render/Railway and connect your GitHub repo.
4. Set the Build Command: `npm install`
5. Set the Start Command: `node server.js`
6. Important: In your hosting dashboard, set the Environment Variables:
   - `MONGO_URI` (Your MongoDB Atlas connection URI)
   - `JWT_SECRET` (A strong random string)

### Deploying the Frontend
Since the frontend is just HTML/CSS/JS, it can be deployed for free on **Vercel** or **Netlify**.

1. Before deploying, edit the API endpoint in `client/js/app.js` and `client/js/dashboard.js`. 
   Change:
   `const API_URL = 'http://localhost:5000/api';`
   To your deployed backend URL:
   `const API_URL = 'https://your-backend-url.onrender.com/api';`
2. Push the code to GitHub.
3. Sign into Vercel/Netlify, create a new project, and deploy the `client` folder.

---

## 🎓 Viva & Project Presentation Questions to Prep For:
1. **How is security handled?**
   > Through JWT (JSON Web Tokens). When you login, the server sends a token which the client saves in `localStorage`. This token must be sent in the header of every authorized request. Passwords are cryptographically hashed using `bcrypt` before storing.
2. **Why MongoDB instead of MySQL (as per original report)?**
   > MongoDB is a NoSQL, JSON-like document database. It is highly scalable and allows easy referencing and population via Mongoose. It fits perfectly into a pure JS environment (MERN/MEN stack) eliminating object-relational mapping (ORM) overhead.
3. **What is Glassmorphism?**
   > A UI trend characterized by a frosted-glass effect, background blur, and semi-transparent backgrounds to give depth to cards and modals. Used heavily in the dashboard for a futuristic look.
4. **How are fixtures scheduled automatically?**
   > Utilizing a round-robin algorithm array loop implemented in Node.js that pushes match objects containing the `Home` and `Away` teams while iterating dates.
