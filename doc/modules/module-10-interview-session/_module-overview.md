# Module Overview: MOD-10 — Interview Session

## 1. Module Summary

### Purpose
Manages the active lifecycle of a mock interview session — from creation with INITIALIZED state, through IN_PROGRESS as answers are collected, to COMPLETED on final submission — including offline resume capability via Room DB.

### Responsibilities
- Session record creation and state machine management.
- Answer record capture per question (text + audio URL).
- Session completion trigger to hand off to MOD-14 AI Evaluation.
- Offline session state caching (Room DB, Android).

### Scope Boundaries
**In Scope:** Session CRUD; state transitions; answer persistence; offline cache; completion trigger.
**Out of Scope:** Live session proctoring; simultaneous multi-device sessions.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-10-01 | Session Lifecycle Management | Backend Dev | P0 | Approved |
| FT-10-02 | Answer Submission | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-09 Interview Configuration (session parameters)
- MOD-11 Question Delivery (question list)
- MOD-12 Voice Recording / MOD-13 STT (audio answers)
- PostgreSQL (session + answer persistence)
- Room DB / Android (offline cache)

### Depended Upon By
- MOD-14 AI Evaluation
- MOD-17 Reporting
- MOD-18 Dashboard

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-004 | Session Initialization Time | < 2s | `session_init_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| SESS-001 | Session not found | 404 |
| SESS-002 | Session already completed | 409 |
| SESS-004 | Answer submitted after session closed | 409 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Session Lifecycle | US-002 | FR-002 | API-10-01 | TC-10-01 | KPI-004 |
| Answer Submission | US-002 | FR-003 | API-10-02 | TC-10-02 | KPI-005 |
