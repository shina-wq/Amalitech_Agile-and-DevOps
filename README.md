# TaskFlow API

[![CI](https://github.com/shina-wq/Amalitech_Agile-and-DevOps/actions/workflows/ci.yml/badge.svg)](https://github.com/shina-wq/Amalitech_Agile-and-DevOps/actions/workflows/ci.yml)

A lightweight REST API for creating, organising and tracking tasks, delivered over two sprints to demonstrate Agile and DevOps practices.

## Contents

1. [Quick start](#quick-start)
2. [API reference](#api-reference)
3. [Project structure](#project-structure)
4. [Sprint 0 – Planning](#sprint-0--planning)
5. [Sprint 1 – Execution](#sprint-1--execution)
6. [Sprint 2 – Execution & Improvement](#sprint-2--execution--improvement)
7. [Evidence](#evidence)

---

## Quick start

Requires Node.js 22 or later.

```bash
npm install
npm start      # http://localhost:3000
npm test       # run the test suite
```

| Layer | Choice |
|-------|--------|
| Runtime / framework | Node.js + Express 5 |
| Testing | Jest 29 + Supertest |
| CI | GitHub Actions (Node 22.x and 24.x) |
| Storage | In-memory (resets on restart) |

## API reference

| Method | Path | Success | Errors |
|--------|------|---------|--------|
| `POST` | `/tasks` | `201` created task | `400` invalid body |
| `GET` | `/tasks` | `200` all tasks | — |
| `GET` | `/tasks?status=done` | `200` filtered tasks | `400` invalid status |
| `PATCH` | `/tasks/:id/status` | `200` updated task | `400` invalid status, `404` not found |
| `DELETE` | `/tasks/:id` | `204` no body | `404` not found |
| `GET` | `/health` | `200` `{ "status": "ok", "uptime": <seconds> }` | — |

**Task**

```json
{
  "id": "3f1c…",
  "title": "Plan sprint",
  "description": "Pick 2-3 stories",
  "status": "todo",
  "createdAt": "2026-10-11T13:04:09.579Z"
}
```

`status` is one of `todo`, `in-progress` or `done`. All errors return JSON: `{ "error": "<message>" }`.

## Project structure

```
src/
├── app.js                    # Express app: middleware, routes, error handlers
├── server.js                 # Starts the HTTP server
├── middleware/
│   ├── requestLogger.js      # Logs method, path, status and response time
│   └── errorHandlers.js      # JSON 404, malformed JSON (400) and 500 handlers
├── routes/
│   ├── health.js             # GET /health
│   └── tasks.js              # /tasks endpoints and validation
└── store/
    └── taskStore.js          # In-memory task storage
tests/                        # Unit and integration tests (Jest + Supertest)
.github/workflows/ci.yml      # CI pipeline
```

---

## Sprint 0 – Planning

### Product vision

> For individuals who need a simple way to track their work, **TaskFlow** is a lightweight REST API for creating, organising and tracking tasks, delivered reliably through automated testing and continuous integration.

### Product backlog

Priority uses **MoSCoW**. Estimates use **Fibonacci story points**, relative to the smallest item (US6 = 1).

| ID | User story | Priority | Points | Sprint |
|----|------------|----------|:------:|:------:|
| US1 | As a user, I want to **create a task** so that I can record work I need to do. | Must | 3 | 1 |
| US2 | As a user, I want to **list all tasks** so that I can see my workload. | Must | 2 | 1 |
| US3 | As a user, I want to **update a task's status** so that I can track progress. | Must | 3 | 1 |
| US4 | As a user, I want to **delete a task** so that I can remove items that are no longer relevant. | Should | 2 | 2 |
| US5 | As a user, I want to **filter tasks by status** so that I can focus on what matters now. | Should | 3 | 2 |
| US6 | As an operator, I want a **health endpoint** so that I can check the service is running. | Must | 1 | 2 |
| US7 | As an operator, I want **request logging and central error handling** so that I can troubleshoot issues. | Must | 3 | 2 |
| | | | **17** | |

### Acceptance criteria

Criteria marked 🔄 were refined at the start of Sprint 2 (a Sprint 1 retro action).

**US1 – Create a task**
- Given a valid `title`, `POST /tasks` returns `201` with `id`, `title`, `status: "todo"` and `createdAt`.
- Given an optional `description`, it is saved and returned.
- Given a missing or empty `title`, it returns `400` with an error message.
- 🔄 `title` is trimmed; a whitespace-only title counts as empty.
- 🔄 Given a `description` that is not a string, it returns `400`.

**US2 – List all tasks**
- `GET /tasks` returns `200` with an array of all tasks.
- Given no tasks exist, it returns `200` with an empty array.

**US3 – Update a task's status**
- Given an existing task and a valid status, `PATCH /tasks/:id/status` returns `200` with the updated task.
- Given an invalid status, it returns `400` with an error message.
- Given an unknown task ID, it returns `404`.

**US4 – Delete a task**
- Given an existing task, `DELETE /tasks/:id` returns `204` and the task no longer appears in `GET /tasks`.
- Given an unknown task ID, it returns `404`.

**US5 – Filter tasks by status**
- `GET /tasks?status=done` returns `200` with only tasks of that status.
- Given an invalid status value, it returns `400` with an error message.

**US6 – Health endpoint**
- `GET /health` returns `200` with `{ "status": "ok" }` and the service uptime.
- 🔄 The body is exactly `{ "status": "ok", "uptime": <seconds> }`.

**US7 – Logging and error handling**
- Every request is logged with method, path, status code and response time.
- Unexpected errors return `500` with a generic message and are logged with details.
- Unknown routes return `404` with an error message.
- 🔄 Malformed JSON returns `400` with a JSON error, not an HTML page.
- 🔄 Request logs are silenced while tests run.

### Definition of Done

- [x] All acceptance criteria are met
- [x] Unit and/or integration tests are written and passing
- [x] Code is committed in small, descriptive commits
- [x] The CI pipeline passes on `main`
- [x] The README is updated where relevant

---

## Sprint 1 – Execution

### Plan

**Goal:** A user can create, view and progress tasks, with tests running automatically in CI.
**Commitment:** US1, US2, US3 — 8 points.

| Task | Story |
|------|-------|
| Initialise Node project and Express app | Setup |
| Set up Jest + Supertest | Setup |
| Set up GitHub Actions CI workflow | Setup |
| `POST /tasks` with validation and tests | US1 |
| `GET /tasks` with tests | US2 |
| `PATCH /tasks/:id/status` with validation and tests | US3 |

### Review

**Goal met ✅ — velocity 8 / 8 points.**

| Story | Points | Delivered | Tests |
|-------|:------:|-----------|:-----:|
| US1 – Create a task | 3 | `POST /tasks` | 7 |
| US2 – List all tasks | 2 | `GET /tasks` | 4 |
| US3 – Update a task's status | 3 | `PATCH /tasks/:id/status` | 8 |

- **CI:** [`ci.yml`](.github/workflows/ci.yml) runs `npm ci` and `npm test` on every push and pull request to `main`, on Node 22.x and 24.x.
- **Testing:** 22 tests — unit tests for the store, integration tests for the endpoints.

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" \
  -d '{"title": "Plan sprint"}'                          # 201 → { "id": "…", "status": "todo", … }
curl http://localhost:3000/tasks                         # 200 → [ { … } ]
curl -X PATCH http://localhost:3000/tasks/<id>/status -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'                         # 200 → { …, "status": "in-progress" }
```

### Retrospective

| ✅ Went well | ⚠️ Didn't go well |
|-------------|-------------------|
| All stories delivered and meet their criteria | Jest 30 failed on Windows (native dependency needs the VC++ Redistributable); downgrading to Jest 29 cost time and left a dev-only `npm audit` warning |
| Tests written alongside each story | Commit messages used the `type(story):` format inconsistently |
| CI set up early, so every later commit was tested | Extra validation rules were added to US1 without updating its criteria first |
| Small commits, one per task | Evidence (screenshots) was left until the end of the sprint |

**Improvements for Sprint 2**

1. **Traceable commits** — use [Conventional Commits](https://www.conventionalcommits.org/) with the story ID, e.g. `feat(US4): …`.
2. **Refine before building** — update a story's acceptance criteria *before* implementing a new rule.
3. **Capture evidence as we go** — save test output and CI screenshots to `docs/screenshots/` after each story.
4. **Check tooling up front** — check a dependency's platform requirements before adopting it.

---

## Sprint 2 – Execution & Improvement

### Plan

**Goal:** A user can delete and filter tasks, and an operator can monitor health and troubleshoot through logs and consistent errors.
**Commitment:** US4, US5, US6, US7 — 9 points.

| Task | Story |
|------|-------|
| `DELETE /tasks/:id` with tests | US4 |
| `?status=` filter on `GET /tasks` with tests | US5 |
| `GET /health` with tests | US6 |
| Request-logging middleware | US7 |
| JSON 404, malformed-JSON and 500 error handlers with tests | US7 |

### Review

**Goal met ✅ — velocity 9 / 9 points. All 17 backlog points delivered.**

| Story | Points | Delivered | New tests |
|-------|:------:|-----------|:---------:|
| US4 – Delete a task | 2 | `DELETE /tasks/:id` | 4 |
| US5 – Filter tasks by status | 3 | `GET /tasks?status=` | 5 |
| US6 – Health endpoint | 1 | `GET /health` | 1 |
| US7 – Logging and error handling | 3 | Request logger + JSON error handlers | 4 |

**Monitoring and logging**

| Capability | Implementation |
|------------|----------------|
| Health check | `GET /health` returns status and uptime, for uptime monitors and load balancers |
| Request logging | Every request logged with timestamp, method, path, status and duration |
| Error tracking | Unexpected errors logged with stack trace; clients only see a generic `500` |
| Consistent errors | `404`, malformed-JSON `400` and `500` responses all return JSON |

```
TaskFlow API listening on port 3000
2026-10-11T13:04:09.579Z GET /health 200 6.0ms
2026-10-11T13:04:09.657Z POST /tasks 201 14.3ms
2026-10-11T13:04:09.725Z GET /tasks?status=bad 400 0.8ms
```

**Testing:** 36 tests across 6 suites (22 → 36), all passing.

| Suite | Type | Tests |
|-------|------|:-----:|
| `tasks.test.js` | Integration | 21 |
| `taskStore.test.js` | Unit | 9 |
| `app.test.js` | Integration | 2 |
| `requestLogger.test.js` | Unit | 2 |
| `errorHandlers.test.js` | Unit | 1 |
| `health.test.js` | Integration | 1 |

### Retrospective

**Sprint 1 actions — did we follow through?**

| Action | Result |
|--------|--------|
| 1. Traceable commits | ❌ Commits were clear but still lacked the `type(story):` prefix. |
| 2. Refine before building | ✅ Refining US7 exposed a real gap — malformed JSON returned an HTML page — which was fixed and tested. |
| 3. Capture evidence as we go | ❌ Screenshots were not saved after each story. |
| 4. Check tooling up front | ✅ No new dependencies; logging uses built-in Node and Express features. |

| ✅ Went well | ⚠️ Didn't go well |
|-------------|-------------------|
| All stories delivered; velocity grew from 8 to 9 | Two of four retro actions slipped — both relied on remembering a habit |
| Up-front refinement caught a defect before release | No automated linting or coverage checks in CI yet |
| Logger and error handler accept a log function, so monitoring is tested without noisy output | |

**Lessons learned**

- **Build improvements into the process.** The actions that stuck were part of planning; the ones that slipped depended on memory.
- **Small, refined stories make delivery predictable.** Both sprints delivered 100% of their commitment.
- **Design for testability.** Separating `app.js` from `server.js` and injecting the logger made every feature easy to test in isolation.

**Next improvements**

1. **Enforce commit format** with `commitlint` in a commit hook or CI step.
2. **Make evidence part of Done** — add "evidence saved" to the Definition of Done.
3. **Add coverage and linting to CI** — `jest --coverage` with a threshold, plus ESLint.
4. **Persist data** — replace the in-memory store with a database.

---

## Evidence

| Deliverable | Where |
|-------------|-------|
| Backlog and sprint plans | [Sprint 0 – Planning](#sprint-0--planning), plus the Plan section of each sprint |
| Codebase and commit history | [`src/`](src), [`tests/`](tests), and the repository's commit history |
| CI/CD | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and the [Actions runs](https://github.com/shina-wq/Amalitech_Agile-and-DevOps/actions) |
| Test results | `npm test` locally, or the "Run tests" step of any CI run |
| Sprint reviews | [Sprint 1 Review](#review) and [Sprint 2 Review](#review-1) |
| Retrospectives | [Sprint 1 Retro](#retrospective) and [Sprint 2 Retro](#retrospective-1) |
| Screenshots | [`docs/screenshots/`](docs/screenshots) |
