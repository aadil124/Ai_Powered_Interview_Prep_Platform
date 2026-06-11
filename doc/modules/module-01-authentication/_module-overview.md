# Module Overview: MOD-01 — Authentication

## 1. Module Summary

### Purpose
Provides secure identity verification and access token management for all system users including Candidates, Content Admins, and Super Admins. Acts as the system entry point and security boundary.

### Responsibilities
- Candidate OTP-based login and onboarding.
- Admin credential validation and JWT issuance.
- Access token lifecycle management (issue, refresh, revoke).
- Role resolution and RBAC enforcement at token level.

### Scope Boundaries
**In Scope:**
- OTP request and verification for Candidates.
- JWT access token + refresh token issuance.
- JWT rotation and invalidation.
- Role-based access enforcement (Super Admin, Content Admin, Candidate).

**Out of Scope:**
- Social OAuth login (Google, GitHub).
- SSO / SAML Enterprise federation.
- Two-factor hardware token (TOTP/FIDO2).

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-01-01 | OTP Login (Candidate) | Backend Dev | P0 | Approved |
| FT-01-02 | Admin Credential Login | Backend Dev | P0 | Approved |
| FT-01-03 | JWT Token Management | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- Redis (OTP TTL storage, rate limit counters)
- PostgreSQL (User record lookup)
- SMS/Email Provider (OTP dispatch)

### Depended Upon By
- MOD-02 User Profile
- MOD-09 Interview Configuration
- MOD-23 Admin Portal (all authenticated routes)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-001 | Login Latency | < 1s | `auth_login_duration` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| AUTH-001 | OTP expired or invalid | 401 |
| AUTH-002 | JWT token missing or malformed | 401 |
| AUTH-003 | JWT token expired | 401 |
| AUTH-004 | Insufficient role for resource | 403 |
| AUTH-005 | Too many OTP requests | 429 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| OTP Login | US-004 | FR-005 | API-01-01 | TC-01-01 | KPI-001 |
| Admin Login | US-005 | FR-006 | API-01-02 | TC-01-02 | KPI-001 |
| JWT Token Mgmt | US-006 | FR-007 | API-01-03 | TC-01-03 | KPI-001 |
