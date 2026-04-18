# 🚀 Task Manager API

A scalable backend system for managing authentication, projects, tasks, and analytics with secure session handling.

---

## ✨ Overview

* Authentication with OTP verification
* JWT-based access & refresh token system
* Project & Task management
* Filtering, sorting, and stats tracking
* Clean architecture with validation

---

## 🧰 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Language:** TypeScript
* **Auth:** JWT + Cookies
* **Validation:** Zod

---

## 🌐 Base URL

```bash
/api
```

---

# 🔐 Authentication Routes

```bash
POST   /auth/register
POST   /auth/login
POST   /auth/access-token
POST   /auth/verify-otp
POST   /auth/resend-otp
POST   /auth/logout
POST   /auth/logout-all
GET    /auth/test
```

---

# 📁 Project Routes

```bash
POST   /project/create
GET    /project/get
GET    /project/get/:id
PATCH  /project/update/:id
DELETE /project/delete/:id
```

---

# 📋 Task Routes

```bash
POST   /task/create
GET    /task/get
GET    /task/get-one/:id
PATCH  /task/update/:id
DELETE /task/delete/:id
PATCH  /task/update-status/:id
GET    /task/get-tasks-success
```

---

# 📊 Stats Routes

```bash
GET    /stats/project/:id
GET    /stats/all-project
```

---

## 🔐 Authentication Flow

* User registers → OTP sent via email
* OTP verification required before login
* Login generates:

  * Access Token (short-lived)
  * Refresh Token (stored in cookies)
* Refresh token used to generate new access tokens
* Session stored in database

---

## ⚙️ Key Features

* Secure password hashing
* Session-based authentication
* Role-safe data access (user-specific data)
* Aggregation-based stats system
* Input validation using middleware

---

## ▶️ Getting Started

```bash
git clone <repo-url>
cd project-folder
npm install
npm run dev
```

---

## 📌 Notes

* All protected routes require authentication
* Refresh token is stored in HTTP-only cookies
* Validation handled at middleware level

---

## 💡 Project Purpose

This project demonstrates a real-world backend system with authentication, validation, and scalable API design.

---