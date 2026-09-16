# Datastraw Support CRM — Backend

NestJS + MongoDB Atlas (Mongoose) REST API for the Datastraw Support Ticketing CRM assessment.

## Tech Stack

- **Framework:** NestJS 10 (TypeScript)
- **Database:** MongoDB Atlas via Mongoose
- **Validation:** class-validator / class-transformer (DTO-based)
- **Config:** @nestjs/config + Joi schema (fails fast on missing env vars)

## Folder Structure

```
src/
├── main.ts                     # bootstrap: global pipes/filters/interceptors, CORS
├── app.module.ts                # root module
├── config/                      # env loading + Joi validation
├── database/                    # MongoDB Atlas connection (MongooseModule)
├── common/
│   ├── filters/                 # global HTTP exception filter (consistent error shape)
│   ├── interceptors/            # response envelope interceptor
│   └── utils/                   # ticket ID generator
├── tickets/
│   ├── schemas/                 # Ticket + embedded Note + Counter (Mongoose schemas)
│   ├── dto/                     # request validation objects
│   ├── enums/                   # TicketStatus
│   ├── tickets.controller.ts    # REST endpoints
│   ├── tickets.service.ts       # business logic
│   └── tickets.module.ts
└── health/                      # GET /health for deploy-platform health checks
```

## Data Model

**Ticket** (`tickets` collection)
| field | type | notes |
|---|---|---|
| ticket_id | string, unique | e.g. `TKT-000001`, generated via an atomic counter |
| customer_name | string | |
| customer_email | string | |
| subject | string | |
| description | string | |
| status | enum | `Open` \| `In Progress` \| `Closed` |
| notes | Note[] | **embedded sub-documents**, not a separate collection |
| created_at / updated_at | Date | auto-managed by Mongoose timestamps |

**Design tradeoff — embedded notes vs. a separate `notes` collection:**
The assignment spec sketches notes as their own table with a `ticket_id` foreign key (a
relational-DB shape). In MongoDB, notes are always read and written together with their
parent ticket and a ticket realistically has a handful of notes at most — the classic
one-to-few case for embedding. Embedding means the ticket detail view is a single query
instead of a query + join, at the cost of not being able to efficiently query "all notes
across every ticket" independently. If that became a real requirement (e.g. a company-wide
notes search), promoting `notes` to a top-level collection is a small, well-contained
migration since the sub-document shape doesn't need to change.

A `counters` collection backs atomic, gap-free ticket ID generation (`findOneAndUpdate` +
`$inc`) so concurrent ticket creation can never produce duplicate IDs.

## API Endpoints

All responses are wrapped as `{ success, statusCode, data }` (or `{ success: false, ... }` on error).

| Method | Path | Body / Query | Description |
|---|---|---|---|
| POST | `/api/tickets` | `{ customer_name, customer_email, subject, description }` | Create a ticket |
| GET | `/api/tickets` | `?status=Open&search=jane&page=1&limit=20` | List/search/filter tickets (paginated) |
| GET | `/api/tickets/:ticket_id` | — | Full ticket detail incl. notes |
| PUT | `/api/tickets/:ticket_id` | `{ status?, notes? }` | Update status and/or append a note |
| POST | `/api/tickets/:ticket_id/notes` | `{ note_text }` | Dedicated add-note endpoint (extra) |
| GET | `/health` | — | Liveness check for the deploy platform |

## Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set `MONGODB_URI` to your MongoDB Atlas connection string
   (Atlas → Database → Connect → "Connect your application").

3. **Run in dev mode**
   ```bash
   npm run start:dev
   ```
   API will be live at `http://localhost:3000`.

4. **Build for production**
   ```bash
   npm run build
   npm run start:prod
   ```

## MongoDB Atlas Setup (quick reference)

1. Create a free cluster at https://cloud.mongodb.com.
2. Database Access → add a database user with a password.
3. Network Access → allow access from anywhere (`0.0.0.0/0`) for the assessment, or add your
   deploy platform's IPs.
4. Database → Connect → Drivers → copy the connection string into `MONGODB_URI` in `.env`.

## Deployment (Railway)

1. Push this `backend/` folder to GitHub.
2. Create a new Railway project → Deploy from GitHub repo.
3. Set the `MONGODB_URI`, `CORS_ORIGIN`, and `PORT` environment variables in Railway's dashboard.
4. Railway auto-detects the Node/Nest build (`npm run build` → `npm run start:prod`).

## Environment Variables

See `.env.example`. `MONGODB_URI` is required — the app will refuse to start without it
(validated via Joi in `src/config/validation.schema.ts`).