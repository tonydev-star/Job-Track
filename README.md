# 🚀 JobTrack

### A modern, secure, multi-user job application tracking platform.

JobTrack helps job seekers organize, track, and manage their entire job search from one place — from the moment an application is submitted to interviews, offers, rejections, and follow-ups.

Built with **React, TypeScript, Go, Firebase Authentication, and Cloud Firestore**, JobTrack is designed around a secure multi-user architecture where every user's data is isolated and protected.

---

## ✨ Why JobTrack?

Managing dozens of job applications across emails, spreadsheets, browser tabs, and notes can quickly become difficult.

**JobTrack brings everything together.**

Track:

* 🏢 Companies
* 💼 Job positions
* 📍 Locations
* 📅 Application dates
* 🔄 Application status
* 🎯 Interviews
* 📝 Notes
* 🔗 Job posting URLs
* 📊 Job-search statistics

---

## 🎯 Core Features

### 📊 Dashboard

Get an overview of your job search at a glance.

* Total applications
* Applications in progress
* Interviews
* Offers
* Rejections
* Recent applications
* Application activity

### 💼 Application Tracking

Create and manage job applications with:

* Company
* Job title
* Location
* Employment type
* Application date
* Status
* Job URL
* Personal notes

Supported statuses:

```text
Applied
Interview
Offer
Rejected
Withdrawn
```

### 🎤 Interview Management

Keep interview information organized alongside your applications.

Track:

* Company
* Position
* Interview date
* Interview type
* Notes
* Related application

### 🏢 Company Tracking

Companies are automatically derived from the user's applications, making it easy to see where applications have been submitted without maintaining a separate company database.

### 👤 User Profiles

Each account has its own profile containing:

* Name
* Email
* Country
* Profile photo
* Display name

### 🔐 Secure Multi-User Architecture

JobTrack is designed for multiple users from the beginning.

Every authenticated user receives a unique Firebase UID.

```text
User A
   │
   └── Firebase UID A
          │
          └── Applications A


User B
   │
   └── Firebase UID B
          │
          └── Applications B
```

Users can only access their own data.

---

# 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │ TypeScript + Vite   │
                    └──────────┬──────────┘
                               │
                    Firebase Client SDK
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Firebase Auth       │
                    │                     │
                    │ User Authentication │
                    └──────────┬──────────┘
                               │
                         Firebase ID Token
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Go REST API    │
                    │                     │
                    │ Authentication      │
                    │ Middleware           │
                    │ Handlers              │
                    │ Services              │
                    │ Repositories         │
                    └──────────┬──────────┘
                               │
                       Firebase Admin SDK
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Cloud Firestore  │
                    │                     │
                    │ User-scoped data    │
                    └─────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React        | UI                          |
| TypeScript   | Type safety                 |
| Vite         | Development & build tooling |
| React Router | Application routing         |
| Firebase SDK | Authentication              |
| CSS          | Styling                     |

## Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Go                 | REST API                   |
| `net/http`         | HTTP server                |
| Firebase Admin SDK | Authentication & Firestore |
| Firestore          | Database                   |
| Docker             | Containerization           |

## Development

| Tool     | Purpose                            |
| -------- | ---------------------------------- |
| Git      | Version control                    |
| GitHub   | Source control                     |
| Postman  | API testing                        |
| Firebase | Authentication, database & hosting |

---

# 📁 Project Structure

```text
jobtrack/
│
├── backend/
│   ├── cmd/
│   │   └── server/
│   │
│   ├── internal/
│   │   ├── config/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── firebase/
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── types/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEVELOPMENT.md
│   └── DEPLOYMENT.md
│
├── .github/
│   ├── workflows/
│   │   ├── frontend.yml
│   │   └── backend.yml
│   ├── ISSUE_TEMPLATE.md
│   └── pull_request_template.md
│
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── docker-compose.yml
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🔐 Security Model

Security is a core part of JobTrack's architecture.

The frontend authenticates users using Firebase Authentication.

The resulting Firebase ID token is sent to the Go API:

```http
Authorization: Bearer <firebase-id-token>
```

The Go backend verifies the token before processing protected requests.

```text
React
  │
  │ Firebase ID Token
  ▼
Go Authentication Middleware
  │
  │ Verify token
  ▼
Firebase UID
  │
  ▼
User-scoped Firestore operation
```

### Important security principles

* 🔒 Firebase ID tokens are verified by the backend.
* 🔒 User IDs are derived from the verified token.
* 🔒 The API does not trust a client-provided `userId`.
* 🔒 Firestore data is organized by Firebase UID.
* 🔒 Users cannot access another user's applications.
* 🔒 Admin credentials are never exposed to the frontend.
* 🔒 Service-account credentials are never committed to Git.
* 🔒 Production authenticated requests should not use wildcard CORS.

---

# 🗄️ Firestore Structure

JobTrack uses a user-scoped Firestore structure:

```text
users/
  {firebaseUid}/
      profile

      applications/
          {applicationId}

      interviews/
          {interviewId}
