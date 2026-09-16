 # JobTrack

JobTrack is a full-stack job search tracker for managing applications, interviews, profile information, and job-search progress in one place.

The project contains:

- A React and TypeScript frontend built with Vite
- Firebase Authentication for user accounts
- Cloud Firestore for user-scoped profile and application data
- A Go HTTP API with Firebase ID-token authentication
- Firebase Hosting configuration for the production frontend
- Docker configuration for running the Go API locally

Live app: https://job-tracker-77.web.app

## Features

- Register and sign in with email and password
- Reset forgotten passwords by email
- User-specific profiles loaded from Firestore
- Automatic country detection from the user's IP when no country is stored
- Create, view, update, and delete job applications
- Filter and track application statuses
- Dashboard statistics and recent applications
- Interview and company sections in the frontend
- Persistent notification preferences stored in Firestore
- Responsive desktop and mobile layout
- Protected Firestore collections and protected Go API routes

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Firebase Web SDK
- Cloud Firestore
- Firebase Authentication

### Backend

- Go 1.22+
- `net/http`
- Firebase Admin SDK for Go
- Cloud Firestore
- Docker

## Project Structure

```text
.
├── backend/
│   ├── cmd/server/              Go API entry point
│   ├── firebase/                Firebase Admin initialization
│   └── internal/
│       ├── config/              Environment configuration
│       ├── handlers/             HTTP handlers
│       ├── middleware/           Firebase token and CORS middleware
│       ├── models/               Domain models
│       ├── repositories/         Firestore repository layer
│       ├── routes/                API route registration
│       ├── services/              Business logic
│       └── utils/                HTTP response and validation helpers
├── frontend/
│   ├── src/
│   │   ├── components/           Reusable UI components
│   │   ├── context/              Authentication and profile state
│   │   ├── data/                 Development fallback data
│   │   ├── hooks/                React hooks
│   │   ├── pages/                Application pages
│   │   ├── services/             Firebase and data services
│   │   ├── styles/               CSS stylesheets
│   │   └── types/                Shared TypeScript types
│   └── package.json
├── docs/                         Project documentation
├── firebase.json                 Hosting and Firestore configuration
├── firestore.rules               Firestore security rules
├── docker-compose.yml             Local API container configuration
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js 20.19+ or 22.12+
- npm
- Go 1.22+ for the backend
- Firebase CLI
- A Firebase project with Authentication and Firestore enabled
- Docker Desktop, optional for running the API in a container

Install the Firebase CLI if needed:

```bash
npm install -g firebase-tools
firebase login
```

## Firebase Setup

The current Firebase project is `job-tracker-77`.

Enable these Firebase services in the Firebase Console:

1. Authentication → Sign-in method → Email/Password
2. Firestore Database
3. Firebase Hosting

The frontend uses the Firebase Web SDK. Web configuration values are expected in `frontend/.env.local` and must use the `VITE_` prefix:

```env
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

The frontend Firebase configuration is public by design. Never place Firebase Admin service-account JSON, private keys, or backend secrets in `frontend/.env.local` or the frontend source.

## Run the Frontend

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Vite normally starts at `http://localhost:5173`. If that port is already in use, Vite selects the next available port.

Build the production frontend:

```bash
cd frontend
npm run build
```

The compiled static files are written to `frontend/dist`.

Preview the production build locally:

```bash
cd frontend
npm run preview
```

## Run the Go API

The backend requires Firebase Admin credentials. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of a service-account JSON file, or use another Google Application Default Credentials setup.

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

The API listens on `http://localhost:8080` by default.

Health check:

```text
GET http://localhost:8080/health
```

## Run the API with Docker

From the repository root:

```bash
docker compose up --build
```

The compose file exposes the API at `http://localhost:8080`. Configure `FIREBASE_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS` in the shell or an environment file before starting the container.

## API Endpoints

All `/api/` routes require a Firebase ID token in the request header:

```http
Authorization: Bearer <firebase-id-token>
```

### Public

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | Check whether the API is running |

### Protected

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/applications` | List the signed-in user's applications |
| POST | `/api/v1/applications` | Create an application |
| GET | `/api/v1/applications/{id}` | Get one application |
| PUT | `/api/v1/applications/{id}` | Update an application |
| DELETE | `/api/v1/applications/{id}` | Delete an application |
| GET | `/api/v1/interviews` | List the signed-in user's interviews |
| POST | `/api/v1/interviews` | Create an interview |
| GET | `/api/v1/interviews/{id}` | Get one interview |
| PUT | `/api/v1/interviews/{id}` | Update an interview |
| DELETE | `/api/v1/interviews/{id}` | Delete an interview |
| GET | `/api/v1/profile` | Get the signed-in user's profile |
| PUT | `/api/v1/profile` | Update the signed-in user's profile |
| GET | `/api/v1/dashboard/stats` | Get application dashboard statistics |

## Data Model

User profiles are stored at:

```text
users/{uid}
```

Example profile fields:

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

Applications are stored in the `applications` collection and include a `userId` field that matches the Firebase UID. Interviews use the same ownership pattern in the `interviews` collection.

## Security

Firestore rules require an authenticated Firebase user. User documents can only be accessed by the matching UID. Applications and interviews can only be created, read, changed, or deleted when their `userId` belongs to the signed-in user.

Deploy the rules with:

```bash
firebase deploy --only firestore
```

Do not commit:

- `frontend/.env.local`
- Firebase service-account JSON files
- Private keys
- API tokens
- Production credentials

The Firebase web API key may appear in the browser bundle, but restrict it in Google Cloud Console by HTTP referrer and allowed APIs for production use.

## Deploy to Firebase Hosting

The repository is configured to deploy the Vite output from `frontend/dist`.

```bash
cd frontend
npm install
npm run build

cd ..
firebase deploy --only hosting,firestore
```

The current production URL is:

https://job-tracker-77.web.app

The SPA rewrite in `firebase.json` sends application routes such as `/applications`, `/profile`, and `/settings` back to `index.html` so React Router can handle them.

## Testing and Validation

Frontend TypeScript check:

```bash
cd frontend
npx tsc -b
```

Frontend production build:

```bash
cd frontend
npm run build
```

Backend tests:

```bash
cd backend
go test ./...
```

Before releasing, test registration, login, password reset, profile loading, country detection, application CRUD, notification persistence, logout, and direct navigation to nested routes.

## Current Architecture Notes

The frontend currently uses the Firebase Web SDK directly for authentication, profile synchronization, notification preferences, and application CRUD. The Go API includes the protected service architecture and routes for the same domain areas, but the frontend is not yet required to proxy every operation through the Go API.

This allows the deployed frontend to work with Firebase Hosting and Firestore immediately while keeping the Go API available as the server-side integration layer for future consolidation.

## License

See [LICENSE](LICENSE).
