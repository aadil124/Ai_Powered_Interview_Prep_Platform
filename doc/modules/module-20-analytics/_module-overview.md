# Module Overview: MOD-20 — Analytics

## 1. Module Summary

### Purpose
Provides platform-wide and candidate-level aggregated analytics metrics powering the admin telemetry dashboard — including total sessions, completion rates, voice adoption rates, and question bank growth over time.

### Responsibilities
- Aggregate platform metrics (total sessions, completion rates, voice adoption).
- Serve time-series analytics data for admin dashboards.
- Expose candidate trend analytics for individual progress tracking.

### Scope Boundaries
**In Scope:** Platform aggregate metrics; time-series session data; voice vs. text ratio; ingestion volume.
**Out of Scope:** Real-time streaming analytics; cohort A/B testing.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-20-01 | Platform Analytics Aggregation | Backend Dev | P1 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-10 Interview Session (session event data)
- MOD-17 Reporting (evaluation history)
- PostgreSQL (aggregate queries)
- Redis (cache analytics results)

### Depended Upon By
- MOD-18 Dashboard
- MOD-23 Admin Portal

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-007 | Dashboard Load Time | < 2s | `dashboard_render_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| ANLX-001 | Analytics query timeout | 503 |
| ANLX-002 | No data available for time range | 404 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Platform Analytics | US-010 | FR-013 | API-20-01 | TC-20-01 | KPI-007 |
