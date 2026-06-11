# Module Overview: MOD-02 — User Profile

## 1. Module Summary

### Purpose
Manages the candidate's personal profile data including registration details, preferences, and account lifecycle (active, suspended, deleted). Also manages admin user accounts created by the Super Admin.

### Responsibilities
- Candidate self-service profile view and update.
- Admin user creation, update, and deactivation by Super Admin.
- Account deletion cascade (GDPR Right to be Forgotten).
- Role assignment enforcement.

### Scope Boundaries
**In Scope:**
- Candidate profile CRUD (name, email, phone).
- Admin account management (Super Admin only).
- Account soft-delete and hard-delete cascade.
- Role retrieval from JWT for UI personalization.

**Out of Scope:**
- Profile photo upload.
- Social media profile import.
- Candidate CV/Resume management.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-02-01 | Candidate Profile Management | Backend Dev | P1 | Approved |
| FT-02-02 | Admin User Management | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-01 Authentication (JWT identity for profile lookup)
- PostgreSQL (User record persistence)

### Depended Upon By
- MOD-09 Interview Configuration (candidateId for session)
- MOD-18 Dashboard (candidateId for analytics)
- MOD-22 Audit Logs (actor identity)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-001 | Login Latency | < 1s | `auth_login_duration` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| PROF-001 | User not found | 404 |
| PROF-002 | Email already registered | 409 |
| PROF-003 | Unauthorized profile access | 403 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Candidate Profile | US-013 | FR-016 | API-02-01 | TC-02-01 | KPI-001 |
| Admin User Mgmt | US-014 | FR-017 | API-02-02 | TC-02-02 | KPI-001 |