```

This structure makes ownership explicit.

For example:

```text
users/
  abc123/
      applications/
          application001
          application002

  xyz789/
      applications/
          application003
```

User `abc123` must never be able to retrieve `xyz789`'s applications.

---

# 🔌 API

Base URL during development:

```text
http://localhost:8080
```

## Health

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "jobtrack-api"
}
```

## Applications

```http
GET    /api/v1/applications
POST   /api/v1/applications
GET    /api/v1/applications/{id}
PUT    /api/v1/applications/{id}
DELETE /api/v1/applications/{id}
```

## Interviews

```http
GET    /api/v1/interviews
POST   /api/v1/interviews
GET    /api/v1/interviews/{id}
PUT    /api/v1/interviews/{id}
DELETE /api/v1/interviews/{id}
```

## Dashboard

```http
GET /api/v1/dashboard/stats
```

## Profile

```http
GET /api/v1/profile
PUT /api/v1/profile
```

---

# 📦 API Response Format

Successful responses use:

```json
{
  "data": {}
}
```

Errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Company is required"
  }
}
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 20+
* npm
* Go 1.22+
* Git
* Firebase project
* Firebase Authentication enabled
* Cloud Firestore enabled

---

## 1. Clone the repository

```bash
git clone https://github.com/tonydev-star/jobtrack.git

cd jobtrack
```

---

# 🎨 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Install Firebase:

```bash
npm install firebase
```

Create your environment file:

```bash
cp .env.example .env
```

Configure your Firebase client variables.

Example:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Open another terminal:

```bash
cd backend
```

Install Go dependencies:

```bash
go mod tidy
```

Create your environment configuration:

```env
PORT=8080
ENVIRONMENT=development
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

Run the API:

```bash
go run ./cmd/server
```

The backend will run on:

```text
http://localhost:8080
```

Test the health endpoint:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "jobtrack-api"
}
```

---

# 🧪 Testing

Run backend tests:

```bash
cd backend
go test ./...
```

Build the backend:

```bash
go build ./...
```

Build the frontend:

```bash
cd frontend
npm run build
```

---

# 🐳 Docker

Build the backend image:

```bash
docker build -t jobtrack-api ./backend
```

Run the container:

```bash
docker run -p 8080:8080 jobtrack-api
```

For local development with multiple services:

```bash
docker compose up
```

---

# 🌍 Deployment Architecture

The production architecture separates frontend hosting from the Go API:

```text
                 Internet
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   Firebase Hosting      Go API Server
          │                   │
          ▼                   ▼
     React App          Firebase Admin
                              │
                              ▼
                         Firestore
```

The frontend can be deployed through Firebase Hosting while the Go backend can run on a container-compatible backend platform.

---

# 🗺️ Roadmap

### ✅ Phase 1 — Foundation

* [x] React + TypeScript frontend
* [x] Vite setup
* [x] Application dashboard
* [x] Application management UI
* [x] Interview management UI
* [x] Profile & settings UI
* [x] Go backend architecture
* [x] Firebase architecture
* [x] Multi-user data model

### 🚧 Phase 2 — Backend Integration

* [ ] Firebase Authentication integration
* [ ] Firebase ID-token verification
* [ ] Application CRUD API
* [ ] Interview CRUD API
* [ ] Profile API
* [ ] Dashboard statistics API
* [ ] Firestore integration
* [ ] Frontend API integration

### 🔜 Phase 3 — Production

* [ ] Production deployment
* [ ] CI/CD
* [ ] Automated testing
* [ ] Production monitoring
* [ ] Error tracking
* [ ] Performance optimization

### 💡 Future Ideas

* 📧 Application follow-up reminders
* 📅 Calendar integration
* 📎 Resume attachment tracking
* 📈 Application analytics
* 🔔 Interview reminders
* 🧠 AI-powered application insights
* 📊 Job-search reports
* 🌐 Browser extension
* 📱 Mobile application

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Run tests.

```bash
go test ./...
```

5. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

6. Push your branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for details.

---

# 👨‍💻 Author

**Antony Wanjiru**

Full-Stack Software Engineer building modern web, mobile, backend, and AI-powered applications.

### Connect

* 💼 LinkedIn: [Antony Wanjiru](https://linkedin.com/in/antonywanjiru-5976b022a)
* 🐙 GitHub: [@tonydev-star](https://github.com/tonydev-star)
* 🌐 Portfolio: [antony-software-engineer.web.app](https://antony-software-engineer.web.app/)

---

## ⭐ Support the Project

If JobTrack is useful or interesting to you, consider giving the repository a ⭐.

```text
Built with React + TypeScript + Go + Firebase
Designed for real-world job searching.
```
