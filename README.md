# Trimly — Beauty Salon Management System

> A full-stack web application for managing beauty salons — appointments, staff schedules, services, and client bookings — inspired by platforms like Fresha.

![Banner](./screenshots/banner.png)

---

## ✨ Features

### For Salon Owners & Managers
- **Multi-organization support** — one account, multiple salons, different roles in each
- **Team management** — invite staff via email, assign roles (Owner / Manager / Staff)
- **Service management** — create services with duration and pricing, assign them to specific staff members
- **Weekly schedule** — define recurring working hours per staff member, with temporary exceptions up to 4 weeks ahead
- **Blocked time** — staff can mark time as unavailable without affecting the base schedule
- **Appointment calendar** — full weekly view per staff member with real-time availability

### For Clients
- **Online booking** — select services, preferred staff (or "no preference"), available date and time
- **Multi-service appointments** — book multiple services in one session, duration calculated automatically
- **Guest bookings** — staff can create appointments for walk-in clients without an account

### Technical Highlights
- JWT authentication with access + refresh token rotation
- Google OAuth 2.0 login
- Email verification and invitation system via MailCatcher (dev) / SMTP (prod)
- Availability engine — computes free slots across 4 weeks considering schedule, exceptions, existing appointments and blocked times
- Conflict prevention — overlap validation at both service and database level
- Full multi-tenant architecture — data isolated per organization

---

## 🖥️ Screenshots

### Calendar View
![Calendar](./screenshots/calendar.png)

### Booking Flow
![Booking](./screenshots/booking.png)

### Services Management
![Services](./screenshots/services.png)

### Team Management
![Team](./screenshots/team.png)

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS** | Modular REST API framework |
| **Prisma ORM** | Type-safe database access + migrations |
| **PostgreSQL** | Relational database (hosted in Docker locally) |
| **Passport.js** | Authentication strategies (JWT + Google OAuth) |
| **JWT** | Access token + refresh token auth flow |
| **MailCatcher** | Email interception in development |
| **Docker** | Local PostgreSQL container |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework (full client-side rendering) |
| **TanStack Query** | Server state management, caching, refetching |
| **Zustand** | Client auth state (access token, user payload) |
| **Tailwind CSS v4** | Utility-first styling with custom theme |
| **shadcn/ui + Base UI** | Component library |
| **React Hook Form + Zod** | Form handling and schema validation |

---

## 🗄️ Database Schema

The data model covers 12 entities with clear relational boundaries:

```
User ──────────────── OrganizationMember ─── WeeklySchedule ─── ScheduleSlot
                │
                └──── Organization ─── Service ─── MemberService
                                  │
                                  └─── OrganizationInvite
                                  └─── OrganizationClient

OrganizationMember ─── Appointment ─── AppointmentService
                   └─── BlockedTime
```

Key design decisions:
- **Recurring schedule + exceptions** — a base `WeeklySchedule` (no expiry) plus temporary overrides with `validFrom`/`validUntil`. Last-write-wins per day.
- **Time stored as minutes from midnight** — enables simple integer comparisons for overlap detection (`startMin < endMin AND endMin > startMin`).
- **Multi-service appointments** — `AppointmentService` join table allows one appointment to contain multiple services, each with its own duration contributing to the total.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Next.js Frontend                │
│  TanStack Query  │  Zustand  │  shadcn/ui        │
└──────────────────────┬──────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────┐
│                  NestJS Backend                  │
│                                                  │
│  Auth Module    │  Organizations  │  Schedule    │
│  Appointments   │  Services       │  Availability│
│  Invites        │  Blocked Times  │  Members     │
│                                                  │
│  Passport JWT   │  Guards         │  Pipes/DTOs  │
└──────────────────────┬──────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────┐
│              PostgreSQL (Docker)                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for PostgreSQL)
- MailCatcher (optional, for email dev)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trimly.git
cd trimly

# Install dependencies
pnpm install
```

### Environment Variables

Create `.env` in the backend app:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_db"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FRONTEND_URL="http://localhost:3000"
SMTP_HOST="localhost"
SMTP_PORT=1025
```

Create `.env.local` in the frontend app:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Run with Docker

```bash
# Start PostgreSQL
docker run --name trimly-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saas_db \
  -p 5432:5432 \
  -d postgres

# Apply migrations and seed default data
pnpm prisma migrate dev

# Start backend
pnpm --filter backend dev

# Start frontend
pnpm --filter frontend dev
```

---

## 📁 Project Structure

```
apps/
  backend/
    src/
      auth/               # JWT + Google OAuth strategies, guards
      organizations/      # Org CRUD, members, invites, clients
      schedule/           # Weekly schedules + slot management
      services/           # Service + member-service assignment
      appointments/       # Booking creation + availability engine
      blocked-times/      # Staff blocked intervals
      prisma/             # PrismaService
      common/
        decorators/       # @CurrentUser, @CurrentOrganization, @CurrentMember
        guards/           # JwtAuthGuard, RolesGuard, OrganizationContextGuard
        filters/          # Global exception filter

  frontend/
    app/
      (auth)/             # Login, register, email verification
      (dashboard)/        # Org dashboard, calendar, settings
      invites/            # Invitation acceptance flow
    components/
      ui/                 # shadcn/base-ui primitives
      my-ui/              # Custom components (SearchBar, DatePicker, etc.)
    common/
      stores/             # Zustand auth store
      providers/          # TanStack Query provider
    api/                  # Typed fetch functions per resource
```

---

## 🔐 Authentication Flow

```
1. User logs in (credentials or Google OAuth)
2. Server returns accessToken (15m) + refreshToken (7d)
3. Frontend stores tokens in Zustand, persisted to localStorage
4. Every API request includes Authorization: Bearer <accessToken>
5. On 401, frontend automatically calls /auth/refresh with refreshToken
6. New accessToken issued transparently — user stays logged in
```

---

## 📅 Availability Engine

The availability engine computes bookable slots across 4 weeks:

1. **Load** recurring schedules + temporary exceptions for all candidate staff
2. **Subtract** existing appointments and blocked times to get free intervals
3. **Apply last-write-wins** — if multiple schedules overlap a date, the most recently created takes priority
4. **Chain services** — for multi-service bookings, each service's slot starts exactly when the previous ends, checking a different staff member if needed
5. **Return** grouped results by date with all valid `startMin` values (15-min granularity)

---

## 📬 Email System

In development, all outgoing emails are intercepted by **MailCatcher** and visible at `http://localhost:1080`. No real emails are sent.

Email templates are written in **Pug** and include:
- Email verification on signup
- Password reset
- Organization invitation with role assignment

---

## 📄 License

MIT

