# Module Overview: MOD-18 — Analytics & Dashboard

## 1. Module Summary

### Purpose
Provides candidates with a personal performance dashboard displaying historical mock interview scores, trend analytics over time, subdomain-level breakdowns, and progress tracking. Provides Super Admins with a platform-wide telemetry and usage dashboard.

### Responsibilities
- Aggregate evaluation report data into trend metrics.
- Serve candidate performance history (session list, scores, trends).
- Render admin-facing system health and usage KPIs.
- Support subdomain-level and time-range filtering.

### Scope Boundaries
**In Scope:**
- Candidate historical session list with scores.
- Score trend charts (over time).
- Subdomain-level strength/weakness breakdown aggregation.
- Admin dashboard with total sessions, total questions, platform usage.

**Out of Scope:**
- Cohort/peer comparison analytics (v2.0 scope).
- Exportable PDF analytics reports.
- Real-time session monitoring.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-18-01 | Candidate Performance Dashboard | Backend Dev / Android Dev | P0 | Approved |
| FT-18-02 | Admin Telemetry Dashboard | Backend Dev / React Dev | P1 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-14 AI Evaluation (Evaluation reports as data source)
- MOD-09 Interview Session (Session history)
- PostgreSQL (Aggregation queries)
- MOD-01 Authentication (Role-based dashboard access)

### Depended Upon By
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
| DASH-001 | No evaluation history found | 404 |
| DASH-002 | Dashboard data aggregation timeout | 503 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Candidate Dashboard | US-003 | FR-012 | API-18-01 | TC-18-01 | KPI-007 |
| Admin Dashboard | US-010 | FR-013 | API-18-02 | TC-18-02 | KPI-007 |
