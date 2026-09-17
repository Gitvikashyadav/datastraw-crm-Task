# Datastraw Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies hiring
assessment. Backend: **NestJS + MongoDB Atlas**. Frontend: **Next.js + Tailwind CSS**.

## Live Demo

- **Frontend:** https://datastraw-crm-task-frontend.onrender.com/
- **Backend health check:** https://datastraw-crm-backend-d25j.onrender.com/health

```
datastraw-crm/
├── backend/     # NestJS REST API (MongoDB Atlas via Mongoose)
├── frontend/    # Next.js client (App Router)
└── README.md    # this file
```

## Features

- ✅ Create tickets — customer name + email, subject, description, auto-generated ID
  (`TKT-000001`, ...) and timestamp
- ✅ List all tickets — ID, customer, subject, status, created date
- ✅ Search — live, as-you-type, across name, email, ticket ID, and description
- ✅ Filter by status — Open / In Progress / Closed
- ✅ View & update tickets — detail page, inline status change, add notes
- ✨ Pagination on the ticket list
- ✨ Dedicated add-note endpoint alongside the status-update endpoint
- ✅ Health check endpoint for the deploy platform

## Tech Stack

| Layer | Choice |
|---|---|
| Backend | NestJS 10 (TypeScript), MongoDB Atlas via Mongoose |
| Frontend | Next.js 14 (App Router, TypeScript), Tailwind CSS |
| Fonts | IBM Plex Sans (UI) + IBM Plex Mono (ticket IDs/timestamps) |

## Architecture

```
Browser → Next.js frontend → NestJS API → MongoDB Atlas
```

Every backend response uses one consistent shape: `{ success: true, data }` on success,
`{ success: false, message }` on error — the frontend unwraps this once in `lib/api.ts`.

## Backend Folder Structure

```
backend/
├── src/
│   ├── main.ts                  # bootstrap: global pipes/filters/interceptors, CORS
│   ├── app.module.ts
│   ├── config/                  # env loading + validation
│   ├── database/                # MongoDB Atlas connection
│   ├── common/
│   │   ├── filters/              # global error response shape
│   │   ├── interceptors/         # global success response shape
│   │   └── utils/                # ticket ID generator
│   ├── tickets/
│   │   ├── schemas/              # Ticket, embedded Note, Counter
│   │   ├── dto/                  # request validation
│   │   ├── enums/                # TicketStatus
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   └── tickets.module.ts
│   └── health/                   # GET /health
├── .env.example
├── package.json
└── nest-cli.json
```

**Data model** — Ticket: `ticket_id`, `customer_name`, `customer_email`, `subject`,
`description`, `status` (Open/In Progress/Closed), `notes[]` (embedded, not a separate
collection — notes are always read/written with their ticket, so embedding avoids a join), plus
`created_at`/`updated_at`. A `counters` collection generates gap-free, unique ticket IDs.

**API Endpoints**

| Method | Path | Description |
|---|---|---|
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets?status=&search=&page=&limit=` | List/search/filter (paginated) |
| GET | `/api/tickets/:ticket_id` | Ticket detail incl. notes |
| PUT | `/api/tickets/:ticket_id` | Update status and/or append a note |
| POST | `/api/tickets/:ticket_id/notes` | Dedicated add-note endpoint |
| GET | `/health` | Liveness check |

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # header nav, fonts
│   │   ├── page.tsx                   # /            → ticket list
│   │   └── tickets/
│   │       ├── new/page.tsx           # /tickets/new → create form
│   │       └── [ticket_id]/page.tsx   # /tickets/:id → detail, status, notes
│   ├── components/                    # ticket-list, ticket-row, status-badge,
│   │                                     search-filter-bar, ticket-form, notes-timeline, ui/
│   ├── lib/
│   │   ├── api.ts                     # typed fetch client
│   │   └── types.ts
│   └── hooks/use-debounce.ts
├── .env.local.example
├── tailwind.config.ts
└── package.json
```

Routing is file-based: each `page.tsx` under `app/` is a URL, and `[ticket_id]` is a dynamic
segment matching any ticket's ID.

## Local Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env      # set MONGODB_URI
npm run start:dev         # http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev -- -p 3002
```

## MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com.
2. Database Access → add a database user.
3. Network Access → allow `0.0.0.0/0`.
4. Database → Connect → Drivers → copy the connection string into `MONGODB_URI`.

## Deployment (Render)

**Backend** — Web Service:
- Build: `npm install && npm run build`
- Start: `npm run start:prod` (not `npm start` — that recompiles on every launch and can crash)
- Env vars: `MONGODB_URI`, `CORS_ORIGIN`

**Frontend** — Web Service (not a static site — it has a dynamic `/tickets/[ticket_id]` route):
- Build: `npm install && npm run build`
- Start: `npm run start`
- Env vars: `NEXT_PUBLIC_API_URL` → the backend's URL above

## What I'd Add With More Time

- Basic auth for support agents
- Sortable columns on the ticket list
- Full-text search index for scale (regex search works fine at this data size)