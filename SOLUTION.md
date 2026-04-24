# Solution Notes

## The Problem

The `GET /api/users` endpoint worked, but it always returned every user at once in whatever order they happened to be stored. No sorting, no pagination, no way to control the output.

---

## First Decision: Architecture

Before writing any feature code, the first thing to address was the structure. Everything was crammed into a single route file — the data, the logic, and the HTTP handling all in one place. That works for a demo, but it makes every future change harder than it needs to be.

We split it into proper layers:

| File | Responsibility |
|------|---------------|
| `types/user.types.ts` | Shared TypeScript types across all layers |
| `data/users.data.ts` | The data in one place — easy to swap for a real DB later |
| `services/user.service.ts` | All business logic: sorting, pagination, building links |
| `controllers/user.controller.ts` | Reads the request, validates params, calls the service |
| `routes/user.route.ts` | Connects the URL to the controller — nothing else |
| `config/logger.ts` | Structured logging setup |
| `app.ts` | Wires up routes and exports the Express app — no server binding |
| `server.ts` | The only place that calls `listen()` and starts accepting traffic |

`app.ts` and `server.ts` are intentionally split. When tests import `app.ts`, they get the fully configured app without a real server starting on port 3001. Supertest handles its own internal binding. Without this split, importing the app in tests would start a server that never closes, causing Jest to hang after every test run.

---

## Adding Pagination & Sorting

A few deliberate decisions here:

**Sorting is dynamic by design.** Instead of hardcoding `if sort === 'name'` or `if sort === 'id'`, the sort field is typed as `keyof User`. That means if someone adds an `email` field to the User type tomorrow, sorting by it just works — no changes needed in the service or controller.

**`totalResults` always reflects the full count**, not the current page count. A caller needs to know the total to calculate how many pages exist. Returning the page-slice count would be useless.

**`next` and `previous` only appear when they make sense.** No `previous` on page 1, no `next` on the last page. They're omitted entirely from the response, not set to null.

---

## Logging

We used [Pino](https://getpino.io/) for application logging. It's one of the fastest Node.js loggers, outputs structured JSON by default, and works with Azure App Service's stdout capture without any extra configuration. In development it prints colorized, human-readable output instead.

We considered Winston (more popular) and Azure Application Insights (Azure-native with distributed tracing), but Pino hits the right balance: production-ready, cloud-friendly, and zero infrastructure lock-in.

Morgan handles HTTP-level logging (method, URL, status, response time) and stays in place since it was already part of the project. Two different concerns, two different tools.

Both are silenced during tests:
- **Pino** is set to `level: 'silent'` when `NODE_ENV=test`.
- **Morgan** uses its built-in `skip` option — the middleware stays registered, it just produces no output during tests. This is Morgan's own recommended approach.

---

## Type Safety Over Convenience

A small but deliberate choice: query params are extracted using a `toStringParam` helper instead of TypeScript type assertions (`as string`).

The reason: TypeScript accepts `as string` even when the actual runtime value is an array — which happens when a caller sends `?page=1&page=2`. The cast silently lies, and the validation logic below it gets bad input. `toStringParam` checks the type at runtime first and returns `undefined` if it isn't a plain string, so validation always starts with clean data.

Similarly, the valid sort fields and orders are stored in Sets using the `satisfies` keyword — if someone adds a value to the `SortOrder` type but forgets to add it to the Set, TypeScript will catch it at compile time.

---

## Testing Strategy

Two test suites with different purposes:

- **`user.service.test.ts`** — pure unit tests. Call the service function directly, no HTTP involved. Fast and focused: does sorting work in both directions? Are page slices correct? Do the links point to the right pages?

- **`user.controller.test.ts`** — integration tests via Supertest. Send real HTTP requests through the full Express stack. Covers happy paths, all validation failure cases, and paging link format.

- **`pagination.utils.test.ts`** — unit tests for the shared utilities, including `toStringParam`, `parseIntParam`, `isValidInt`, and `buildPagingUri`.

Logs are silenced during tests — both Pino and Morgan — so the test output stays clean and failures are easy to spot.

---

## Built to Grow

Pagination logic — parsing params, validating ranges, building paging links, and safely extracting string values — lives in `src/utils/pagination.ts`. It has nothing user-specific in it. When a `products` or `orders` endpoint gets added, those utilities are already there to import.

---

## A Note on Process

AI tooling (Claude) was used throughout this challenge to accelerate code generation, review decisions, and improve code quality. Every suggestion was evaluated, questioned, and refined — for example, choosing Pino over Winston after discussing Azure compatibility, removing unnecessary comments that explained *what* instead of *why*, adding `toStringParam` after identifying that type assertions were unsafe, and silencing test logs after noticing Morgan output polluting the test run. AI as a collaborator, not a replacement for judgment.

---

## Security

`npm audit` was run after installing all dependencies — **0 vulnerabilities** found. Page size is also capped at 100 to prevent unbounded requests.

---

## What We'd Add Next

- **Client security audit** — `npm audit` was only run on the server. The React client has its own dependencies that should be scanned and addressed separately.

- **Linting and formatting** — adding ESLint and Prettier would enforce consistent code style automatically and catch common mistakes before they reach a PR. Ideally hooked into a pre-commit check.
