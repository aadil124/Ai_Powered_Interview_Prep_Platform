# Feature: FT-02-01 — Candidate Profile Management

Module: MOD-02 — User Profile

Status: Approved

---

## 1. Purpose & Scope

### Objective
Allow authenticated candidates to view and update their personal profile information, and enable Super Admins to manage the full user roster including account deactivation and deletion cascades.

### Business Value
Accurate candidate identity data enables personalized analytics, session history attribution, and GDPR-compliant account lifecycle management.

### In Scope
- GET own profile (by JWT identity).
- PUT update name, email, phone.
- DELETE account with cascade to sessions, answers, audio, evaluation reports.

### Out Of Scope
- Profile image upload.
- Password-based profile recovery.

---

## 2. User Story Traceability

| US-ID | Story | Acceptance Criteria |
|-------|-------|--------------------|
| US-013 | As a Candidate, I want to view and update my profile, so that my personal information stays current. | Profile loads within 1s. Update reflects immediately. Account deletion cascades within 5s. |

---

## 3. Functional Requirement Traceability

| FR-ID | Requirement | Status |
|-------|------------|--------|
| FR-016 | System must allow candidates to retrieve and update their own profile data via JWT-authenticated REST endpoints. | Approved |
| FR-015 | Account deletion must cascade immediately to all PII, sessions, audio files, and evaluation records. | Approved |

---

## 4. Inputs & Parameters

| Parameter | Type | Required | Validation Rules |
|-----------|------|----------|-----------------|
| name | String | No | Min 2, Max 100 chars |
| email | String | No | Valid email format; unique |
| phone | String | No | Valid international phone format |

---

## 5. Outputs & Results

### Success Response
- **API Response:** 200 OK with updated profile object.
- **UI Behavior:** Android profile screen refreshes with saved data.
- **Events Triggered:** `profile_updated` telemetry event.

### Failure Response
- **Validation Error:** 400 - Invalid email format.
- **Business Error:** 409 PROF-002 - Email already in use.
- **System Error:** 500 - DB write failure.

---

## 6. API Responsibilities

| API-ID | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| API-02-01a | GET | `/api/v1/candidates/profile` | Get own profile |
| API-02-01b | PUT | `/api/v1/candidates/profile` | Update own profile |
| API-02-01c | DELETE | `/api/v1/candidates/profile` | Delete account (GDPR cascade) |

### Request Payload (PUT)

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210"
}
```

### Response Payload

```json
{
  "id": "cand-abc-123",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "role": "CANDIDATE",
  "updatedAt": "2026-06-11T12:00:00Z"
}
```

---

## 7. Integration Boundaries

| Component | Dependency Type | Description |
|-----------|----------------|-------------|
| PostgreSQL | Database | Read/write user record |
| S3 / File Storage | External | Delete audio files on account deletion |
| Spring Security | Auth | JWT identity extraction for profile scoping |
| MOD-22 Audit Logs | Internal | Log DELETE action |

---

## 8. Error & Failure Scenarios

| Scenario | Detection | Handling | User Response |
|----------|-----------|----------|---------------|
| Duplicate email on update | DB unique constraint | Return 409 PROF-002 | "This email is already registered to another account." |
| Cascade delete partial failure | TX rollback | Return 500 AUD-002, alert SRE | "Account deletion failed. Our team has been notified." |
| Unauthorized profile access (wrong candidateId) | JWT sub vs resource owner check | Return 403 PROF-003 | "Access denied." |

---

## 9. Test Case References

| TC-ID | Description | Type | Priority |
|-------|-------------|------|----------|
| TC-02-01-01 | GET profile returns correct candidate data | API | P0 |
| TC-02-01-02 | PUT updates name and email successfully | API | P0 |
| TC-02-01-03 | DELETE cascades sessions, answers, audio | Integration | P0 |
| TC-02-01-04 | Duplicate email returns 409 | API | P1 |

---

## 10. KPI References

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|----------|--------|----------------|
| KPI-001 | Login Latency (proxy for profile load) | < 1s | `auth_login_duration` |

---

## 11. Ownership

| Area | Owner |
|------|-------|
| Product | Product Manager |
| Backend | Spring Boot Developer |
| Frontend | Android Developer |
| QA | QA Engineer |
| DevOps | DevOps Engineer |

---

## 12. Verification Sources
- UAT
- Test Execution Report
- API Test Report
- Security Assessment (GDPR cascade)
- KPI Dashboard
- Production Monitoring

---

## 13. Traceability Matrix

| Feature | User Story | FR | API | Test Case | KPI |
|---------|------------|-----|-----|-----------|-----|
| Candidate Profile | US-013 | FR-015, FR-016 | API-02-01a/b/c | TC-02-01-01 to TC-02-01-04 | KPI-001 |
