# API Schema & Design — Complete Module Reference
**Project:** AI-Powered Interview Preparation and Assessment Platform
**Base Path:** `/api/v1`
**Version:** 1.0.0
**Date:** 2026-06-11

---

# MOD-01 — Authentication

**Base Path:** `/api/v1/auth`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-01-01 | OTP Login (Candidate) | 2 | POST `/auth/otp/request`, POST `/auth/otp/verify` |
| FT-01-02 | JWT Token Management | 2 | POST `/auth/token/refresh`, POST `/auth/logout` |

---

# Feature: FT-01-01 — OTP Login (Candidate)

---

## API: POST /api/v1/auth/otp/request

### Traceability
- **Module:** MOD-01 — Authentication
- **Feature:** FT-01-01 — OTP Login
- **User Story:** US-004
- **Functional Requirement:** FR-005

### Purpose
Dispatch a 6-digit OTP to the candidate's registered phone or email for authentication.

### Authentication
Public — No JWT required.

### Authorization
None — open endpoint with rate limiting.

### Request Schema
```json
{
  "phoneOrEmail": "string | registered phone or email | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| phoneOrEmail | Required; valid email format OR valid E.164 international phone format |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully.",
    "expiresInSeconds": 300
  },
  "error": null,
  "meta": {
    "requestId": "uuid-v4-string",
    "timestamp": "2026-06-11T12:00:00Z"
  }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 400,
    "title": "Validation Error",
    "detail": "Invalid phone or email format.",
    "instance": "/api/v1/auth/otp/request",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": { "phoneOrEmail": "Must be a valid email or phone number" }
  }
}
```

### Business Rules
- OTP is 6 digits, numeric only, generated server-side via SecureRandom.
- OTP stored in Redis with 5-minute TTL; overwritten on re-request.
- Maximum 5 OTP requests per phone/email per 10-minute window.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid phone/email format |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | OTP delivery service unavailable |

### Security
- Public endpoint; rate limited to 5 requests per 10 minutes per identity.
- Input sanitization on phoneOrEmail field.
- OTP value never returned in response.

### Performance SLA
- P95 < 300ms (excluding SMS/email provider latency)
- Error rate < 1%

### Telemetry / Monitoring
```text
event_name: api_auth_otp_requested
fields:
  - request_id
  - identity_hash (hashed, not raw)
  - latency_ms
  - status
  - error_code (if applicable)
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-01-01-01 | Valid email — OTP dispatched | 200 OK with expiresInSeconds |
| TC-01-01-02 | Valid phone — OTP dispatched | 200 OK |
| TC-01-01-03 | Invalid email format | 400 with field error |
| TC-01-01-04 | 6th request within 10 minutes | 429 rate limit error |

---

## API: POST /api/v1/auth/otp/verify

### Traceability
- **Module:** MOD-01 — Authentication
- **Feature:** FT-01-01 — OTP Login
- **User Story:** US-004
- **Functional Requirement:** FR-006

### Purpose
Verify candidate OTP and issue a JWT access + refresh token pair.

### Authentication
Public — No JWT required.

### Authorization
None — returns CANDIDATE-scoped JWT on success.

### Request Schema
```json
{
  "phoneOrEmail": "string | registered identity | required",
  "otp": "string | 6-digit numeric OTP | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| phoneOrEmail | Required; valid email or phone |
| otp | Required; exactly 6 numeric digits |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "expiresIn": 900,
    "tokenType": "Bearer",
    "role": "CANDIDATE"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 401,
    "title": "Authentication Failed",
    "detail": "OTP is expired or invalid.",
    "instance": "/api/v1/auth/otp/verify",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": {}
  }
}
```

### Business Rules
- OTP valid for 5 minutes; single-use; invalidated immediately on first successful verify.
- On success, Redis key for OTP deleted; JWT pair issued with candidateId as `sub` claim.
- Access token TTL: 15 minutes. Refresh token TTL: 7 days.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | OTP expired or invalid |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Security
- Public; rate limited to 10 verify attempts per phone/email per 10 minutes.
- OTP brute force protection via Redis counter.

### Performance SLA
- P95 < 300ms
- Error rate < 1%

### Telemetry / Monitoring
```text
event_name: auth_login_duration
fields:
  - user_id
  - request_id
  - latency_ms
  - status
  - error_code (if applicable)
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-01-01-05 | Valid OTP within TTL | 200 with accessToken + refreshToken |
| TC-01-01-06 | Expired OTP | 401 |
| TC-01-01-07 | Already used OTP (replay) | 401 |
| TC-01-01-08 | Wrong OTP | 401 |

---

# Feature: FT-01-02 — JWT Token Management

---

## API: POST /api/v1/auth/token/refresh

### Traceability
- **Module:** MOD-01 — Authentication
- **Feature:** FT-01-02 — JWT Token Management
- **User Story:** US-006
- **Functional Requirement:** FR-007

### Purpose
Exchange a valid refresh token for a new rotated JWT access + refresh token pair.

### Authentication
No access token required; refresh token required in request body.

### Authorization
All authenticated roles.

### Request Schema
```json
{
  "refreshToken": "string | valid non-expired refresh JWT | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| refreshToken | Required; non-empty; must be valid JWT structure |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "bmV3UmVmcmVzaFRva2Vu...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 401,
    "title": "Token Expired",
    "detail": "Refresh token is expired or has been revoked.",
    "instance": "/api/v1/auth/token/refresh",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": {}
  }
}
```

### Business Rules
- Old refresh token is immediately invalidated upon use (rotation).
- If refresh token is in Redis blacklist, return 401.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Malformed token |
| 401 | Refresh token expired or revoked |
| 500 | Internal Server Error |

### Security
- Refresh token stored hash verified against PostgreSQL record.
- Rotated; old token blacklisted in Redis immediately.

### Performance SLA
- P95 < 300ms
- Error rate < 1%

### Telemetry / Monitoring
```text
event_name: token_refreshed
fields: [user_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-01-02-01 | Valid refresh token | 200 with new token pair |
| TC-01-02-02 | Expired refresh token | 401 |
| TC-01-02-03 | Reuse of rotated (old) token | 401 |
| TC-01-02-04 | Malformed JWT string | 400 |

---

## API: POST /api/v1/auth/logout

### Traceability
- **Module:** MOD-01 — Authentication
- **Feature:** FT-01-02 — JWT Token Management
- **User Story:** US-006
- **Functional Requirement:** FR-008

### Purpose
Revoke the current refresh token and terminate the active session.

### Authentication
JWT Required.

### Authorization
All authenticated roles (CANDIDATE, CONTENT_ADMIN, SUPER_ADMIN).

### Request Schema
```json
{
  "refreshToken": "string | refresh token to revoke | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| refreshToken | Required |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "message": "Logged out successfully." },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 401,
    "title": "Unauthorized",
    "detail": "Authentication token is missing or expired.",
    "instance": "/api/v1/auth/logout",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": {}
  }
}
```

### Business Rules
- Refresh token is added to Redis blacklist with remaining TTL.
- Access token remains valid until natural expiry (15 min).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 500 | Internal Server Error |

### Security
- JWT required; refresh token blacklisted in Redis on logout.
- Audit log emitted for SUPER_ADMIN and CONTENT_ADMIN logouts.

### Performance SLA
- P95 < 200ms
- Error rate < 1%

### Telemetry / Monitoring
```text
event_name: auth_logout
fields: [user_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-01-02-05 | Valid JWT + refresh token | 200 OK |
| TC-01-02-06 | Missing Authorization header | 401 |
| TC-01-02-07 | Token reuse after logout | 401 |

---

# MOD-02 — User Profile

**Base Path:** `/api/v1/candidates`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-02-01 | Candidate Profile Management | 3 | GET `/candidates/profile`, PUT `/candidates/profile`, DELETE `/candidates/profile` |

---

# Feature: FT-02-01 — Candidate Profile Management

---

## API: GET /api/v1/candidates/profile

### Traceability
- **Module:** MOD-02 — User Profile
- **Feature:** FT-02-01 — Candidate Profile Management
- **User Story:** US-013
- **Functional Requirement:** FR-016

### Purpose
Retrieve the authenticated candidate's own profile information.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own profile only (candidateId extracted from JWT `sub` claim).

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| JWT sub claim | Must match a valid candidate record in the database |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "id": "cand-abc-123",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+919876543210",
    "role": "CANDIDATE",
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-06-11T12:00:00Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 404,
    "title": "Not Found",
    "detail": "Candidate profile not found.",
    "instance": "/api/v1/candidates/profile",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": {}
  }
}
```

### Business Rules
- CandidateId is always resolved from JWT `sub` claim — never from request body or path param.
- Response excludes internal database columns (password hash, audit fields).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 404 | Profile not found |
| 500 | Internal Server Error |

### Security
- JWT required; candidateId resolved from token only.
- Rate limiting: 60 req/min per candidate.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: profile_viewed
fields: [user_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-02-01-01 | Valid JWT — own profile | 200 with profile data |
| TC-02-01-02 | No JWT | 401 |
| TC-02-01-03 | Valid JWT but profile deleted | 404 |

---

## API: PUT /api/v1/candidates/profile

### Traceability
- **Module:** MOD-02 — User Profile
- **Feature:** FT-02-01 — Candidate Profile Management
- **User Story:** US-013
- **Functional Requirement:** FR-016

### Purpose
Update the authenticated candidate's own profile fields (name, email, phone).

### Authentication
JWT Required.

### Authorization
CANDIDATE — own profile only.

### Request Schema
```json
{
  "name": "string | full name | optional | min 2, max 100 chars",
  "email": "string | email address | optional | valid format, unique",
  "phone": "string | phone number | optional | E.164 format"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| name | Optional; min 2, max 100 chars if provided |
| email | Optional; valid email format; must be unique across all users |
| phone | Optional; valid E.164 international phone format |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "id": "cand-abc-123",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+919876543210",
    "updatedAt": "2026-06-11T12:30:00Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:30:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 409,
    "title": "Conflict",
    "detail": "Email is already registered to another account.",
    "instance": "/api/v1/candidates/profile",
    "timestamp": "2026-06-11T12:30:00Z",
    "errors": { "email": "Email already in use" }
  }
}
```

### Business Rules
- At least one field must be present in the request body.
- Email uniqueness is enforced platform-wide (candidates + admins).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error — invalid field format |
| 401 | JWT missing or expired |
| 409 | Duplicate email |
| 500 | Internal Server Error |

### Security
- JWT required; profile scoped to token identity.
- Input sanitization on all string fields.
- Audit log emitted on email change.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: profile_updated
fields: [user_id, fields_changed, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-02-01-04 | Update name only | 200 with updated profile |
| TC-02-01-05 | Duplicate email | 409 |
| TC-02-01-06 | Invalid phone format | 400 |
| TC-02-01-07 | Empty body | 400 |

---

## API: DELETE /api/v1/candidates/profile

### Traceability
- **Module:** MOD-02 — User Profile
- **Feature:** FT-02-01 — Candidate Profile Management
- **User Story:** US-012 (GDPR Right to be Forgotten)
- **Functional Requirement:** FR-015

### Purpose
Permanently delete the candidate account and cascade-remove all PII, sessions, answers, audio files, and evaluation records.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own account only.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| JWT sub | Must match existing active candidate record |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "message": "Account deleted successfully. All data has been removed." },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 500,
    "title": "Deletion Failed",
    "detail": "Account deletion encountered an error. Support has been notified.",
    "instance": "/api/v1/candidates/profile",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": {}
  }
}
```

