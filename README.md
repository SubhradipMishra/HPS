# 🏥 CareSync – Smart Hospital Appointment Booking System

CareSync is a **production-level backend system** that enables patients to find nearby hospitals, explore doctors, check availability, and book appointments seamlessly.

---

## 🚀 Features

### 👤 Patient

* 📍 Find nearby hospitals (geo-based)
* 🏥 Browse departments
* 👨‍⚕️ View doctors by department
* ⏱️ Check real-time slots
* 📅 Book appointment
* ❌ Cancel appointment (slot becomes reusable)
* 📜 View appointment history

---

### 👨‍⚕️ Doctor

* 📆 View today’s appointments
* ⏳ View upcoming appointments
* ✅ Mark appointment as completed

---

### 🏥 Admin

* Add departments
* Add doctors
* Manage doctor availability

---

### 🛠️ Super Admin (CLI)

* Create hospital
* Create first admin
* Assign hospital to admin

---

## 🧠 System Flow

```
User Location
   ↓
Nearby Hospitals
   ↓
Select Hospital
   ↓
Departments
   ↓
Doctors
   ↓
Available Slots
   ↓
Book Appointment
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB (Mongoose)
* GeoSpatial Queries (2dsphere index)

---

## 📦 Project Structure

```
backend/
│
├── cli/
│   └── createHospital.ts
│
├── src/
│   ├── admin/
│   ├── appointment/
│   │   ├── appointment.controller.ts
│   │   ├── appointment.interface.ts
│   │   ├── appointment.model.ts
│   │   ├── appointment.route.ts
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.model.ts
│   │
│   ├── doctor/
│   ├── department/
│   ├── hospital/
│   ├── doctoravailability/
│   │
│   ├── utils/
│   │   └── slotGenerator.ts
│
├── dist/
├── package.json
├── tsconfig.json
```

---

## ⚡ Installation & Setup

### 1️⃣ Clone repo

```
git clone https://github.com/your-username/caresync.git
cd caresync/backend
```

---

### 2️⃣ Install dependencies

```
npm install
```

---

### 3️⃣ Setup environment variables

Create `.env` file:

```
PORT=7070
MONGO_URI=mongodb://127.0.0.1:27017/caresync
```

---

### 4️⃣ Run server

```
npm run dev
```

---

## 🛠️ CLI Usage (Super Admin)

### Create Hospital + First Admin

```
npx ts-node cli/createHospital.ts
```

Follow prompts:

```
Hospital Name:
Location:
Latitude:
Longitude:
Registration No:
Admin Name:
Admin Email:
Password:
```

---

## 📍 Geo Search Example

```
GET /hospital/nearby?lat=30.7333&lng=76.7794&radius=5
```

---

## 📡 API Endpoints

### 🏥 Hospital

```
GET /hospital/nearby?lat=&lng=&radius=
```

---

### 📂 Department

```
GET /hospital/:hospitalId/departments
```

---

### 👨‍⚕️ Doctor

```
GET /hospital/:hospitalId/departments/:departmentId/doctors
```

---

### ⏱️ Slots

```
GET /appointment/available-slots?doctorId=&hospitalId=&date=
```

---

### 📅 Appointment

```
POST   /appointment/book
PATCH  /appointment/:id/cancel
GET    /appointment/patient/:patientId
```

---

### 👨‍⚕️ Doctor Dashboard

```
GET    /appointment/doctor/:doctorId/today
GET    /appointment/doctor/:doctorId/upcoming
PATCH  /appointment/:id/complete
```

---

## 🧪 Example Booking

```
POST /appointment/book
```

```json
{
  "patientId": "xxx",
  "doctorId": "xxx",
  "hospitalId": "xxx",
  "departmentId": "xxx",
  "date": "2026-04-10",
  "slotTime": "10:40"
}
```

---

## 🔒 Smart Booking Logic

* Prevents double booking
* Uses MongoDB **partial index**

```
status = "booked" → slot blocked
status = "cancelled" → slot free again
```

---

## 🌍 Key Concepts Used

* GeoSpatial Search ($geoNear)
* Slot Generation Engine
* Partial Unique Index (MongoDB)
* REST API Design

---

## 🏆 Highlights

* 🔥 Real-world hospital booking system
* ⚡ Geo-location based search
* 🧠 Smart slot management
* 🛡️ Database-level safety
* 🧩 CLI-based admin setup
* 🚀 Production-ready backend

---

## 📈 Future Scope

* Payments integration
* Notifications (SMS/Email)
* Redis caching
* Queue system (Kafka)
* Doctor ratings

---

## 👨‍💻 Author

**Subhra Mishra**

---

⭐ Star this repo if you found it useful!
