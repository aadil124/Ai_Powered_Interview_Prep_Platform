# Feature: FT-22-01 — Audit Logging

Module: MOD-22 — Compliance & Audit

Status: Approved

---

## 1. Purpose & Scope

### Objective
Automatically intercept and record all sensitive administrative and system operations into an immutable, append-only audit log table, enabling traceability, incident investigation, and regulatory compliance (GDPR/CCPA).

### Business Value
An unbroken audit trail protects the platform against regulatory penalties and provides incident investigators with a precise sequence of events for any data breach or misuse scenario.

### In Scope
- Spring AOP aspect intercepts methods annotated with `@Auditable`.
- Captures: actor userId, role, action type, target resource type + ID, timestamp, status.
- Writes to immutable `audit_logs` PostgreSQL table (no UPDATE/DELETE on this table).
- Super Admin retrieval via paginated API endpoint.

### Out Of Scope
- Full request/response body capture.
- Real-time audit log streaming to SIEM.

---

## 2. User Story Traceability

| US-ID | Story | Acceptance Criteria |
|-------|-------|--------------------|
| US-011 | As a Super Admin, I want to view all sensitive system actions in an audit log, so that I can investigate security incidents. | Audit log API returns paginated records with actor, action, resource, and timestamp. All bulk ingestion, user management, and config changes are captured. |

---

## 3. Functional Requirement Traceability

| FR-ID | Requirement | Status |
|-------|------------|--------|
| FR-014 | System must capture audit events for all sensitive operations with actor identity, resource details, and timestamp. | Approved |

---

## 4. Inputs & Parameters

| Parameter | Type | Required | Validation Rules |
|-----------|------|----------|-----------------|
| actorId | UUID (from JWT) | Yes | Derived from authenticated token |
| actorRole | Enum | Yes | SUPER_ADMIN, CONTENT_ADMIN |
| actionType | Enum | Yes | CREATE, UPDATE, DELETE, LOGIN, BULK_INGEST |
| resourceType | String | Yes | e.g., DEPARTMENT, QUESTION, USER |
| resourceId | UUID | Yes | Target entity ID |

---

## 5. Outputs & Results

### Success Response
- **API Response:** 200 OK with paginated audit log records (Super Admin only).
- **UI Behavior:** Admin sees sortable table of audit events in the Admin Portal.
- **Events Triggered:** `audit_log_written` telemetry event per captured action.

### Failure Response
- **Validation Error:** N/A (audit is intercepted, not user-submitted).
- **Business Error:** 403 - Non-Super-Admin attempting to access audit logs.
- **System Error:** 500 AUD-001 - DB write failure (non-blocking; logged to SRE alert).

---

## 6. API Responsibilities

| API-ID | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| API-22-01 | GET | `/api/v1/admin/audit-logs` | Retrieve paginated audit log (Super Admin only) |

### Request Payload

```json
{}
```

### Response Payload

```json
{
  "page": 1,
  "pageSize": 20,
  "totalRecords": 342,
  "logs": [
    {
      "logId": "log-001",
      "actorId": "usr-admin-abc",
      "actorRole": "CONTENT_ADMIN",
      "actionType": "BULK_INGEST",
      "resourceType": "QUESTION",
      "resourceId": "task-abc-987",
      "timestamp": "2026-06-11T10:30:00Z",
      "status": "SUCCESS"
    }
  ]
}
```

---

## 7. Integration Boundaries

| Component | Dependency Type | Description |
|-----------|----------------|-------------|
| PostgreSQL | Database | Append-only `audit_logs` table |
| Spring AOP | Framework | `@Auditable` aspect for method interception |
| Spring Security | Auth | Super Admin role enforcement on retrieval endpoint |
| SLF4J + MDC | Logging | Structured log emission for SRE monitoring |

---

## 8. Error & Failure Scenarios

| Scenario | Detection | Handling | User Response |
|----------|-----------|----------|---------------|
| DB write failure on audit | JPA exception in AOP | Log to SRE alert (non-blocking); primary operation continues | System silently retries log write |
| Non-Super-Admin access | Spring Security | Return 403 | "Access denied. Audit logs are restricted to Super Admins." |
| Large audit log query timeout | Query > 3s | Return 503, prompt paginate | "Narrow your search range for faster results." |

---

## 9. Test Case References

| TC-ID | Description | Type | Priority |
|-------|-------------|------|----------|
| TC-22-01-01 | Bulk ingestion action creates audit log entry | Integration | P0 |
| TC-22-01-02 | Department deletion creates audit log entry | Integration | P0 |
| TC-22-01-03 | Non-Super-Admin returns 403 on audit log API | API | P0 |
| TC-22-01-04 | Audit log table has no UPDATE or DELETE grants | Security | P0 |
| TC-22-01-05 | Paginated audit log returns correct total count | API | P1 |

---

## 10. KPI References

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|----------|--------|----------------|
| KPI-012 | Audit Log Write Success | 100% | `audit_log_success` |

---

## 11. Ownership

| Area | Owner |
|------|-------|
| Product | Product Manager |
| Backend | Spring Boot Developer |
| Frontend | React Web Developer |
| QA | QA Engineer |
| DevOps | DevOps Engineer |

---

## 12. Verification Sources
- UAT
- Test Execution Report
- API Test Report
- Security Assessment
- KPI Dashboard
- Production Monitoring

---

## 13. Traceability Matrix

| Feature | User Story | FR | API | Test Case | KPI |
|---------|------------|-----|-----|-----------|-----|
| Audit Logging | US-011 | FR-014 | API-22-01 | TC-22-01-01 to TC-22-01-05 | KPI-012 |
