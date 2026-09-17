# Datastraw Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies hiring
assessment. Backend: **NestJS + MongoDB Atlas**. Frontend: **Next.js + Tailwind CSS**.

```
datastraw-crm/
├── backend/     # NestJS REST API (MongoDB Atlas via Mongoose)
├── frontend/    # Next.js client (App Router)
└── README.md    # this file
```

Each folder also has its own README with deeper setup/deployment detail:
[`backend/README.md`](./backend/README.md) · [`frontend/README.md`](./frontend/README.md)

---

## Features

Everything in the assessment's "Key Features" spec, plus two small stand-out extras:

- ✅ **Create tickets** — customer name + email, subject, description, auto-generated ticket ID
  (`TKT-000001`, ...) and timestamp
- ✅ **List all tickets** — clean table view: ID, customer, subject, status, created date
- ✅ **Search** — live, debounced search across customer name, email, ticket ID, and description
- ✅ **Filter by status** — Open / In Progress / Closed
- ✅ **View & update tickets** — full detail page, inline status change, add notes/comments
- ✨ **Pagination** — list endpoint supports `page`/`limit`, not just a flat unbounded list
- ✨ **Dedicated notes endpoint** — `POST /api/tickets/:id/notes`, in addition to bundling a note
  into the status-update `PUT`, so notes can be added without also touching status
- ✅ **Health check endpoint** — `GET /health`, used by the deploy platform

## Tech Stack

| Layer | Choice |
|---|---|
| Backend framework | NestJS 10 (TypeScript) |
| Database | MongoDB Atlas via Mongoose |
| Validation | class-validator / class-transformer, Joi for env validation |
| Frontend framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 |
| Fonts | IBM Plex Sans (UI) + IBM Plex Mono (ticket IDs/timestamps only) |

## Architecture

```
Browser
   │
   ▼
Next.js frontend  ──fetch──►  NestJS API  ──Mongoose──►  MongoDB Atlas
(App Router, client            (REST, DTO                (tickets + counters
 components, Tailwind)          validation,                collections)
                                 global error/
                                 response envelope)
```

Every backend response is wrapped consistently — `{ success: true, statusCode, data }` on
success, `{ success: false, statusCode, message, error }` on failure — so the frontend's
`lib/api.ts` can unwrap once and every page just gets clean typed data or a thrown error.

---

## Backend Folder Structure

```
backend/
├── src/
│   ├── main.ts                     # bootstrap: global pipes/filters/interceptors, CORS
│   ├── app.module.ts               # root module
│   ├── config/
│   │   ├── configuration.ts        # reads process.env into a typed config object
│   │   └── validation.schema.ts    # Joi schema — app refuses to boot if MONGODB_URI is missing
│   ├── database/
│   │   └── database.module.ts      # MongoDB Atlas connection (MongooseModule.forRootAsync)
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   # global error shape
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts   # global success shape
│   │   └── utils/
│   │       └── generate-ticket-id.util.ts # formats TKT-000001 from a sequence number
│   ├── tickets/
│   │   ├── schemas/
│   │   │   ├── ticket.schema.ts    # Ticket document (notes embedded — see design note below)
│   │   │   ├── note.schema.ts      # embedded sub-document
│   │   │   └── counter.schema.ts   # atomic counter collection for ticket IDs
│   │   ├── dto/
│   │   │   ├── create-ticket.dto.ts
│   │   │   ├── update-ticket.dto.ts
│   │   │   ├── add-note.dto.ts
│   │   │   └── query-ticket.dto.ts
│   │   ├── enums/
│   │   │   └── ticket-status.enum.ts   # Open | In Progress | Closed
│   │   ├── tickets.controller.ts   # REST endpoints
│   │   ├── tickets.service.ts      # search, filter, status update, notes, ID generation
│   │   └── tickets.module.ts
│   └── health/
│       └── health.controller.ts    # GET /health
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json
```

### Data Model

**Ticket** (`tickets` collection)

| field | type | notes |
|---|---|---|
| ticket_id | string, unique | e.g. `TKT-000001`, generated via an atomic counter |
| customer_name | string | |
| customer_email | string | |
| subject | string | |
| description | string | |
| status | enum | `Open` \| `In Progress` \| `Closed` |
| notes | Note[] | embedded sub-documents, not a separate collection |
| created_at / updated_at | Date | auto-managed by Mongoose timestamps |

**Design tradeoff — embedded notes vs. a separate `notes` collection:** the assignment spec
sketches notes as their own table with a `ticket_id` foreign key (a relational shape). In
MongoDB, notes are always read/written together with their parent ticket, and a ticket
realistically has a handful of notes — the classic one-to-few embedding case. Embedding means
the ticket detail view is a single query instead of a query + join, at the cost of not being
able to efficiently query "all notes across every ticket" independently. That's a small,
well-contained migration later if it's ever needed.

A `counters` collection backs atomic, gap-free ticket ID generation (`findOneAndUpdate` +
`$inc`), so concurrent ticket creation can never produce duplicate IDs.

### API Endpoints

| Method | Path | Body / Query | Description |
|---|---|---|---|
| POST | `/api/tickets` | `{ customer_name, customer_email, subject, description }` | Create a ticket |
| GET | `/api/tickets` | `?status=Open&search=jane&page=1&limit=20` | List/search/filter (paginated) |
| GET | `/api/tickets/:ticket_id` | — | Full ticket detail incl. notes |
| PUT | `/api/tickets/:ticket_id` | `{ status?, notes? }` | Update status and/or append a note |
| POST | `/api/tickets/:ticket_id/notes` | `{ note_text }` | Dedicated add-note endpoint |
| GET | `/health` | — | Liveness check |

