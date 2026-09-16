# 🚀 JobTrack

### A modern job-search tracker for applications, interviews, profiles, and career progress.

JobTrack helps job seekers organize their job hunt in one place. Track applications, manage interviews, update your profile, monitor progress, and keep important job-search information easily accessible.

Built with **React, TypeScript, Go, Firebase Authentication, and Cloud Firestore**.

<p align="center">
  <a href="https://job-tracker-77.web.app">Live Demo</a>
  ·
  <a href="#getting-started">Getting Started</a>
  ·
  <a href="#api-endpoints">API</a>
  ·
  <a href="#roadmap">Roadmap</a>
</p>

---

## 🌐 Live Application

**[Open JobTrack](https://job-tracker-77.web.app)**

---

## ✨ Features

* 🔐 Email/password registration and login
* 🔑 Password reset by email
* 👤 User-specific profiles
* 🌍 Automatic country detection when no country is saved
* 💼 Create, view, update, and delete job applications
* 🔄 Track application statuses
* 📊 Dashboard statistics and recent applications
* 🎤 Interview management section
* 🏢 Company tracking section
* 🔔 Persistent notification preferences
* 📱 Responsive desktop and mobile interface
* 🛡️ Protected Firestore collections
* ⚙️ Protected Go API routes with Firebase ID-token authentication
* 🐳 Docker configuration for local backend development

---

## 🛠️ Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* Firebase Web SDK
* Firebase Authentication
* Cloud Firestore
* CSS

### Backend

* Go 1.22+
* Standard library `net/http`
* Firebase Admin SDK for Go
* Cloud Firestore
* Docker

### Infrastructure

* Firebase Hosting
* Firebase Authentication
* Cloud Firestore
* GitHub
* Docker Compose

---

## 🏗️ Architecture

JobTrack currently uses a hybrid architecture.

The frontend communicates directly with Firebase for authentication and selected Firestore operations. The Go API provides a protected server-side integration layer for backend operations and future consolidation.

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │  TypeScript + Vite  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       Firebase Web SDK              Go REST API
                 │                           │
                 ▼                           ▼
       Firebase Authentication       Firebase ID Token
                 │                           │
                 ▼                           ▼
          Cloud Firestore          Firebase Admin SDK
                                             │
                                             ▼
                                      Cloud Firestore
```

### Planned backend-first flow

```text
React Frontend
      ↓
Firebase Authentication
      ↓
Firebase ID Token
      ↓
Go REST API
      ↓
Firebase Admin SDK
      ↓
Cloud Firestore
```

---

## 🔐 Security

JobTrack is designed for secure, user-scoped data access.

* Firebase Authentication identifies each user.
* Each user has a unique Firebase UID.
* Firestore records contain ownership information.
* Firestore rules restrict access to authenticated users.
* Go API routes verify Firebase ID tokens.
* The backend derives the user ID from the verified token.
* Client-supplied user IDs must not be trusted.
* Firebase Admin credentials remain on the backend.
* Secrets and service-account files must never be committed.

Example ownership model:

```text
users/{uid}
applications/{applicationId}
interviews/{interviewId}
```

Each application and interview must belong to the authenticated user.

---

## 📁 Project Structure

```text
jobtrack/
│
├── backend/
│   ├── cmd/
│   │   └── server/              # Go API entry point
│   ├── firebase/                # Firebase Admin initialization
│   └── internal/
│       ├── config/              # Environment configuration
│       ├── handlers/            # HTTP handlers
│       ├── middleware/          # Auth and CORS middleware
│       ├── models/              # Domain models
│       ├── repositories/        # Firestore data access
│       ├── routes/               # API route registration
│       ├── services/             # Business logic
│       └── utils/                # Validation and response helpers
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # Auth and profile state
│   │   ├── data/                # Development fallback data
│   │   ├── hooks/               # React hooks
│   │   ├── pages/               # Application pages
│   │   ├── services/            # Firebase and API services
│   │   ├── styles/              # CSS stylesheets
│   │   └── types/               # TypeScript types
│   └── package.json
│
├── docs/                        # Project documentation
├── .github/                     # GitHub workflows and templates
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── docker-compose.yml           # Local API containers
├── .env.example                 # Environment template
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install the following tools:

* Node.js 20.19+ or 22.12+
* npm
* Go 1.22+
* Firebase CLI
* A Firebase project
* Firebase Authentication
* Cloud Firestore
* Docker Desktop — optional

Install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

---

## 🔥 Firebase Configuration

The current Firebase project is:

```text
job-tracker-77
```

Enable the following services in the Firebase Console:

1. Authentication → Sign-in method → Email/Password
2. Firestore Database
3. Firebase Hosting

The frontend uses the Firebase Web SDK through npm.

Create:

```text
frontend/.env.local
```

Add:

```env
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Firebase web configuration values are public by design. However, never place Firebase Admin service-account files, private keys, or backend secrets in the frontend.

---

## 🎨 Run the Frontend

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The production files are generated in:

```text
frontend/dist
```

---

## ⚙️ Run the Go API

The backend requires Firebase Admin credentials.

PowerShell example:

```powershell
$env:FIREBASE_PROJECT_ID = "job-tracker-77"
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\firebase-service-account.json"
$env:FRONTEND_URL = "http://localhost:5173"
$env:PORT = "8080"
$env:ENVIRONMENT = "development"

cd backend
go run ./cmd/server
```

The API runs at:

```text
http://localhost:8080
```

Health endpoint:

```http
GET http://localhost:8080/health
```

---

## 🐳 Run with Docker

From the repository root:

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:8080
```

Make sure Firebase project configuration and Admin credentials are available to the container before starting it.

---

## 🔌 API Endpoints

Protected API routes require a Firebase ID token:

```http
Authorization: Bearer <firebase-id-token>
```

### Public Endpoint

| Method | Endpoint  | Description            |
| ------ | --------- | ---------------------- |
| GET    | `/health` | Check API availability |

### Application Endpoints

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | `/api/v1/applications`      | List the user's applications |
| POST   | `/api/v1/applications`      | Create an application        |
| GET    | `/api/v1/applications/{id}` | Get one application          |
| PUT    | `/api/v1/applications/{id}` | Update an application        |
| DELETE | `/api/v1/applications/{id}` | Delete an application        |

### Interview Endpoints

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/v1/interviews`      | List the user's interviews |
| POST   | `/api/v1/interviews`      | Create an interview        |
| GET    | `/api/v1/interviews/{id}` | Get one interview          |
| PUT    | `/api/v1/interviews/{id}` | Update an interview        |
| DELETE | `/api/v1/interviews/{id}` | Delete an interview        |

### Profile Endpoints

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/v1/profile` | Get the user's profile    |
| PUT    | `/api/v1/profile` | Update the user's profile |

### Dashboard Endpoint

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/api/v1/dashboard/stats` | Get job-search statistics |

---

## 🗄️ Data Model

User profiles are stored using the Firebase UID:

```text
users/{uid}
```

Example profile:

```json
{
  "uid": "firebase-user-id",
  "firstName": "Alex",
  "lastName": "Morgan",
  "displayName": "Alex Morgan",
  "email": "alex@example.com",
  "country": "United States",
  "photoURL": "",
  "notificationPreferences": {
    "interviewReminders": true,
    "weeklySummary": true,
    "productUpdates": false
  }
}
```

Applications and interviews use an ownership field that matches the authenticated Firebase UID.

---

## 🧪 Testing and Validation

Check frontend TypeScript:

```bash
cd frontend
npx tsc -b
```

Build the frontend:

```bash
npm run build
```

Run backend tests:

```bash
cd backend
go test ./...
```

Build the Go backend:

```bash
go build ./...
```

Before release, test:

* Registration
* Login
* Logout
* Password reset
* Profile loading
* Country detection
* Application CRUD
* Interview operations
* Notification persistence
* Protected routes
* Direct navigation to nested frontend routes
* User-data isolation

---

## 🚢 Deploy to Firebase Hosting

Build the frontend:

```bash
cd frontend
npm install
npm run build
cd ..
```

Deploy Hosting and Firestore rules:

```bash
firebase deploy --only hosting,firestore
```

Production URL:

```text
https://job-tracker-77.web.app
```

Firebase Hosting is configured to serve the Vite output from:

```text
frontend/dist
```

SPA rewrites allow React Router routes such as `/applications`, `/profile`, and `/settings` to work correctly.

---

## 🗺️ Roadmap

### Foundation

* [x] React and TypeScript frontend
* [x] Vite setup
* [x] Authentication interface
* [x] Application dashboard
* [x] Application management UI
* [x] Profile and settings pages
* [x] Firebase Hosting configuration
* [x] Go API foundation

### Backend Integration

* [x] Complete Firebase ID-token verification
* [x] Connect frontend API service to Go backend
* [x] Complete application CRUD integration
* [x] Complete interview CRUD integration
* [x] Complete profile API integration
* [x] Connect dashboard statistics
* [x] Add automated user-isolation tests

### Future Enhancements

* [ ] Application timeline
* [ ] Follow-up reminders
* [ ] Interview preparation notes
* [ ] Resume and cover-letter tracking
* [ ] Calendar integration
* [ ] Advanced job-search analytics
* [ ] Email notifications
* [ ] AI-powered application insights
* [ ] Browser extension
* [ ] Mobile application

---

## 🤝 Contributing

Contributions, suggestions, and issue reports are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Run tests and builds.
5. Commit your changes:

```bash
git commit -m "feat: describe your change"
```

6. Push your branch:

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

## 🔒 Environment and Secret Safety

Do not commit:

```text
frontend/.env.local
.env
Firebase service-account JSON files
Private keys
API tokens
Production credentials
```

Use `.env.example` to document required variables without exposing real secrets.

---

## 📄 License

This project is licensed under the MIT License.

See the [`LICENSE`](LICENSE) file for details.

---

## 👨‍💻 Author

**Antony Wanjiru**

Full-Stack Software Engineer focused on building modern web, backend, mobile, and AI-powered applications.

* **Portfolio:** [antony-software-engineer.web.app](https://antony-software-engineer.web.app/)
* **GitHub:** [@tonydev-star](https://github.com/tonydev-star)
* **LinkedIn:** [Antony Wanjiru](https://linkedin.com/in/antonywanjiru-5976b022a)

---

<p align="center">
  Built with React, TypeScript, Go, and Firebase.
</p>
