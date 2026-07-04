# MedQuality — Online Testing and Monitoring of Quality of Medicines and Consumables

A full stack web application for lab technicians and administrators to test, monitor and track the quality of medicines and consumables in real time.

---

## 🌐 Live Demo

> Open `frontend/home.html` in your browser after starting the backend server.

---

## 📋 Project Description

MedQuality is a comprehensive quality monitoring system that allows:
- **Lab Technicians** to submit quality test results for medicines and consumables
- **Administrators** to monitor quality trends via dashboard analytics
- **General Public** to check medicine quality without logging in

---

## ✨ Features

- 🔐 Role based authentication (Admin / Lab Technician)
- 💊 Medicine catalog management (add, view, delete)
- 🧪 Consumable tracking with stock status
- 📋 Quality test submission with photo upload
- 🤖 Automatic pass/fail determination based on quality thresholds
- 🔔 Auto alert generation when quality fails
- 📊 Dashboard with charts (Chart.js)
- 📷 Photo evidence upload (Cloudinary)
- 📄 Printable quality reports
- 🔍 Public medicine quality checker (no login required)
- 📱 Responsive design with sidebar navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | bcryptjs |
| File Storage | Cloudinary |
| Charts | Chart.js |
| Animations | AOS.js |

---

## 📁 Project Structure
medicine-quality-project/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Medicine.js
│   │   ├── TestResult.js
│   │   ├── Alert.js
│   │   └── Consumable.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── medicines.js
│   │   ├── testResults.js
│   │   ├── alerts.js
│   │   └── consumables.js
│   ├── cloudinary.js
│   ├── server.js
│   └── seed.js
│
└── frontend/
├── home.html
├── index.html
├── signup.html
├── dashboard.html
├── medicines.html
├── consumables.html
├── test-results.html
├── alerts.html
├── report.html
├── check.html
├── style.css
├── script.js
├── dashboard.js
├── medicines.js
├── consumables.js
├── test-results.js
├── alerts.js
├── report.js
└── check.js

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account (free)
- Cloudinary account (free)

### Installation

**Step 1 — Clone the repository**
```bash
git clone https://github.com/hemapriya166/medicine-quality-project.git
cd medicine-quality-project
```

**Step 2 — Install backend dependencies**
```bash
cd backend
npm install
```

**Step 3 — Create `.env` file in backend folder**
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

**Step 4 — Seed the database (optional)**
```bash
node seed.js
```

**Step 5 — Start the server**
```bash
node server.js
```

**Step 6 — Open the frontend**

Open `frontend/home.html` in your browser.

---

## 🔑 Default Login Credentials

After running the seed script:

| Username | Password | Role |
|---|---|---|
| admin | admin123 | Admin |

---

## 📊 Quality Check Parameters

### Medicines
| Parameter | Pass criteria |
|---|---|
| Purity | ≥ 95% |
| pH level | Between 5.5 and 7.5 |

### Consumables
| Parameter | Pass criteria |
|---|---|
| Condition | Good |
| Expiry date | Future date |

---

## 🔔 Alert System

Alerts are automatically generated when:
- Medicine purity falls below 95% → **Critical alert**
- Medicine pH is out of range → **Warning alert**
- Consumable is damaged → **Warning alert**
- Consumable is expired → **Critical alert**

---

## 📱 Pages

| Page | Access | Description |
|---|---|---|
| home.html | Public | Landing page |
| check.html | Public | Medicine quality checker |
| index.html | Public | Login page |
| signup.html | Public | Create account |
| dashboard.html | Login required | Stats and charts |
| medicines.html | Login required | Medicine catalog |
| consumables.html | Login required | Consumables tracking |
| test-results.html | Login required | Submit and view tests |
| alerts.html | Login required | Quality alerts |
| report.html | Login required | Printable report |

---

## 👩‍💻 Author

Developed as a college mini project for the course submission.

---

## 📄 License

This project is for educational purposes only.

