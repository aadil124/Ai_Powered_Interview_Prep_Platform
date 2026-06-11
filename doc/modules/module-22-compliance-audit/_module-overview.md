# Module Overview: MOD-22 — Compliance & Audit

## 1. Module Summary

### Purpose
Ensures the platform maintains an immutable, tamper-evident audit trail for all sensitive administrative and system actions, satisfying GDPR/CCPA compliance requirements and supporting security incident investigation.

### Responsibilities
- Capture audit events for all CRUD operations on sensitive entities.
- Record actor identity (userId, role), action type, timestamp, and affected resource.
- Enforce data retention and deletion cascade on account removal (Right to be Forgotten).
- Expose audit log query API for Super Admin access.

### Scope Boundaries
**In Scope:**
- Audit logging for: User management, Department CRUD, Bulk ingestion, Evaluation overrides, Config changes.
- GDPR-compliant account deletion cascade.
- Audit log retrieval for Super Admins.

**Out of Scope:**
- End-to-end request/response body logging.
- Log forwarding to external SIEM (v2.0).

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-22-01 | Audit Logging | Backend Dev | P0 | Approved |
| FT-22-02 | GDPR Account Deletion | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-01 Authentication (Actor identity from JWT)
- PostgreSQL (Immutable audit log table)
- Spring AOP (Intercept annotated service methods)

### Depended Upon By
- MOD-23 Admin Portal (Audit log display)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-012 | Audit Log Write Success | 100% | `audit_log_success` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| AUD-001 | Audit log write failure (non-blocking) | 500 (logged only) |
| AUD-002 | Deletion cascade incomplete | 500 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Audit Logging | US-011 | FR-014 | API-22-01 | TC-22-01 | KPI-012 |
| GDPR Deletion | US-012 | FR-015 | API-22-02 | TC-22-02 | KPI-012 |
