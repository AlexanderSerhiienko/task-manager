# Workspace Task Manager

A workspace-based task manager where teams can:
- sign in with Google,
- create workspaces and projects,
- create tasks and assign executors,
- move tasks across statuses,
- track workspace-level progress.

This repository is built as a portfolio-ready full-stack project focused on architecture, consistency, and access control.

## Product Scope (MVP)

Included:
- Google authentication,
- workspace creation and settings,
- workspace members management (owner-only mutations),
- projects CRUD (owner-only mutations),
- tasks create/edit/delete/status updates,
- task assignment with role-aware rules,
- dashboard overview (projects/tasks counters).

Excluded:
- comments, attachments, notifications,
- advanced roles/permissions,
- billing, integrations,
- advanced analytics, filtering/search, drag-and-drop.

## Roles and Permissions

### Owner
- manage workspace settings,
- add/remove workspace members,
- create/edit/delete projects,
- create/edit/delete tasks,
- change task status,
- assign tasks to any workspace member.

### Member
- view workspace/projects/members/overview,
- create/edit/delete tasks,
- change task status,
- assign tasks only to self (and remove self-assignment).

## Tech Stack

- Next.js App Router
- React 19
- NextAuth v5 (Google provider)
- Prisma + PostgreSQL
- React Query
- Tailwind CSS
- Zod

## Architecture Snapshot

- `app/api/*` - HTTP API boundary (validation + error mapping)
- `src/server/services/*` - business logic layer
- `src/server/access-control.ts` - membership and role checks
- `src/shared/contracts/*` - shared DTO contracts
- `src/hooks/queries/*` - client data hooks (React Query)
- `components/features/*` - feature-based UI composition
- `components/ui/*` - reusable UI primitives

Flow:
1. UI triggers a typed query/mutation hook.
2. Hook calls API route via `src/shared/api-client.ts`.
3. API route validates input with Zod and delegates to service layer.
4. Service layer enforces access rules and works with Prisma.
5. Hook invalidates related query keys for consistent UI state.

## Setup

### Prerequisites

- Node.js 20+
- Docker Desktop
- Google OAuth credentials

### Environment

Copy and edit:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

### Run database

```bash
docker compose up -d
```

Stop database:

```bash
docker compose down
```

### Install and run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Open `http://localhost:3000`.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm run test
npm run test:server
npm run test:ui
npm run build
npm run ci
```

## Testing Strategy

Current test suite focuses on the highest-risk areas:

- Service authz/policy tests:
  - owner vs member restrictions,
  - member self-assign / self-unassign behavior.
- API error contract tests:
  - stable `{ error: { code, message, details } }` payload shape,
  - expected status-code mapping for key failure paths.
- API workflow integration test:
  - workspace -> project -> task -> status update -> assignee update.
- UI smoke tests:
  - dashboard/workspace list loading and empty states,
  - project create modal open/close/submit-error rendering.

## Prisma Utilities

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Demo Flow

1. Sign in with Google.
2. Create your first workspace.
3. Create a project.
4. Create tasks and assign executors.
5. Move tasks between `To do`, `In progress`, `Done`.
6. Check workspace overview counters.
7. Open members/settings and verify role-based behavior.

## Design and Implementation Decisions

- API-first client boundary: UI reads/writes data through `app/api/*`.
- Service layer keeps business logic outside route handlers.
- Shared contracts avoid leaking ORM types into client UI.
- React Query centralizes fetching, caching, invalidation strategy.
- Reusable modal/button/state components enforce UI consistency.

## Known Limitations

- Automated tests are currently minimal and will be expanded.
- No pagination yet for large lists.
- No activity log/history.
- No advanced notifications or integrations.

## Roadmap

- Add integration tests for authz and API contracts.
- Add pagination for members/projects/tasks lists.
- Add richer dashboard analytics.
- Add comments and attachments to tasks.
