# Module Overview: MOD-17 — Reporting

## 1. Module Summary

### Purpose
Generates structured session-level and aggregate performance reports for candidates, combining score data, feedback data, and session metadata into a comprehensive, queryable report API consumed by the dashboard and recommendation engine.

### Responsibilities
- Compile session report from score + feedback + session metadata.
- Expose session detail report endpoint per session ID.
- Expose historical report list with filtering and pagination.
- Provide data feed to MOD-18 Dashboard and MOD-19 Recommendation.

### Scope Boundaries
**In Scope:** Session report compilation; list API with filters; single report detail API.
**Out of Scope:** PDF/CSV report export; scheduled email reports.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-17-01 | Session Report Generation | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-14 AI Evaluation
- MOD-15 Scoring Engine
- MOD-16 Feedback Engine
- MOD-10 Interview Session
- PostgreSQL

### Depended Upon By
- MOD-18 Dashboard
- MOD-19 Recommendation Engine

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-007 | Dashboard Load Time | < 2s | `dashboard_render_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| RPT-001 | Report not found | 404 |
| RPT-002 | Report data aggregation error | 500 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Session Report | US-003 | FR-012 | API-17-01 | TC-17-01 | KPI-007 |
