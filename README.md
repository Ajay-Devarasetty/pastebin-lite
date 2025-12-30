# Pastebin Lite

Pastebin Lite is a small Pastebin-like full-stack application that allows users to create
text pastes and share a link to view them. Pastes can optionally expire based on time (TTL)
or a maximum number of views.

This project was built as a take-home assignment and is designed to be evaluated using
automated tests against the deployed application.

---

## Tech Stack

### Frontend

- React (Vite)
- Material UI (basic styling)

### Backend

- Node.js
- Express.js

## Project Structure

This repository contains two folders:

- `backend/` – Express API and persistence (MongoDB via Mongoose).
- `frontend/` – React + Vite UI for creating and viewing pastes.

## Features

- Create a paste with arbitrary text.
- Optional TTL (time-to-live) in seconds.
- Optional view-count limit (max_views).
- Deterministic test mode: when `TEST_MODE=1`, the request header `x-test-now-ms` is used as the current time for expiry logic.

## Persistence

This project uses MongoDB Atlas (via `mongoose`) for persistence. The backend expects a MongoDB connection string in the `MONGO_URI` environment variable.

Why MongoDB: the backend already includes a `backend/src/config/db.js` file that connects using Mongoose, and MongoDB persists across serverless function invocations and restarts when provided by a managed service or a hosted database.

## API Routes

- Health check: `GET /api/healthz` — returns `200` and JSON `{ "ok": true }` when the app can access its persistence layer.
- Create a paste: `POST /api/pastes` — JSON body:

```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Success response (2xx):

```json
{
  "id": "string",
  "url": "https://your-app.example/p/<id>"
}
```

Invalid input returns a `4xx` JSON error.

- Fetch a paste (API): `GET /api/pastes/:id` — returns JSON on success:

```json
{
  "content": "string",
  "remaining_views": 4, // or null if unlimited
  "expires_at": "2026-01-01T00:00:00.000Z" // or null if no TTL
}
```

Each successful API fetch counts as a view. Unavailable pastes (missing, expired, or view-limit exceeded) return `404` with a JSON body.

- View a paste (HTML): `GET /p/:id` — returns an HTML page (200) rendering the paste content safely; unavailable pastes return `404`.

## Deterministic TTL Testing

When `TEST_MODE=1` is set, the request header  
`x-test-now-ms` is treated as the current time for expiry logic.

## Running the Project Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