---

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # fonts, header nav, page shell (wraps every page)
│   │   ├── page.tsx                      # route: /            → ticket list
│   │   ├── globals.css                   # Tailwind directives + base color tokens
│   │   └── tickets/
│   │       ├── new/
│   │       │   └── page.tsx              # route: /tickets/new → create-ticket form
│   │       └── [ticket_id]/
│   │           └── page.tsx              # route: /tickets/:id → detail, status, notes
│   ├── components/
│   │   ├── ticket-list.tsx               # fetch + search + filter + pagination state
│   │   ├── ticket-row.tsx                # one row (status color bar, mono ticket ID)
│   │   ├── status-badge.tsx              # status badge + row-color map
│   │   ├── search-filter-bar.tsx         # search input + status dropdown
│   │   ├── ticket-form.tsx               # create-ticket form, client-side validation
│   │   ├── notes-timeline.tsx            # notes list + add-note form
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx                 # Input + Textarea primitives
│   │       └── select.tsx
│   ├── lib/
│   │   ├── api.ts                        # typed fetch client, unwraps the backend's envelope
│   │   └── types.ts                      # Ticket / Note / TicketStatus shared types
│   └── hooks/
│       └── use-debounce.ts               # debounces search input (300ms)
├── public/
├── .env.local.example
├── next.config.js
├── tailwind.config.ts                    # design tokens: paper/surface/ink/muted/hairline,
│                                            accent, and per-status color pairs
├── postcss.config.js
├── tsconfig.json
└── package.json
```

### Routing (file-based)

| File | URL | Purpose |
|---|---|---|
| `app/page.tsx` | `/` | Ticket list — search, filter, pagination |
| `app/tickets/new/page.tsx` | `/tickets/new` | Create a ticket |
| `app/tickets/[ticket_id]/page.tsx` | `/tickets/TKT-000001` | Detail, status change, notes |

### Design Notes

- IBM Plex Mono is reserved for ticket IDs and timestamps only — literal data an agent might
  copy — never used decoratively.
- Ticket rows use a left-edge color bar (amber/indigo/green) tied to status; cards use a soft
  `shadow-card` + `rounded-md` to lift surfaces off the `paper` background.
- Search is debounced and calls `GET /api/tickets?search=` live.

---

## Local Setup (both apps)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env      # set MONGODB_URI to your Atlas connection string
npm run start:dev         # http://localhost:3000
```

**Frontend** (in a separate terminal):
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev -- -p 3002             # http://localhost:3002 (avoids clashing with the backend's port)
```

## MongoDB Atlas Setup

1. Create a free cluster at https://cloud.mongodb.com.
2. Database Access → add a database user with a password.
3. Network Access → allow access from anywhere (`0.0.0.0/0`) for the assessment.
4. Database → Connect → Drivers → copy the connection string into the backend's `MONGODB_URI`.

## Deployment

**Backend — Render, as a Web Service:**

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start:prod` |

Use `start:prod`, not `start` — `npm start` runs `nest start`, which recompiles TypeScript
in-memory on every launch and can OOM-crash on small instances. `start:prod` runs the
already-built `node dist/main`.

Environment variables to set on Render: `MONGODB_URI`, `CORS_ORIGIN` (the frontend's deployed
URL). `PORT` is provided automatically by Render.

**Frontend — Vercel (recommended) or Render as a Web Service:**

This app has a dynamic route (`/tickets/[ticket_id]`) resolved at request time, so it needs a
running Node process — do not deploy it as a static site.

- *Vercel:* import the repo, set `NEXT_PUBLIC_API_URL` to the backend's deployed URL, deploy.
- *Render Web Service:* Build Command `npm install && npm run build`, Start Command
  `npm run start`. (Unlike the backend, plain `start` is safe here — it serves the built
  `.next` output directly, no in-memory recompilation.)

## Troubleshooting

- **Yarn resolves a much newer/incompatible dependency during deploy:** force the platform's
  Build Command to `npm install && npm run build` so your locked `package-lock.json` versions
  are respected instead of freshly re-resolved ones.
- **Backend: `JavaScript heap out of memory` right after a successful build:** Start Command is
  wrong — use `npm run start:prod`, not `npm start`.
- **Frontend: Tailwind classes have no effect:** run `npm ls tailwindcss` — if it shows `4.x`
  instead of `3.x`, delete `node_modules` + lockfile and reinstall; also check for a stray
  `postcss.config.mjs` (only `postcss.config.js`, CommonJS, should exist).
- **Frontend: `Configuring Next.js via 'next.config.ts' is not supported`:** this Next.js
  version only supports `.js`/`.mjs` config files — rename to `next.config.js`.
- **`Unexpected token '<', "<!DOCTYPE"` in the browser:** the frontend's `NEXT_PUBLIC_API_URL`
  is pointing at something that returns an HTML page instead of the API (often because the
  backend isn't running, or both apps ended up on the same port).

## What I'd Add With More Time

- Basic auth for support agents (spec allows skipping this for the MVP)
- Sortable columns on the ticket list, not just filter + search
- A full-text index-backed search path for scale (a regex scan is fine at this data size; a
  `$text` index is already defined on the schema as a documented next step)