### Business Rules
- Deletion cascades: interview_sessions → answers → audio_files (S3) → evaluation_reports → feedback_records.
- Operation is wrapped in a DB transaction; S3 deletions are async post-commit.
- Audit log records the deletion event before cascade executes.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 500 | Cascade deletion failure |

### Security
- JWT required; candidateId from token only.
- Audit log written prior to deletion (GDPR compliance evidence).

### Performance SLA
- P95 < 2s (cascade operation)

### Telemetry / Monitoring
```text
event_name: account_deleted
fields: [user_id, request_id, latency_ms, status, cascade_success]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-02-01-08 | Valid delete | 200 OK |
| TC-02-01-09 | Sessions, answers, audio removed | Cascade verified via DB check |
| TC-02-01-10 | No JWT | 401 |

---

# MOD-03 — Department Management

**Base Path:** `/api/v1/admin/departments`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-03-01 | Department CRUD | 4 | POST `/admin/departments`, GET `/admin/departments`, PUT `/admin/departments/{id}`, DELETE `/admin/departments/{id}` |

---

# Feature: FT-03-01 — Department Management

---

## API: POST /api/v1/admin/departments

### Traceability
- **Module:** MOD-03 — Department Management
- **Feature:** FT-03-01 — Department CRUD
- **User Story:** US-007
- **Functional Requirement:** FR-009

### Purpose
Create a new department with an associated subdomain label for content organization.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "name": "string | department name | required | min 3, max 100, unique",
  "subdomain": "string | subdomain name | required | min 3, max 100",
  "description": "string | optional | max 500 chars"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| name | Required; min 3, max 100; unique across departments |
| subdomain | Required; min 3, max 100 |
| description | Optional; max 500 chars |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "id": "dept-a1b2c3",
    "name": "Mobile Development",
    "subdomain": "Android Development",
    "description": "Questions covering Android SDK, Jetpack, and Kotlin.",
    "createdAt": "2026-06-11T12:00:00Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 409,
    "title": "Conflict",
    "detail": "A department with this name already exists.",
    "instance": "/api/v1/admin/departments",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": { "name": "Department name must be unique" }
  }
}
```

### Business Rules
- Department names must be globally unique (case-insensitive comparison).
- Creating a department also syncs a metadata_sync event to Elasticsearch.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 409 | Duplicate department name |
| 500 | Internal Server Error |

