# Module Overview: MOD-23 — Admin Portal

## 1. Module Summary

### Purpose
Provides the React.js web-based administrative console for Content Admins and Super Admins — centralizing department management, bulk upload monitoring, user management, audit log review, and platform telemetry dashboards.

### Responsibilities
- Admin login and session management.
- Department and technology master data management UI.
- Bulk upload console with task progress monitoring.
- User management (Super Admin only).
- Audit log viewer (Super Admin only).
- Platform analytics telemetry dashboard.

### Scope Boundaries
**In Scope:** Admin login; department/tech/level CRUD UI; bulk upload console; user management; audit log viewer; analytics widgets.
**Out of Scope:** Mobile-responsive admin portal (desktop-first); candidate-facing features.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-23-01 | Admin Dashboard & Navigation | React Dev | P0 | Approved |
| FT-23-02 | Content Management Console | React Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-01 Authentication (Admin JWT)
- MOD-03 Department Management (API)
- MOD-07 Bulk Upload (API)
- MOD-20 Analytics (API)
- MOD-22 Audit Logs (API)
- MOD-02 User Profile (Admin user management API)

### Depended Upon By
- None (terminal UI layer)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-010 | Config Update Sync Time | < 1s | `config_sync_latency` |
| KPI-007 | Dashboard Load Time | < 2s | `dashboard_render_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| ADM-001 | Unauthorized admin access | 403 |
| ADM-002 | Admin session expired | 401 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Admin Dashboard | US-010 | FR-013 | API-23-01 | TC-23-01 | KPI-007 |
| Content Console | US-001 | FR-001 | API-23-02 | TC-23-02 | KPI-010 |
