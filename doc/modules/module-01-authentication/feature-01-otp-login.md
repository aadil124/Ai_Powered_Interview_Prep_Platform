# Feature: FT-01-01 — OTP Login (Candidate)

Module: MOD-01 — Authentication

Status: Approved

---

## 1. Purpose & Scope

### Objective
Enable candidates to securely authenticate using a one-time password sent to their registered mobile/email, then receive a JWT access token to interact with all protected API endpoints.

### Business Value
Eliminates password-based authentication risks and ensures low-friction onboarding for candidates.

### In Scope
- OTP request endpoint triggered by phone/email.
- OTP validation endpoint issuing JWT + refresh token.
- Redis TTL enforcement on OTP validity.
- Rate limiting on OTP requests per IP.

### Out Of Scope
- OTP retry override by admin.
- Biometric fallback.

---

## 2. User Story Traceability

| US-ID | Story | Acceptance Criteria |
|-------|-------|--------------------|
| US-004 | As a Candidate, I want to receive an OTP so that I can log in securely without a password. | OTP arrives within 30 seconds; expires in 5 minutes; invalid after one successful use. |

---

## 3. Functional Requirement Traceability

| FR-ID | Requirement | Status |
|-------|------------|--------|
| FR-005 | System must generate a 6-digit OTP and deliver it via SMS/Email upon candidate request. | Approved |
| FR-006 | System must validate OTP within 5-minute TTL and issue JWT access + refresh token pair on success. | Approved |

---

## 4. Inputs & Parameters

| Parameter | Type | Required | Validation Rules |
|-----------|------|----------|-----------------|
| phoneOrEmail | String | Yes | Valid phone number or email format |
| otp | String | Yes (on verify) | 6-digit numeric string |

---

## 5. Outputs & Results

### Success Response
- **API Response:** 200 OK with `{ accessToken, refreshToken, expiresIn }`
- **UI Behavior:** Candidate is redirected to Interview Setup Screen.
- **Events Triggered:** `auth_login_success` telemetry event emitted.

### Failure Response
- **Validation Error:** 400 - `{ "error": "Invalid OTP format" }`
- **Business Error:** 401 - `{ "error": "OTP expired or already used" }`
- **System Error:** 500 - `{ "error": "OTP delivery service unavailable" }`

---

## 6. API Responsibilities

| API-ID | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| API-01-01a | POST | `/api/v1/auth/otp/request` | Request OTP dispatch |
| API-01-01b | POST | `/api/v1/auth/otp/verify` | Validate OTP and issue JWT |

### Request Payload (Verify OTP)

```json
{
  "phoneOrEmail": "candidate@example.com",
  "otp": "482910"
}
```

### Response Payload

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresIn": 900,
  "role": "CANDIDATE"
}
```

---

## 7. Integration Boundaries

| Component | Dependency Type | Description |
|-----------|----------------|-------------|
| Redis | Cache | Store OTP with 5-minute TTL; invalidate on use |
| PostgreSQL | Database | Look up user record by phone/email |
| SMS/Email Provider | External | Dispatch OTP to candidate |
| Spring Security | Framework | JWT filter chain validation |

---

## 8. Error & Failure Scenarios

| Scenario | Detection | Handling | User Response |
|----------|-----------|----------|---------------|
| OTP expired | TTL check in Redis | Return 401 AUTH-001 | "OTP has expired. Please request a new one." |
| OTP already used | Redis key deleted on use | Return 401 AUTH-001 | "OTP is no longer valid." |
| Too many requests | Rate limiter (Redis counter) | Return 429 AUTH-005 | "Too many attempts. Try again in 10 minutes." |
| SMS provider down | HTTP 5xx from provider | Log error, alert SRE | "Delivery failed. Please try email option." |

---

## 9. Test Case References

| TC-ID | Description | Type | Priority |
|-------|-------------|------|----------|
| TC-01-01-01 | Valid OTP issued and accepted within TTL | API | P0 |
| TC-01-01-02 | Expired OTP returns 401 | API | P0 |
| TC-01-01-03 | Rate limiting enforced after 5 requests | Integration | P1 |
| TC-01-01-04 | JWT and refresh token structure is valid | Unit | P0 |

---

## 10. KPI References

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|----------|--------|----------------|
| KPI-001 | Login Latency | < 1s | `auth_login_duration` |

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
- Security Assessment
- KPI Dashboard
- Production Monitoring

---

## 13. Traceability Matrix

| Feature | User Story | FR | API | Test Case | KPI |
|---------|------------|-----|-----|-----------|-----|
| OTP Login | US-004 | FR-005, FR-006 | API-01-01a, API-01-01b | TC-01-01-01 to TC-01-01-04 | KPI-001 |