### Security
- JWT required; CONTENT_ADMIN or SUPER_ADMIN role enforced.
- Audit log emitted on creation.
- Rate limiting: 30 req/min per admin.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: department_created
fields: [user_id, department_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-03-01-01 | Valid creation | 201 with department object |
| TC-03-01-02 | Duplicate name | 409 |
| TC-03-01-03 | Missing name field | 400 |
| TC-03-01-04 | CANDIDATE role attempt | 403 |

---

## API: GET /api/v1/admin/departments

### Traceability
- **Module:** MOD-03 — Department Management
- **Feature:** FT-03-01 — Department CRUD
- **User Story:** US-007
- **Functional Requirement:** FR-009

### Purpose
Retrieve a paginated list of all departments and their subdomains.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "page": "integer | optional | default 1",
  "limit": "integer | optional | default 20 | max 100"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| page | Optional; min 1 |
| limit | Optional; min 1, max 100 |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "departments": [
      { "id": "dept-a1b2c3", "name": "Mobile Development", "subdomain": "Android Development", "createdAt": "2026-06-11T12:00:00Z" }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 401, "title": "Unauthorized", "detail": "JWT missing or expired.", "instance": "/api/v1/admin/departments", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Results ordered by `createdAt` descending by default.
- Redis caches the full department list for 60 seconds.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 500 | Internal Server Error |

### Security
- JWT required; role checked.
- Rate limiting: 60 req/min.

### Performance SLA
- P95 < 300ms (cache-served)

### Telemetry / Monitoring
```text
event_name: metadata_sync_success
fields: [user_id, request_id, latency_ms, status, result_count]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-03-01-05 | List departments — results exist | 200 with paginated list |
| TC-03-01-06 | No departments yet | 200 with empty array |
| TC-03-01-07 | CANDIDATE role | 403 |

---

## API: PUT /api/v1/admin/departments/{id}

### Traceability
- **Module:** MOD-03 — Department Management
- **Feature:** FT-03-01 — Department CRUD
- **User Story:** US-007
- **Functional Requirement:** FR-009

### Purpose
Update an existing department's name, subdomain, or description.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "name": "string | optional | min 3, max 100, unique",
  "subdomain": "string | optional | min 3, max 100",
  "description": "string | optional | max 500"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| id (path) | Valid UUID; must exist |
| name | Optional; unique if provided |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "id": "dept-a1b2c3", "name": "Mobile Dev Updated", "subdomain": "Android", "updatedAt": "2026-06-11T13:00:00Z" },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T13:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Department not found.", "instance": "/api/v1/admin/departments/dept-xxx", "timestamp": "2026-06-11T13:00:00Z", "errors": {} }
}
```

### Business Rules
- At least one field must be present.
- Name uniqueness re-validated if name is changed.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 404 | Department not found |
| 409 | Duplicate name |
| 500 | Internal Server Error |

### Security
- JWT required; audit log on update.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: department_updated
fields: [user_id, department_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-03-01-08 | Valid update | 200 with updated dept |
| TC-03-01-09 | Department not found | 404 |
| TC-03-01-10 | Duplicate name | 409 |

---

## API: DELETE /api/v1/admin/departments/{id}

### Traceability
- **Module:** MOD-03 — Department Management
- **Feature:** FT-03-01 — Department CRUD
- **User Story:** US-007
- **Functional Requirement:** FR-009

### Purpose
Delete a department and cascade subdomain removal. Restricted to SUPER_ADMIN.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| id (path) | Valid UUID; must exist |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "message": "Department deleted successfully." },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Department not found.", "instance": "/api/v1/admin/departments/dept-xxx", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Hard delete; subdomain records cascade.
- Associated Elasticsearch entries purged on deletion.
- Audit log written before delete.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Insufficient role (not SUPER_ADMIN) |
| 404 | Department not found |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. Audit log mandatory.

### Performance SLA
- P95 < 500ms

### Telemetry / Monitoring
```text
event_name: department_deleted
fields: [user_id, department_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-03-01-11 | SUPER_ADMIN deletes existing dept | 200 OK |
| TC-03-01-12 | CONTENT_ADMIN attempts delete | 403 |
| TC-03-01-13 | Department not found | 404 |

---

# MOD-04 — Technology Management

**Base Path:** `/api/v1/admin/technologies`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-04-01 | Technology Tag CRUD | 4 | POST, GET, PUT `/{id}`, DELETE `/{id}` |

> API design pattern identical to MOD-03 Department Management. Key differences: resource = `technologies`, field = `tag` (min 2, max 50 chars), no subdomain field. Error codes use prefix `TECH-`. KPI: KPI-002 `metadata_sync_success`.

---

# MOD-05 — Experience Level Management

**Base Path:** `/api/v1/admin/experience-levels`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-05-01 | Experience Level CRUD | 4 | POST, GET, PUT `/{id}`, DELETE `/{id}` |

> API design follows same CRUD pattern. Fields: `levelName` (JUNIOR/MID_LEVEL/SENIOR), `difficultyMin` (int 1-10), `difficultyMax` (int 1-10). GET is accessible by CANDIDATE role. Write operations restricted to SUPER_ADMIN. KPI: KPI-002 `metadata_sync_success`.

---

# MOD-06 — Question Repository

**Base Path:** `/api/v1/admin/questions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-06-01 | Question CRUD & Search | 4 | POST, GET, PUT `/{id}`, DELETE `/{id}` |

---

# Feature: FT-06-01 — Question CRUD & Search

---

## API: POST /api/v1/admin/questions

### Traceability
- **Module:** MOD-06 — Question Repository
- **Feature:** FT-06-01 — Question CRUD
- **User Story:** US-009
- **Functional Requirement:** FR-011

### Purpose
Manually create a single question entry in the repository.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "questionText": "string | the question | required | min 10, max 2000",
  "expectedAnswer": "string | model answer | required | min 10, max 5000",
  "departmentId": "string UUID | required",
  "subdomain": "string | required",
  "technologyId": "string UUID | optional",
  "experienceLevelId": "string UUID | required",
  "difficultyScore": "integer | 1-10 | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| questionText | Required; min 10, max 2000 |
| expectedAnswer | Required; min 10, max 5000 |
| departmentId | Required; must reference existing department |
| experienceLevelId | Required; must reference existing level |
| difficultyScore | Required; integer 1–10 |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "id": "q-uuid-001",
    "questionText": "Explain the difference between MVVM and Clean Architecture.",
    "departmentId": "dept-a1b2c3",
    "subdomain": "Android Development",
    "difficultyScore": 6,
    "createdAt": "2026-06-11T12:00:00Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 400, "title": "Validation Error", "detail": "Question text is required.", "instance": "/api/v1/admin/questions", "timestamp": "2026-06-11T12:00:00Z", "errors": { "questionText": "Must not be blank" } }
}
```

### Business Rules
- Question is also indexed into Elasticsearch on creation.
- Questions are active by default (`isActive: true`).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 404 | Referenced department/level not found |
| 500 | Internal Server Error |

### Security
- JWT required; audit log emitted.

### Performance SLA
- P95 < 500ms (includes ES indexing)

### Telemetry / Monitoring
```text
event_name: question_created
fields: [user_id, question_id, department_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-06-01-01 | Valid question creation | 201 with question object |
| TC-06-01-02 | Missing questionText | 400 |
| TC-06-01-03 | Invalid departmentId | 404 |

---

# MOD-07 — Bulk Upload

**Base Path:** `/api/v1/admin/questions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-07-01 | Document Upload Pipeline | 2 | POST `/admin/questions/ingest`, GET `/admin/questions/ingest/{taskId}` |

---

# Feature: FT-07-01 — Document Upload Pipeline

---

## API: POST /api/v1/admin/questions/ingest

### Traceability
- **Module:** MOD-07 — Bulk Upload
- **Feature:** FT-07-01 — Document Upload Pipeline
- **User Story:** US-001
- **Functional Requirement:** FR-001, FR-011

### Purpose
Trigger a background async bulk ingestion job for a previously uploaded document.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "departmentId": "string UUID | required",
  "subdomain": "string | required",
  "fileUrl": "string URL | pre-signed S3 URL | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| departmentId | Required; must reference existing department |
| subdomain | Required; min 3 chars |
| fileUrl | Required; valid HTTPS URL; file must be PDF/DOCX/TXT ≤ 50MB |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "taskId": "task-abc-987",
    "status": "PROCESSING",
    "message": "Bulk ingestion task initialized successfully."
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 413, "title": "Payload Too Large", "detail": "File size exceeds the 50MB limit.", "instance": "/api/v1/admin/questions/ingest", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Returns 202 Accepted immediately; processing is async via DocumentIngestionJob.
- File type validated before job dispatch (PDF/DOCX/TXT only).
- Max file size: 50MB. Files above limit rejected at validation.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error — unsupported file format |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 413 | File exceeds 50MB |
| 500 | Internal Server Error |

### Security
- JWT required; CONTENT_ADMIN or SUPER_ADMIN.
- Rate limiting: 5 ingestion requests per hour per admin.
- Audit log on ingestion trigger.

### Performance SLA
- POST response: P95 < 300ms (async; actual processing < 15s)

### Telemetry / Monitoring
```text
event_name: bulk_ingestion_seconds
fields: [user_id, task_id, department_id, file_size_bytes, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-07-01-01 | Valid DOCX ingest trigger | 202 with taskId |
| TC-07-01-02 | File > 50MB | 413 |
| TC-07-01-03 | Unsupported file type (CSV) | 400 |
| TC-07-01-04 | Invalid departmentId | 404 |

---

## API: GET /api/v1/admin/questions/ingest/{taskId}

### Traceability
- **Module:** MOD-07 — Bulk Upload
- **Feature:** FT-07-01 — Document Upload Pipeline
- **User Story:** US-001
- **Functional Requirement:** FR-001

### Purpose
Poll the status and progress of an active or completed ingestion task.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| taskId (path) | Required; valid task UUID |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "taskId": "task-abc-987",
    "status": "COMPLETED",
    "progress": 100,
    "questionsExtracted": 47,
    "questionsIndexed": 47,
    "completedAt": "2026-06-11T12:00:12Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:15Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Ingestion task not found.", "instance": "/api/v1/admin/questions/ingest/task-xxx", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Status values: `PROCESSING`, `COMPLETED`, `FAILED`.
- Failed tasks include `failureReason` field in data.
- Poll interval recommended: every 2 seconds.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 404 | Task not found |
| 500 | Internal Server Error |

### Security
- JWT required.

### Performance SLA
- P95 < 200ms (read-only DB query)

### Telemetry / Monitoring
```text
event_name: bulk_ingestion_success
fields: [task_id, questions_extracted, questions_indexed, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-07-01-05 | Poll PROCESSING task | 200 with status PROCESSING |
| TC-07-01-06 | Poll COMPLETED task | 200 with questionsExtracted count |
| TC-07-01-07 | Invalid taskId | 404 |

---

# MOD-08 — Categorization Engine

**Base Path:** `/api/v1/admin/questions/ingest`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-08-01 | Q&A Extraction Results | 1 | GET `/admin/questions/ingest/{taskId}/results` |

---

## API: GET /api/v1/admin/questions/ingest/{taskId}/results

### Traceability
- **Module:** MOD-08 — Categorization Engine
- **Feature:** FT-08-01 — Question Extraction & Indexing
- **User Story:** US-001
- **Functional Requirement:** FR-001

### Purpose
Retrieve the structured list of Q&A pairs extracted and indexed from a completed ingestion task.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| taskId (path) | Required; valid UUID; task must be in COMPLETED status |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "taskId": "task-abc-987",
    "totalExtracted": 47,
    "questions": [
      {
        "questionId": "q-uuid-001",
        "questionText": "Explain the difference between MVVM and Clean Architecture.",
        "expectedAnswer": "MVVM separates UI from business logic...",
        "subdomain": "Android Development",
        "difficultyScore": 6
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 47, "totalPages": 3 }
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Task not found or not yet completed.", "instance": "/api/v1/admin/questions/ingest/task-xxx/results", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Only accessible for COMPLETED tasks; returns 404 for PROCESSING or FAILED.
- Results are paginated; default page size 20.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 404 | Task not found or not completed |
| 500 | Internal Server Error |

### Security
- JWT required.

### Performance SLA
- P95 < 500ms

### Telemetry / Monitoring
```text
event_name: bulk_ingestion_results_viewed
fields: [user_id, task_id, request_id, latency_ms, result_count]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-08-01-01 | Completed task — results returned | 200 with question list |
| TC-08-01-02 | PROCESSING task — results requested | 404 |
| TC-08-01-03 | Invalid taskId | 404 |

---

# MOD-09 — Interview Configuration

**Base Path:** `/api/v1/interviews/configuration`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-09-01 | Interview Configuration Setup | 1 | GET `/interviews/configuration/options` |

---

## API: GET /api/v1/interviews/configuration/options

### Traceability
- **Module:** MOD-09 — Interview Configuration
- **Feature:** FT-09-01 — Interview Configuration Setup
- **User Story:** US-002
- **Functional Requirement:** FR-002

### Purpose
Serve available departments, experience levels, and technologies for the candidate session setup screen.

### Authentication
JWT Required.

### Authorization
CANDIDATE.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| — | No request body; options derived from master data |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "departments": [
      { "id": "dept-a1b2c3", "name": "Mobile Development", "subdomains": ["Android Development", "iOS Development"] }
    ],
    "experienceLevels": [
      { "id": "lvl-001", "name": "JUNIOR", "difficultyMin": 1, "difficultyMax": 4 },
      { "id": "lvl-002", "name": "MID_LEVEL", "difficultyMin": 5, "difficultyMax": 7 },
      { "id": "lvl-003", "name": "SENIOR", "difficultyMin": 8, "difficultyMax": 10 }
    ],
    "technologies": [
      { "id": "tech-001", "name": "Kotlin" }
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 401, "title": "Unauthorized", "detail": "JWT missing or expired.", "instance": "/api/v1/interviews/configuration/options", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Response is Redis-cached (TTL: 60 seconds) — changes to master data propagate after cache expiry.
- Only active departments/levels returned.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 500 | Internal Server Error |

### Security
- JWT required; CANDIDATE role.

### Performance SLA
- P95 < 200ms (Redis-cached)

### Telemetry / Monitoring
```text
event_name: session_init_latency
fields: [user_id, request_id, latency_ms, status, cache_hit]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-09-01-01 | Valid candidate JWT | 200 with config options |
| TC-09-01-02 | No JWT | 401 |
| TC-09-01-03 | Second request within 60s — cache served | 200, latency < 50ms |

---

# MOD-10 — Interview Session

**Base Path:** `/api/v1/interviews/sessions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-10-01 | Session Lifecycle Management | 2 | POST `/interviews/sessions`, POST `/interviews/sessions/{id}/complete` |
| FT-10-02 | Answer Submission | 1 | POST `/interviews/sessions/{id}/answers` |

---

## API: POST /api/v1/interviews/sessions

### Traceability
- **Module:** MOD-10 — Interview Session
- **Feature:** FT-10-01 — Session Lifecycle Management
- **User Story:** US-002
- **Functional Requirement:** FR-002

### Purpose
Initialize a new mock interview session with randomized questions based on candidate-selected parameters.

### Authentication
JWT Required.

### Authorization
CANDIDATE.

### Request Schema
```json
{
  "departmentId": "string UUID | required",
  "experienceLevelId": "string UUID | required",
  "questionCount": "integer | required | min 1, max 20",
  "inputMode": "enum | required | TEXT or VOICE"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| departmentId | Required; must exist |
| experienceLevelId | Required; must exist |
| questionCount | Required; 1–20 |
| inputMode | Required; TEXT or VOICE |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "sessionId": "session-xyz-456",
    "status": "INITIALIZED",
    "questions": [
      { "questionId": "q-001", "text": "Explain the difference between MVVM and Clean Architecture in Android." },
      { "questionId": "q-002", "text": "What is the purpose of Hilt in Kotlin-based development?" }
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "No questions available for the selected criteria.", "instance": "/api/v1/interviews/sessions", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Questions are randomized; no duplicates within a single session.
- Session persisted with status INITIALIZED; transitions to IN_PROGRESS on first answer.
- If Elasticsearch unavailable, falls back to PostgreSQL random query.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 404 | No questions for selected criteria |
| 409 | Candidate already has an active session |
| 500 | Internal Server Error |

### Security
- JWT required; candidateId extracted from token.

### Performance SLA
- P95 < 2s (KPI-004 target)

### Telemetry / Monitoring
```text
event_name: session_init_latency
fields: [user_id, session_id, department_id, question_count, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-10-01-01 | Valid initialization | 201 with sessionId and questions |
| TC-10-01-02 | questionCount = 0 | 400 |
| TC-10-01-03 | No questions available | 404 |
| TC-10-01-04 | Init completes in < 2s | P95 < 2000ms |

---

## API: POST /api/v1/interviews/sessions/{sessionId}/answers

### Traceability
- **Module:** MOD-10 — Interview Session
- **Feature:** FT-10-02 — Answer Submission
- **User Story:** US-002
- **Functional Requirement:** FR-003

### Purpose
Submit a candidate's answer (text or audio with transcription) for a specific question within the active session.

### Authentication
JWT Required.

### Authorization
CANDIDATE — session must belong to the authenticated candidate.

### Request Schema
```json
{
  "questionId": "string UUID | required",
  "responseType": "enum | required | TEXT or AUDIO",
  "transcribedText": "string | required if responseType=TEXT; optional if AUDIO | max 5000 chars",
  "audioUrl": "string URL | required if responseType=AUDIO | valid S3 pre-signed URL"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| questionId | Required; must belong to current session |
| responseType | Required; TEXT or AUDIO |
| transcribedText | Required if TEXT; optional edit if AUDIO |
| audioUrl | Required if AUDIO; valid HTTPS URL |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "answerId": "ans-999", "sessionId": "session-xyz-456", "status": "SAVED" },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 409, "title": "Conflict", "detail": "Answer submitted after session was closed.", "instance": "/api/v1/interviews/sessions/session-xyz-456/answers", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Each questionId can only be answered once per session; re-submission returns 409.
- Session status transitions to IN_PROGRESS on first answer.
- Answers are cached locally in Room DB for offline resume.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 403 | Session does not belong to candidate |
| 404 | Session or question not found |
| 409 | Session closed or answer already submitted |
| 500 | Internal Server Error |

### Security
- JWT required; session ownership verified.
- Audio URL validated as S3 domain before persistence.

### Performance SLA
- P95 < 1s

### Telemetry / Monitoring
```text
event_name: mock_answer_submitted
fields: [user_id, session_id, question_id, response_type, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-10-02-01 | Valid TEXT answer | 200 with answerId |
| TC-10-02-02 | Valid AUDIO answer with URL | 200 |
| TC-10-02-03 | AUDIO without audioUrl | 400 |
| TC-10-02-04 | Answer after session closed | 409 |
| TC-10-02-05 | Duplicate answer for same question | 409 |

---

## API: POST /api/v1/interviews/sessions/{sessionId}/complete

### Traceability
- **Module:** MOD-10 — Interview Session
- **Feature:** FT-10-01 — Session Lifecycle Management
- **User Story:** US-002, US-003
- **Functional Requirement:** FR-004

### Purpose
Mark the session as COMPLETED and trigger the async EvaluationProcessingJob.

### Authentication
JWT Required.

### Authorization
CANDIDATE — must own session.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| sessionId (path) | Valid UUID; session must be IN_PROGRESS |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "sessionId": "session-xyz-456", "status": "COMPLETED", "evaluationStatus": "PROCESSING" },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:05:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 409, "title": "Conflict", "detail": "Session is already completed.", "instance": "/api/v1/interviews/sessions/session-xyz-456/complete", "timestamp": "2026-06-11T12:05:00Z", "errors": {} }
}
```

### Business Rules
- Session status must be IN_PROGRESS; INITIALIZED or COMPLETED sessions return 409.
- EvaluationProcessingJob dispatched asynchronously via Redis queue.
- Candidate is notified via push (FCM) when evaluation is ready.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Session does not belong to candidate |
| 404 | Session not found |
| 409 | Session already completed |
| 500 | Internal Server Error |

### Security
- JWT required; session ownership verified.

### Performance SLA
- P95 < 500ms (async dispatch)

### Telemetry / Monitoring
```text
event_name: interview_session_completed
fields: [user_id, session_id, question_count, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-10-01-05 | Complete IN_PROGRESS session | 200 with status COMPLETED |
| TC-10-01-06 | Complete COMPLETED session | 409 |
| TC-10-01-07 | Complete INITIALIZED session (no answers) | 409 |

---

# MOD-11 — Question Delivery

**Base Path:** `/api/v1/interviews/sessions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-11-01 | Randomized Question Delivery | 1 | GET `/interviews/sessions/{id}/questions` |

---

## API: GET /api/v1/interviews/sessions/{sessionId}/questions

### Traceability
- **Module:** MOD-11 — Question Delivery
- **Feature:** FT-11-01 — Randomized Question Delivery
- **User Story:** US-002
- **Functional Requirement:** FR-002

### Purpose
Retrieve the ordered list of questions assigned to the active session.

### Authentication
JWT Required.

### Authorization
CANDIDATE — session must belong to authenticated candidate.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| sessionId (path) | Valid UUID; candidate must own the session |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "sessionId": "session-xyz-456",
    "totalQuestions": 5,
    "answeredCount": 2,
    "questions": [
      { "questionId": "q-001", "text": "Explain MVVM vs Clean Architecture.", "answered": true },
      { "questionId": "q-002", "text": "What is Hilt?", "answered": false }
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Session not found.", "instance": "/api/v1/interviews/sessions/session-xyz-456/questions", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Expected answer is never returned to the candidate — only question text.
- `answered` flag allows Android to track resume state.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Session does not belong to candidate |
| 404 | Session not found |
| 500 | Internal Server Error |

### Security
- JWT required; session scoped to candidate.
- expectedAnswer field excluded from response at serialization level.

### Performance SLA
- P95 < 300ms (KPI-011: < 2s)

### Telemetry / Monitoring
```text
event_name: search_query_latency
fields: [user_id, session_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-11-01-01 | Valid session — questions returned | 200 with question list |
| TC-11-01-02 | Session not found | 404 |
| TC-11-01-03 | expectedAnswer not in response | Verified via schema inspection |

---

# MOD-12 — Voice Recording

**Base Path:** `/api/v1/media`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-12-01 | Audio Capture & Upload | 1 | POST `/media/audio/upload-url` |

---

## API: POST /api/v1/media/audio/upload-url

### Traceability
- **Module:** MOD-12 — Voice Recording
- **Feature:** FT-12-01 — Audio Capture & Upload
- **User Story:** US-002
- **Functional Requirement:** FR-003

### Purpose
Generate a pre-signed S3 upload URL for the candidate's audio response file.

### Authentication
JWT Required.

### Authorization
CANDIDATE.

### Request Schema
```json
{
  "sessionId": "string UUID | required",
  "questionId": "string UUID | required",
  "fileExtension": "string | required | wav or m4a",
  "fileSizeBytes": "integer | required | max 15000000 (15MB)"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| sessionId | Required; must belong to candidate |
| questionId | Required; must belong to session |
| fileExtension | Required; wav or m4a only |
| fileSizeBytes | Required; max 15MB |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/platform-audio/2026/06/response_q001.wav?X-Amz-Signature=...",
    "fileKey": "audio/2026/06/session-xyz-456/q-001.wav",
    "expiresInSeconds": 300
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 400, "title": "Validation Error", "detail": "Unsupported file extension. Only wav and m4a are accepted.", "instance": "/api/v1/media/audio/upload-url", "timestamp": "2026-06-11T12:00:00Z", "errors": { "fileExtension": "Must be wav or m4a" } }
}
```

### Business Rules
- Pre-signed URL valid for 5 minutes; single-use.
- Audio file key scoped to session and question to prevent cross-contamination.
- File size capped at 15MB (120-second audio in WAV format).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Unsupported extension or size exceeded |
| 401 | JWT missing or expired |
| 403 | Session not owned by candidate |
| 500 | S3 pre-signed URL generation failure |

### Security
- JWT required; file key scoped to authenticated candidateId.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: whisper_stt_seconds
fields: [user_id, session_id, question_id, file_key, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-12-01-01 | Valid WAV upload URL request | 200 with pre-signed URL |
| TC-12-01-02 | Unsupported extension (MP3) | 400 |
| TC-12-01-03 | File size > 15MB | 400 |
| TC-12-01-04 | Expired URL used for upload | S3 returns 403 |

---

# MOD-13 — Speech-To-Text

**Base Path:** `/api/v1/media`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-13-01 | Whisper STT Integration | 1 | POST `/media/audio/transcribe` |

---

## API: POST /api/v1/media/audio/transcribe

### Traceability
- **Module:** MOD-13 — Speech-To-Text
- **Feature:** FT-13-01 — Whisper STT Integration
- **User Story:** US-002
- **Functional Requirement:** FR-003

### Purpose
Submit an audio file URL for Whisper API transcription and receive the resulting text.

### Authentication
JWT Required.

### Authorization
CANDIDATE.

### Request Schema
```json
{
  "audioUrl": "string URL | required | S3 pre-signed or public URL of uploaded audio",
  "sessionId": "string UUID | required",
  "questionId": "string UUID | required"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| audioUrl | Required; valid HTTPS URL; must be on platform S3 domain |
| sessionId | Required; must be active session owned by candidate |
| questionId | Required; must belong to session |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "transcribedText": "MVVM separates the UI logic from the business logic using a ViewModel...",
    "wordErrorRate": 0.04,
    "duration_seconds": 28
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 503, "title": "Service Unavailable", "detail": "Whisper STT service timeout. Please type your response.", "instance": "/api/v1/media/audio/transcribe", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Whisper API call must complete within 10 seconds; otherwise return 503 with fallback guidance.
- WER (word error rate) logged but not exposed to candidate in production.
- 3 automatic retries with 1-second backoff on timeout.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid audio URL |
| 401 | JWT missing or expired |
| 503 | Whisper API timeout |
| 500 | Internal Server Error |

### Security
- Audio URL must match platform S3 bucket domain; arbitrary URLs rejected.

### Performance SLA
- P95 < 3s (KPI-005 target)

### Telemetry / Monitoring
```text
event_name: whisper_stt_seconds
fields: [user_id, session_id, question_id, duration_seconds, latency_ms, status, wer]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-13-01-01 | Valid 30s audio URL | 200 with transcribed text |
| TC-13-01-02 | Whisper timeout | 503 with fallback message |
| TC-13-01-03 | External (non-S3) audio URL | 400 |
| TC-13-01-04 | Transcription < 3s (perf) | P95 < 3000ms |

---

# MOD-14 — AI Evaluation

**Base Path:** `/api/v1/interviews/sessions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-14-01 | AI Evaluation Engine | 1 | GET `/interviews/sessions/{id}/evaluation` |

---

## API: GET /api/v1/interviews/sessions/{sessionId}/evaluation

### Traceability
- **Module:** MOD-14 — AI Evaluation
- **Feature:** FT-14-01 — AI Evaluation Engine
- **User Story:** US-003
- **Functional Requirement:** FR-004

### Purpose
Retrieve the AI-generated evaluation report for a completed mock interview session.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own session only.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| sessionId (path) | Valid UUID; must be in COMPLETED status; must belong to candidate |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "sessionId": "session-xyz-456",
    "evaluationStatus": "COMPLETED",
    "overallScore": 82,
    "criteriaScores": {
      "technicalAccuracy": 85,
      "communicationClarity": 78,
      "conceptualDepth": 83
    },
    "feedback": {
      "strengths": ["Demonstrated good knowledge of boundary separation in Clean Architecture."],
      "weaknesses": ["Could improve explanation of LiveData/StateFlow data bindings in MVVM."],
      "actionableRecommendations": ["Review state restoration practices and lifecycle-aware coroutines flows."]
    },
    "completedAt": "2026-06-11T12:05:08Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:05:10Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 202, "title": "Accepted", "detail": "Evaluation is still processing. Please retry in a few seconds.", "instance": "/api/v1/interviews/sessions/session-xyz-456/evaluation", "timestamp": "2026-06-11T12:05:02Z", "errors": {} }
}
```

### Business Rules
- Returns 202 if evaluation is still PROCESSING.
- Evaluation is triggered by session completion and processed asynchronously by EvaluationProcessingJob.
- LLM used for evaluation is configurable via MOD-26 AI Prompt Management.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 202 | Evaluation still processing |
| 401 | JWT missing or expired |
| 403 | Session does not belong to candidate |
| 404 | Session or evaluation not found |
| 500 | Internal Server Error |

### Security
- JWT required; session ownership enforced.

### Performance SLA
- Evaluation background job: P95 < 10s (KPI-006)
- GET response: P95 < 300ms

### Telemetry / Monitoring
```text
event_name: ai_eval_latency
fields: [user_id, session_id, overall_score, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-14-01-01 | COMPLETED session — evaluation ready | 200 with full report |
| TC-14-01-02 | Session still PROCESSING | 202 |
| TC-14-01-03 | Session not owned by candidate | 403 |
| TC-14-01-04 | Evaluation available < 10s after completion | KPI-006 verified |

---

# MOD-15 — Scoring Engine

**Base Path:** `/api/v1/interviews/sessions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-15-01 | Score Calculation & Persistence | 1 | GET `/interviews/sessions/{id}/scores` |

---

## API: GET /api/v1/interviews/sessions/{sessionId}/scores

### Traceability
- **Module:** MOD-15 — Scoring Engine
- **Feature:** FT-15-01 — Score Calculation & Persistence
- **User Story:** US-003
- **Functional Requirement:** FR-004

### Purpose
Retrieve per-criteria and overall numeric scores for a completed evaluated session.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own session only.

### Request Schema
```json
{}
```

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "sessionId": "session-xyz-456",
    "overallScore": 82,
    "maxScore": 100,
    "criteriaScores": [
      { "criterion": "technicalAccuracy", "score": 85, "weight": 0.5 },
      { "criterion": "communicationClarity", "score": 78, "weight": 0.3 },
      { "criterion": "conceptualDepth", "score": 83, "weight": 0.2 }
    ],
    "perQuestionScores": [
      { "questionId": "q-001", "score": 84 },
      { "questionId": "q-002", "score": 80 }
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:05:15Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Score record not found. Evaluation may still be processing.", "instance": "/api/v1/interviews/sessions/session-xyz-456/scores", "timestamp": "2026-06-11T12:05:15Z", "errors": {} }
}
```

### Business Rules
- Score record persisted by EvaluationProcessingJob; not available during PROCESSING.
- Overall score = weighted sum of criteria scores.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Insufficient access |
| 404 | Score not found |
| 500 | Internal Server Error |

### Security
- JWT required; session ownership enforced.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: ai_eval_latency
fields: [user_id, session_id, overall_score, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-15-01-01 | Evaluation complete — scores returned | 200 with score breakdown |
| TC-15-01-02 | Evaluation still processing | 404 |
| TC-15-01-03 | Wrong candidate | 403 |

---

# MOD-16 — Feedback Engine

**Base Path:** `/api/v1/interviews/sessions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-16-01 | Feedback Generation & Persistence | 1 | GET `/interviews/sessions/{id}/feedback` |

---

## API: GET /api/v1/interviews/sessions/{sessionId}/feedback

### Traceability
- **Module:** MOD-16 — Feedback Engine
- **Feature:** FT-16-01 — Feedback Generation & Persistence
- **User Story:** US-003
- **Functional Requirement:** FR-004

### Purpose
Retrieve qualitative feedback — strengths, weaknesses, and actionable study recommendations — for a completed evaluated session.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own session only.

### Request Schema
```json
{}
```

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "sessionId": "session-xyz-456",
    "strengths": [
      "Demonstrated good knowledge of boundary separation in Clean Architecture.",
      "Clear understanding of Hilt dependency injection scopes."
    ],
    "weaknesses": [
      "Could improve explanation of LiveData vs StateFlow.",
      "Incomplete understanding of Coroutine exception handling."
    ],
    "actionableRecommendations": [
      "Review lifecycle-aware coroutines in Android documentation.",
      "Practice explaining StateFlow vs SharedFlow use cases."
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:05:20Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Feedback record not found.", "instance": "/api/v1/interviews/sessions/session-xyz-456/feedback", "timestamp": "2026-06-11T12:05:20Z", "errors": {} }
}
```

### Business Rules
- Feedback generated alongside scoring by EvaluationProcessingJob.
- Min 1 strength, 1 weakness, and 1 recommendation guaranteed in response.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Insufficient access |
| 404 | Feedback not found |
| 500 | Internal Server Error |

### Security
- JWT required; session ownership enforced.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: ai_eval_latency
fields: [user_id, session_id, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-16-01-01 | Feedback available | 200 with strengths/weaknesses |
| TC-16-01-02 | Evaluation not done | 404 |
| TC-16-01-03 | Min 1 item in each category | Verified in response schema |

---

# MOD-17 — Reporting

**Base Path:** `/api/v1/candidates/reports`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-17-01 | Session Report Generation | 2 | GET `/candidates/reports`, GET `/candidates/reports/{sessionId}` |

---

## API: GET /api/v1/candidates/reports

### Traceability
- **Module:** MOD-17 — Reporting
- **Feature:** FT-17-01 — Session Report Generation
- **User Story:** US-003
- **Functional Requirement:** FR-012

### Purpose
Retrieve a paginated list of all past mock interview session reports for the authenticated candidate.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own reports only.

### Request Schema
```json
{
  "page": "integer | optional | default 1",
  "limit": "integer | optional | default 10 | max 50",
  "departmentId": "string UUID | optional | filter by department",
  "dateFrom": "ISO-8601 date | optional",
  "dateTo": "ISO-8601 date | optional"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| page | Optional; min 1 |
| limit | Optional; 1–50 |
| dateFrom | Optional; must be before dateTo |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "reports": [
      { "sessionId": "session-xyz-456", "department": "Mobile Development", "overallScore": 82, "completedAt": "2026-06-11T12:05:08Z" }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 7, "totalPages": 1 }
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "No reports found for this candidate.", "instance": "/api/v1/candidates/reports", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Results ordered by `completedAt` descending.
- Redis caches response per candidateId for 30 seconds.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid date range |
| 401 | JWT missing or expired |
| 404 | No reports found |
| 500 | Internal Server Error |

### Security
- JWT required; candidateId from token.

### Performance SLA
- P95 < 2s (KPI-007)

### Telemetry / Monitoring
```text
event_name: dashboard_render_latency
fields: [user_id, request_id, result_count, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-17-01-01 | Reports exist | 200 with list |
| TC-17-01-02 | No reports | 404 |
| TC-17-01-03 | Filter by departmentId | 200 with filtered list |
| TC-17-01-04 | dateFrom > dateTo | 400 |

---

# MOD-18 — Dashboard

**Base Path:** `/api/v1/candidates`, `/api/v1/admin`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-18-01 | Candidate Performance Dashboard | 1 | GET `/candidates/dashboard` |
| FT-18-02 | Admin Telemetry Dashboard | 1 | GET `/admin/dashboard` |

---

## API: GET /api/v1/candidates/dashboard

### Traceability
- **Module:** MOD-18 — Dashboard
- **Feature:** FT-18-01 — Candidate Performance Dashboard
- **User Story:** US-003
- **Functional Requirement:** FR-012

### Purpose
Retrieve aggregated performance analytics for the authenticated candidate — score trends, subdomain breakdowns, and top strengths/weaknesses.

### Authentication
JWT Required.

### Authorization
CANDIDATE — own data only.

### Request Schema
```json
{
  "dateFrom": "ISO-8601 | optional",
  "dateTo": "ISO-8601 | optional",
  "departmentId": "string UUID | optional"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| dateFrom | Optional; must be before dateTo |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "candidateId": "cand-abc-123",
    "totalSessions": 7,
    "averageScore": 76,
    "scoreTrend": [
      { "date": "2026-05-10", "score": 68 },
      { "date": "2026-06-01", "score": 82 }
    ],
    "subdomainBreakdown": {
      "Android Development": { "averageScore": 84, "sessionsCount": 4 },
      "Backend Development": { "averageScore": 71, "sessionsCount": 3 }
    },
    "topStrengths": ["Clean Architecture boundary knowledge"],
    "topWeaknesses": ["LiveData vs StateFlow distinction"]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "No session history found.", "instance": "/api/v1/candidates/dashboard", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Minimum 1 completed session required to populate dashboard.
- Redis-cached per candidateId (TTL: 60 seconds).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid date range |
| 401 | JWT missing or expired |
| 404 | No session history |
| 503 | DB aggregation timeout |
| 500 | Internal Server Error |

### Security
- JWT required; candidateId from token.

### Performance SLA
- P95 < 2s (KPI-007)

### Telemetry / Monitoring
```text
event_name: dashboard_render_latency
fields: [user_id, request_id, session_count, latency_ms, status, cache_hit]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-18-01-01 | Candidate with history | 200 with analytics |
| TC-18-01-02 | No sessions yet | 404 |
| TC-18-01-03 | Dashboard loads < 2s | P95 < 2000ms |

---

# MOD-19 — Recommendation Engine

**Base Path:** `/api/v1/candidates`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-19-01 | Personalized Recommendations | 1 | GET `/candidates/recommendations` |

---

## API: GET /api/v1/candidates/recommendations

### Traceability
- **Module:** MOD-19 — Recommendation Engine
- **Feature:** FT-19-01 — Personalized Recommendations
- **User Story:** US-003
- **Functional Requirement:** FR-020

### Purpose
Return personalized study topic recommendations based on the candidate's weakest subdomain performance across all evaluated sessions.

### Authentication
JWT Required.

### Authorization
CANDIDATE.

### Request Schema
```json
{}
```

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "recommendations": [
      { "rank": 1, "subdomain": "Android Development", "weakTopics": ["LiveData vs StateFlow", "Coroutine exception handling"], "studySuggestion": "Review official Android Coroutines guide." },
      { "rank": 2, "subdomain": "Backend Development", "weakTopics": ["Spring Security filter chain"], "studySuggestion": "Review Spring Security documentation Chapter 5." }
    ],
    "basedOnSessions": 7,
    "generatedAt": "2026-06-11T12:00:00Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Insufficient session history for recommendations.", "instance": "/api/v1/candidates/recommendations", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Minimum 2 completed sessions required for recommendations.
- Recommendations cached per candidateId (TTL: 5 minutes).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 404 | Insufficient history |
| 503 | Generation timeout |
| 500 | Internal Server Error |

### Security
- JWT required; candidateId from token.

### Performance SLA
- P95 < 3s (KPI-008)

### Telemetry / Monitoring
```text
event_name: recommendation_gen_seconds
fields: [user_id, request_id, sessions_analyzed, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-19-01-01 | Candidate with 2+ sessions | 200 with ranked recommendations |
| TC-19-01-02 | Only 1 session | 404 |
| TC-19-01-03 | Response within 3s | P95 < 3000ms |

---

# MOD-20 — Analytics

**Base Path:** `/api/v1/admin/analytics`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-20-01 | Platform Analytics Aggregation | 2 | GET `/admin/analytics/platform`, GET `/admin/analytics/content` |

---

## API: GET /api/v1/admin/analytics/platform

### Traceability
- **Module:** MOD-20 — Analytics
- **Feature:** FT-20-01 — Platform Analytics
- **User Story:** US-010
- **Functional Requirement:** FR-013

### Purpose
Retrieve platform-wide usage metrics — total sessions, completion rates, voice adoption, and daily active users.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN.

### Request Schema
```json
{
  "dateFrom": "ISO-8601 | optional | default: 30 days ago",
  "dateTo": "ISO-8601 | optional | default: today"
}
```

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "totalSessions": 1248,
    "completedSessions": 1072,
    "completionRate": 85.9,
    "voiceAdoptionRate": 63.2,
    "dailyActiveCandidates": 87,
    "avgSessionDurationMinutes": 22,
    "timeSeries": [
      { "date": "2026-06-10", "sessions": 43, "completions": 38 }
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 403, "title": "Forbidden", "detail": "Access restricted to Super Admins.", "instance": "/api/v1/admin/analytics/platform", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Results cached in Redis per date range (TTL: 120 seconds).
- Date range max span: 90 days.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid date range |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 500 | Internal Server Error |

### Security
- JWT required; SUPER_ADMIN only.

### Performance SLA
- P95 < 2s (KPI-007)

### Telemetry / Monitoring
```text
event_name: dashboard_render_latency
fields: [user_id, request_id, latency_ms, status, date_range_days]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-20-01-01 | SUPER_ADMIN — valid request | 200 with metrics |
| TC-20-01-02 | CONTENT_ADMIN attempts access | 403 |
| TC-20-01-03 | Date range > 90 days | 400 |

---

# MOD-21 — Notifications

**Base Path:** `/api/v1/notifications`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-21-01 | Push Notification Dispatch | 1 | POST `/notifications/register-device` |

---

## API: POST /api/v1/notifications/register-device

### Traceability
- **Module:** MOD-21 — Notifications
- **Feature:** FT-21-01 — Push Notification Dispatch
- **User Story:** US-017
- **Functional Requirement:** FR-021

### Purpose
Register or update the candidate's FCM device token for push notification delivery.

### Authentication
JWT Required.

### Authorization
CANDIDATE.

### Request Schema
```json
{
  "fcmToken": "string | Firebase Cloud Messaging device token | required",
  "devicePlatform": "string | required | ANDROID"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| fcmToken | Required; non-empty; valid FCM token format |
| devicePlatform | Required; ANDROID only (v1) |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "message": "Device registered successfully for notifications." },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 400, "title": "Validation Error", "detail": "Invalid FCM token.", "instance": "/api/v1/notifications/register-device", "timestamp": "2026-06-11T12:00:00Z", "errors": { "fcmToken": "Token format invalid" } }
}
```

### Business Rules
- If token already exists for candidate, overwrite with latest token (idempotent).
- Each candidate supports max 3 registered device tokens.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid FCM token |
| 401 | JWT missing or expired |
| 500 | Internal Server Error |

### Security
- JWT required; token scoped to candidateId.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: notification_delivery_success
fields: [user_id, device_platform, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-21-01-01 | Valid FCM token registration | 200 OK |
| TC-21-01-02 | Re-register same candidate — overwrite | 200 OK (idempotent) |
| TC-21-01-03 | Empty FCM token | 400 |

---

# MOD-22 — Audit Logs

**Base Path:** `/api/v1/admin/audit-logs`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-22-01 | Audit Log Viewer | 2 | GET `/admin/audit-logs`, GET `/admin/audit-logs/{logId}` |

---

## API: GET /api/v1/admin/audit-logs

### Traceability
- **Module:** MOD-22 — Audit Logs
- **Feature:** FT-22-01 — Audit Logging
- **User Story:** US-011
- **Functional Requirement:** FR-014

### Purpose
Retrieve a paginated list of all audit log events for Super Admin review.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{
  "page": "integer | optional | default 1",
  "limit": "integer | optional | default 20 | max 100",
  "actorId": "string UUID | optional | filter by actor",
  "actionType": "string | optional | CREATE/UPDATE/DELETE/LOGIN/BULK_INGEST",
  "dateFrom": "ISO-8601 | optional",
  "dateTo": "ISO-8601 | optional"
}
```

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "logs": [
      { "logId": "log-001", "actorId": "usr-admin-abc", "actorRole": "CONTENT_ADMIN", "actionType": "BULK_INGEST", "resourceType": "QUESTION", "resourceId": "task-abc-987", "timestamp": "2026-06-11T10:30:00Z", "status": "SUCCESS" }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 342, "totalPages": 18 }
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 403, "title": "Forbidden", "detail": "Audit logs restricted to Super Admins.", "instance": "/api/v1/admin/audit-logs", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Audit log table is append-only; no UPDATE or DELETE granted at DB level.
- Date range max: 90 days per query.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Invalid filter parameters |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. No write endpoints exposed.

### Performance SLA
- P95 < 500ms

### Telemetry / Monitoring
```text
event_name: audit_log_success
fields: [user_id, request_id, result_count, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-22-01-01 | SUPER_ADMIN reads audit logs | 200 with paginated list |
| TC-22-01-02 | CONTENT_ADMIN attempts | 403 |
| TC-22-01-03 | Filter by actionType | 200 with filtered logs |

---

# MOD-23 — Admin Portal

**Base Path:** `/api/v1/auth`, `/api/v1/admin`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-23-01 | Admin Login | 1 | POST `/auth/admin/login` |
| FT-23-02 | User Management | 1 | GET `/admin/users` |

---

## API: POST /api/v1/auth/admin/login

### Traceability
- **Module:** MOD-23 — Admin Portal
- **Feature:** FT-23-01 — Admin Login
- **User Story:** US-005
- **Functional Requirement:** FR-006

### Purpose
Authenticate admin users (CONTENT_ADMIN, SUPER_ADMIN) via credentials and issue JWT token pair.

### Authentication
Public — No JWT required.

### Authorization
Returns CONTENT_ADMIN or SUPER_ADMIN-scoped JWT.

### Request Schema
```json
{
  "email": "string | admin email | required",
  "password": "string | admin password | required | min 8 chars"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| email | Required; valid email format |
| password | Required; min 8 chars |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "expiresIn": 900,
    "tokenType": "Bearer",
    "role": "CONTENT_ADMIN"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 401, "title": "Authentication Failed", "detail": "Invalid credentials.", "instance": "/api/v1/auth/admin/login", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Password verified against BCrypt hash stored in DB.
- 5 failed attempts locks account for 15 minutes (Redis counter).

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | Invalid credentials |
| 423 | Account locked (too many attempts) |
| 429 | Rate limit exceeded |
| 500 | Internal Server Error |

### Security
- Public; rate limited to 10 req/min per IP.
- Audit log emitted on successful admin login.
- Password never returned in any response.

### Performance SLA
- P95 < 500ms

### Telemetry / Monitoring
```text
event_name: auth_login_duration
fields: [user_id, role, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-23-01-01 | Valid admin credentials | 200 with JWT |
| TC-23-01-02 | Wrong password | 401 |
| TC-23-01-03 | 5 failed attempts | 423 account locked |

---

# MOD-24 — File Storage

**Base Path:** `/api/v1/files`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-24-01 | Pre-signed URL Management | 1 | POST `/files/upload-url` |
| FT-24-02 | File Deletion | 1 | DELETE `/files/{fileKey}` |

---

## API: POST /api/v1/files/upload-url

### Traceability
- **Module:** MOD-24 — File Storage
- **Feature:** FT-24-01 — Pre-signed URL Management
- **User Story:** US-001
- **Functional Requirement:** FR-011

### Purpose
Generate a pre-signed S3 upload URL for admin document uploads (PDF/DOCX/TXT).

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "fileName": "string | required | original file name with extension",
  "fileType": "string | required | application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, or text/plain",
  "fileSizeBytes": "integer | required | max 52428800 (50MB)"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| fileName | Required; .pdf, .docx, or .txt extension |
| fileType | Required; must be PDF, DOCX, or TXT MIME type |
| fileSizeBytes | Required; max 52,428,800 bytes (50MB) |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/platform-uploads/2026/06/qa_android.docx?X-Amz-Signature=...",
    "fileKey": "uploads/2026/06/qa_android.docx",
    "expiresInSeconds": 300
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 413, "title": "Payload Too Large", "detail": "File size exceeds the 50MB limit.", "instance": "/api/v1/files/upload-url", "timestamp": "2026-06-11T12:00:00Z", "errors": { "fileSizeBytes": "Max 50MB allowed" } }
}
```

### Business Rules
- URL expires in 5 minutes; upload must be completed within TTL.
- File metadata (key, owner, uploadedAt) stored in DB on presign generation.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Unsupported file type |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 413 | File too large |
| 500 | S3 URL generation failure |

### Security
- JWT required; file key scoped to admin identity.
- Rate limiting: 5 req/min for upload URL generation.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: bulk_ingestion_seconds
fields: [user_id, file_key, file_size_bytes, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-24-01-01 | Valid DOCX file | 200 with pre-signed URL |
| TC-24-01-02 | File > 50MB | 413 |
| TC-24-01-03 | Unsupported type (CSV) | 400 |

---

# MOD-25 — Search & Filtering

**Base Path:** `/api/v1/questions`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-25-01 | Question Indexing & Search | 2 | GET `/questions/search`, GET `/questions/filter` |

---

## API: GET /api/v1/questions/search

### Traceability
- **Module:** MOD-25 — Search & Filtering
- **Feature:** FT-25-01 — Question Search
- **User Story:** US-009
- **Functional Requirement:** FR-002

### Purpose
Full-text search across the Elasticsearch question index by keyword, with optional metadata filters.

### Authentication
JWT Required.

### Authorization
CONTENT_ADMIN, SUPER_ADMIN.

### Request Schema
```json
{
  "query": "string | required | search keyword | min 2 chars",
  "departmentId": "string UUID | optional",
  "subdomain": "string | optional",
  "technologyId": "string UUID | optional",
  "experienceLevelId": "string UUID | optional",
  "page": "integer | optional | default 1",
  "limit": "integer | optional | default 20"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| query | Required; min 2 chars |
| page | Optional; min 1 |
| limit | Optional; max 50 |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "results": [
      { "questionId": "q-uuid-001", "questionText": "Explain MVVM vs Clean Architecture.", "score": 1.85, "subdomain": "Android Development", "difficultyScore": 6 }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 503, "title": "Service Unavailable", "detail": "Search service temporarily unavailable.", "instance": "/api/v1/questions/search", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Elasticsearch full-text search with relevance scoring.
- Fallback to PostgreSQL ILIKE query if Elasticsearch unavailable.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Query too short |
| 401 | JWT missing or expired |
| 403 | Insufficient role |
| 503 | Elasticsearch unavailable |
| 500 | Internal Server Error |

### Security
- JWT required; admin roles only.

### Performance SLA
- P95 < 2s (KPI-011)

### Telemetry / Monitoring
```text
event_name: search_query_latency
fields: [user_id, query_length, result_count, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-25-01-01 | Valid keyword search | 200 with results |
| TC-25-01-02 | Single character query | 400 |
| TC-25-01-03 | Elasticsearch down — fallback | 200 via DB |
| TC-25-01-04 | Response < 2s | P95 < 2000ms |

---

# MOD-26 — AI Prompt Management

**Base Path:** `/api/v1/admin/ai/prompts`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-26-01 | Prompt Template Management | 4 | POST, GET, PUT `/{id}`, PUT `/{id}/activate` |

---

## API: POST /api/v1/admin/ai/prompts

### Traceability
- **Module:** MOD-26 — AI Prompt Management
- **Feature:** FT-26-01 — Prompt Template Management
- **User Story:** US-018
- **Functional Requirement:** FR-022

### Purpose
Create a new evaluation prompt template for a specific evaluation type.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{
  "evaluationType": "string | required | TECHNICAL_ACCURACY, COMMUNICATION_CLARITY, CONCEPTUAL_DEPTH, FULL_EVALUATION",
  "templateName": "string | required | min 3, max 100",
  "promptContent": "string | required | the LLM prompt template with {{answer}} placeholder",
  "version": "string | required | semver e.g. 1.0.0"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| evaluationType | Required; valid enum value |
| templateName | Required; min 3, max 100 |
| promptContent | Required; must contain `{{answer}}` placeholder; max 10000 chars |
| version | Required; valid semver format |

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "id": "prompt-uuid-001",
    "evaluationType": "FULL_EVALUATION",
    "templateName": "Default Full Evaluation v1",
    "version": "1.0.0",
    "isActive": false,
    "createdAt": "2026-06-11T12:00:00Z"
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 400, "title": "Validation Error", "detail": "promptContent must contain {{answer}} placeholder.", "instance": "/api/v1/admin/ai/prompts", "timestamp": "2026-06-11T12:00:00Z", "errors": { "promptContent": "Missing {{answer}} placeholder" } }
}
```

### Business Rules
- New prompts are inactive by default; must be explicitly activated via PUT `/{id}/activate`.
- Only one active prompt per evaluationType at any time.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. Audit log mandatory on creation.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: config_sync_latency
fields: [user_id, prompt_id, evaluation_type, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-26-01-01 | Valid prompt creation | 201 with isActive false |
| TC-26-01-02 | Missing {{answer}} placeholder | 400 |
| TC-26-01-03 | CONTENT_ADMIN attempt | 403 |

---

## API: PUT /api/v1/admin/ai/prompts/{id}/activate

### Traceability
- **Module:** MOD-26 — AI Prompt Management
- **Feature:** FT-26-01 — Prompt Template Management
- **User Story:** US-018
- **Functional Requirement:** FR-022

### Purpose
Set a prompt template as the active version for its evaluation type, deactivating any previously active prompt.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| id (path) | Valid UUID; must reference existing prompt |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "id": "prompt-uuid-001", "evaluationType": "FULL_EVALUATION", "isActive": true, "activatedAt": "2026-06-11T12:30:00Z" },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:30:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Prompt template not found.", "instance": "/api/v1/admin/ai/prompts/prompt-xxx/activate", "timestamp": "2026-06-11T12:30:00Z", "errors": {} }
}
```

### Business Rules
- Activating a prompt atomically deactivates the previously active prompt for the same evaluationType.
- Active prompt is cached in Redis (TTL: 60s); EvaluationProcessingJob reads from cache.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 404 | Prompt not found |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. Audit log on activation.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: config_sync_latency
fields: [user_id, prompt_id, evaluation_type, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-26-01-04 | Activate prompt | 200 with isActive true |
| TC-26-01-05 | Previous prompt deactivated | Verified via GET |
| TC-26-01-06 | Prompt not found | 404 |

---

# MOD-27 — Configuration Management

**Base Path:** `/api/v1/admin/config`, `/api/v1/admin/feature-flags`

## Module → Feature → API Map

| Feature ID | Feature Name | API Count | Endpoints |
| :--- | :--- | :---: | :--- |
| FT-27-01 | System Configuration CRUD | 2 | GET `/admin/config`, PUT `/admin/config/{key}` |
| FT-27-02 | Feature Flag Management | 2 | GET `/admin/feature-flags`, PUT `/admin/feature-flags/{flag}` |

---

## API: GET /api/v1/admin/config

### Traceability
- **Module:** MOD-27 — Configuration Management
- **Feature:** FT-27-01 — System Configuration CRUD
- **User Story:** US-019
- **Functional Requirement:** FR-023

### Purpose
List all system configuration keys and their current values.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{}
```

### Response Schema — Success
```json
{
  "success": true,
  "data": {
    "configs": [
      { "key": "RATE_LIMIT_PER_MINUTE", "value": "100", "type": "INTEGER", "updatedAt": "2026-06-11T10:00:00Z" },
      { "key": "MAX_UPLOAD_SIZE_MB", "value": "50", "type": "INTEGER", "updatedAt": "2026-06-11T10:00:00Z" },
      { "key": "AI_PROVIDER", "value": "OPENAI", "type": "STRING", "updatedAt": "2026-06-11T10:00:00Z" }
    ]
  },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:00:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 403, "title": "Forbidden", "detail": "Access restricted to Super Admins.", "instance": "/api/v1/admin/config", "timestamp": "2026-06-11T12:00:00Z", "errors": {} }
}
```

### Business Rules
- Config values are Redis-cached (TTL: 60s).
- Secret config keys (API keys) have values masked as `***` in response.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. Secret values masked.

### Performance SLA
- P95 < 200ms (Redis-cached)

### Telemetry / Monitoring
```text
event_name: config_sync_latency
fields: [user_id, request_id, config_count, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-27-01-01 | SUPER_ADMIN reads config | 200 with config list |
| TC-27-01-02 | CONTENT_ADMIN attempts | 403 |
| TC-27-01-03 | Secret keys are masked | Verified: value = *** |

---

## API: PUT /api/v1/admin/config/{key}

### Traceability
- **Module:** MOD-27 — Configuration Management
- **Feature:** FT-27-01 — System Configuration CRUD
- **User Story:** US-019
- **Functional Requirement:** FR-023

### Purpose
Update the value of a system configuration key.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{
  "value": "string | required | new value for the config key",
  "reason": "string | required | change justification for audit log | max 500 chars"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| key (path) | Must exist in config registry |
| value | Required; must match expected type (INTEGER/STRING/BOOLEAN) |
| reason | Required; max 500 chars |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "key": "RATE_LIMIT_PER_MINUTE", "value": "120", "updatedAt": "2026-06-11T12:30:00Z" },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:30:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 400, "title": "Validation Error", "detail": "Value type mismatch. Expected INTEGER.", "instance": "/api/v1/admin/config/RATE_LIMIT_PER_MINUTE", "timestamp": "2026-06-11T12:30:00Z", "errors": { "value": "Expected integer value" } }
}
```

### Business Rules
- Redis cache for updated key invalidated immediately on update.
- Change reason stored in audit log.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Type mismatch or invalid value |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 404 | Config key not found |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. Audit log mandatory.

### Performance SLA
- P95 < 300ms (KPI-010: < 1s)

### Telemetry / Monitoring
```text
event_name: config_sync_latency
fields: [user_id, config_key, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-27-01-04 | Valid config update | 200 with updated value |
| TC-27-01-05 | Wrong type value | 400 |
| TC-27-01-06 | Config key not found | 404 |

---

## API: PUT /api/v1/admin/feature-flags/{flag}

### Traceability
- **Module:** MOD-27 — Configuration Management
- **Feature:** FT-27-02 — Feature Flag Management
- **User Story:** US-020
- **Functional Requirement:** FR-024

### Purpose
Enable or disable a feature flag for controlled feature rollout.

### Authentication
JWT Required.

### Authorization
SUPER_ADMIN only.

### Request Schema
```json
{
  "enabled": "boolean | required",
  "reason": "string | required | max 500 chars"
}
```

### Validation Rules
| Field | Rule |
| :--- | :--- |
| flag (path) | Must exist in feature flag registry |
| enabled | Required; boolean |
| reason | Required; max 500 chars |

### Response Schema — Success
```json
{
  "success": true,
  "data": { "flag": "VOICE_INPUT_ENABLED", "enabled": true, "updatedAt": "2026-06-11T12:30:00Z" },
  "error": null,
  "meta": { "requestId": "uuid-v4", "timestamp": "2026-06-11T12:30:00Z" }
}
```

### Response Schema — Error
```json
{
  "success": false, "data": null,
  "error": { "status": 404, "title": "Not Found", "detail": "Feature flag not found.", "instance": "/api/v1/admin/feature-flags/UNKNOWN_FLAG", "timestamp": "2026-06-11T12:30:00Z", "errors": {} }
}
```

### Business Rules
- Feature flags propagated to all service instances via Redis pub/sub within 1 second.
- Audit log records every flag toggle with actor and reason.

### Error Response Codes
| Code | Meaning |
| :--- | :--- |
| 400 | Validation Error |
| 401 | JWT missing or expired |
| 403 | Not SUPER_ADMIN |
| 404 | Flag not found |
| 500 | Internal Server Error |

### Security
- SUPER_ADMIN only. Audit log mandatory.

### Performance SLA
- P95 < 300ms

### Telemetry / Monitoring
```text
event_name: config_sync_latency
fields: [user_id, flag_name, enabled, request_id, latency_ms, status]
```

### Test Cases
| TC ID | Description | Expected |
| :--- | :--- | :--- |
| TC-27-02-01 | Enable valid feature flag | 200 with enabled: true |
| TC-27-02-02 | Disable feature flag | 200 with enabled: false |
| TC-27-02-03 | Unknown flag | 404 |
| TC-27-02-04 | Propagation to Redis < 1s | Verified via Redis monitor |
