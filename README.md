# SARC EventHub Portal

SARC EventHub is a web portal built for the **Student Alumni Relations Cell (SARC), IIT Bombay**, providing an interface for university event management and registration evaluation. 

The application is built using a decoupled architecture, combining a **Django REST Framework backend** with a **Next.js 16 frontend**. The UI features a premium, responsive dark-mode tech aesthetic.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Framer Motion, Axios, Lucide React
- **Backend:** Django 6.0.5, Django REST Framework, Django SimpleJWT (JSON Web Tokens)
- **Database:** SQLite3

---

## 📋 Features Checklist

| Feature | Description |
| :--- | :--- |
| **JWT Authentication** | Secure user login, registration, and role validation. |
| **Role-Based Access** | Separation between student view and admin operation panel. |
| **Live Capacity Tracker** | Real-time seat updates with dynamic indicator states. |
| **SARC Operations Panel** | Admin tab configuration for event CRUD and review queues. |
| **My Registrations Hub** | Student panel to monitor individual registrations and statuses. |
| **Immersive Detail Page** | Immersive split-column design with event tags and quick info. |

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/intangible-hub/SARC-Web-Convener.git
cd SARC-Web-Convener
```

### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### 3. Frontend Setup (Next.js)
```bash
cd ../frontend
npm install
npm run dev
```
