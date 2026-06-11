# API Schema & Design Overview - AI-Powered Interview Preparation and Assessment Platform

---

## 1. Architecture Overview

- **API Style:** REST (OpenAPI 3.0 Specification)
- **Auth:** JWT Bearer Token (Stateless) + OTP (Candidate onboarding)
- **Session Strategy:** Stateless — no server-side sessions; all identity via JWT claims
- **Versioning:** `/api/v1` — URI path versioning; breaking changes require new version namespace
- **Base URL:** `https://api.interviewplatform.com/api/v1`
- **Content-Type:** `application/json` (all endpoints)
- **Rate Limiting:** Redis token-bucket; 100 req/min per IP; `429 Too Many Requests` on breach
- **CORS:** Restricted to `https://admin.interviewplatform.com` (Web Admin origin only)
- **Transport:** HTTPS/TLS 1.2+ mandatory; HTTP rejected at gateway level

---

## 2. Module → Feature → API Mapping

| Module ID | Module Name | Feature Count | API Count |
| :--- | :--- | :---: | :---: |
| MOD-01 | Authentication | 2 | 4 |
| MOD-02 | User Profile | 1 | 3 |
| MOD-03 | Department Management | 1 | 4 |
| MOD-04 | Technology Management | 1 | 4 |
| MOD-05 | Experience Level Management | 1 | 4 |
| MOD-06 | Question Repository | 1 | 4 |
| MOD-07 | Bulk Upload | 1 | 2 |
| MOD-08 | Categorization Engine | 1 | 1 |
| MOD-09 | Interview Configuration | 1 | 1 |
| MOD-10 | Interview Session | 2 | 3 |
| MOD-11 | Question Delivery | 1 | 1 |
| MOD-12 | Voice Recording | 1 | 1 |
| MOD-13 | Speech-To-Text | 1 | 1 |
| MOD-14 | AI Evaluation | 1 | 1 |
| MOD-15 | Scoring Engine | 1 | 1 |
| MOD-16 | Feedback Engine | 1 | 1 |
| MOD-17 | Reporting | 1 | 2 |
| MOD-18 | Dashboard | 2 | 2 |
| MOD-19 | Recommendation Engine | 1 | 1 |
| MOD-20 | Analytics | 1 | 2 |
| MOD-21 | Notifications | 1 | 1 |
| MOD-22 | Audit Logs | 2 | 2 |
| MOD-23 | Admin Portal | 2 | 2 |
| MOD-24 | File Storage | 2 | 2 |
| MOD-25 | Search & Filtering | 1 | 2 |
| MOD-26 | AI Prompt Management | 1 | 4 |
| MOD-27 | Configuration Management | 2 | 4 |
| **TOTAL** | **27 Modules** | **33** | **57** |

---

## 3. Common Reusable Schemas

### 3.1 Standard Success Response

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "uuid-v4-string",
    "timestamp": "2026-06-11T12:00:00Z"
  }
}
```

### 3.2 Standard Error Response (RFC 7807)

```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 400,
    "title": "Validation Error",
    "detail": "Field-level validation failed",
    "instance": "/api/v1/interviews/sessions",
    "timestamp": "2026-06-11T12:00:00Z",
    "errors": {
      "departmentId": "Department ID must not be blank",
      "questionCount": "Question count must be between 1 and 20"
    }
  }
}
```

### 3.3 Pagination Schema

```json
{
  "page": 1,
  "limit": 20,
  "total": 342,
  "totalPages": 18,
  "hasNext": true,
  "hasPrevious": false
}
```

### 3.4 JWT Token Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "role": "CANDIDATE"
}
```

### 3.5 Rate Limit Exceeded Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 429,
    "title": "Too Many Requests",
    "detail": "Rate limit exceeded. Retry after 45 seconds.",
    "retryAfterSeconds": 45,
    "timestamp": "2026-06-11T12:00:00Z"
  }
}
```

### 3.6 Pre-signed Upload URL Response

```json
{
  "uploadUrl": "https://s3.amazonaws.com/platform-uploads/...",
  "fileKey": "uploads/2026/06/qa_android.docx",
  "expiresInSeconds": 300
}
```

### 3.7 Async Task Status Response

```json
{
  "taskId": "task-abc-987",
  "status": "PROCESSING",
  "progress": 45,
  "completedAt": null,
  "resultSummary": null
}
```

---

## 4. Security Design

| Concern | Implementation |
| :--- | :--- |
| Authentication | JWT Bearer tokens via `Authorization: Bearer <token>` header |
| JWT Access Token TTL | 15 minutes |
| JWT Refresh Token TTL | 7 days; stored in HttpOnly cookie; rotated on each use |
| OTP TTL | 5 minutes; single-use; invalidated immediately after verification |
| RBAC Roles | `SUPER_ADMIN`, `CONTENT_ADMIN`, `CANDIDATE` |
| SQL Injection | Spring Data JPA parameterized queries; no raw SQL concatenation |
| XSS Protection | Output sanitization on React client; `Content-Security-Policy` headers |
| CSRF | Disabled for stateless JWT APIs; CORS origin whitelist enforced |
| Rate Limiting | Redis token-bucket; 100 req/min per IP; 429 on breach |
| Sensitive Field Masking | No passwords, OTPs, or internal IDs returned in error responses |
| TLS | HTTPS/TLS 1.2+ mandatory; enforced at API Gateway level |
| Audit | All privileged mutations captured to immutable audit_logs table |

---

## 5. SLA Summary

| Metric | Target |
| :--- | :--- |
| API Uptime | 99.9% |
| Standard API P95 Latency | < 3s |
| Dashboard Load P95 | < 2s |
| Search Query Response | < 2s |
| AI Evaluation Completion | < 10s |
| Whisper STT Conversion (30s clip) | < 3s |
| Ingestion Job (≤ 10MB file) | < 15s |
| Notification Delivery Rate | > 99% |

---

## 6. Full API Catalog by Module

---

### MOD-01 — Authentication

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-01-01a | POST | `/auth/otp/request` | No | Public | Request OTP dispatch to phone/email |
| API-01-01b | POST | `/auth/otp/verify` | No | Public | Verify OTP and receive JWT token pair |
| API-01-03a | POST | `/auth/token/refresh` | No (Refresh Token) | All | Rotate refresh token for new access token |
| API-01-03b | POST | `/auth/logout` | Yes | All | Revoke refresh token and invalidate session |

---

### MOD-02 — User Profile

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-02-01a | GET | `/candidates/profile` | Yes | CANDIDATE | Retrieve own profile |
| API-02-01b | PUT | `/candidates/profile` | Yes | CANDIDATE | Update own profile fields |
| API-02-01c | DELETE | `/candidates/profile` | Yes | CANDIDATE | Delete account (GDPR cascade) |

---

### MOD-03 — Department Management

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-03-01a | POST | `/admin/departments` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Create department |
| API-03-01b | GET | `/admin/departments` | Yes | CONTENT_ADMIN, SUPER_ADMIN | List all departments (paginated) |
| API-03-01c | PUT | `/admin/departments/{id}` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Update department |
| API-03-01d | DELETE | `/admin/departments/{id}` | Yes | SUPER_ADMIN | Delete department |

---

### MOD-04 — Technology Management

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-04-01a | POST | `/admin/technologies` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Create technology tag |
| API-04-01b | GET | `/admin/technologies` | Yes | CONTENT_ADMIN, SUPER_ADMIN | List all technology tags |
| API-04-01c | PUT | `/admin/technologies/{id}` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Update technology tag |
| API-04-01d | DELETE | `/admin/technologies/{id}` | Yes | SUPER_ADMIN | Delete technology tag |

---

### MOD-05 — Experience Level Management

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-05-01a | POST | `/admin/experience-levels` | Yes | SUPER_ADMIN | Create experience level |
| API-05-01b | GET | `/admin/experience-levels` | Yes | All | List all experience levels |
| API-05-01c | PUT | `/admin/experience-levels/{id}` | Yes | SUPER_ADMIN | Update experience level |
| API-05-01d | DELETE | `/admin/experience-levels/{id}` | Yes | SUPER_ADMIN | Delete experience level |

---

### MOD-06 — Question Repository

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-06-01a | POST | `/admin/questions` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Manually create question |
| API-06-01b | GET | `/admin/questions` | Yes | CONTENT_ADMIN, SUPER_ADMIN | List/search questions (filtered) |
| API-06-01c | PUT | `/admin/questions/{id}` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Update question |
| API-06-01d | DELETE | `/admin/questions/{id}` | Yes | SUPER_ADMIN | Soft-delete (deactivate) question |

---

### MOD-07 — Bulk Upload

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-07-01a | POST | `/admin/questions/ingest` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Trigger bulk document ingestion job |
| API-07-01b | GET | `/admin/questions/ingest/{taskId}` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Poll ingestion task status |

---

### MOD-08 — Categorization Engine

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-08-01 | GET | `/admin/questions/ingest/{taskId}/results` | Yes | CONTENT_ADMIN, SUPER_ADMIN | View extracted Q&A results from ingestion |

---

### MOD-09 — Interview Configuration

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-09-01 | GET | `/interviews/configuration/options` | Yes | CANDIDATE | Fetch available departments, levels, and technologies for setup |

---

### MOD-10 — Interview Session

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-10-01 | POST | `/interviews/sessions` | Yes | CANDIDATE | Initialize new mock interview session |
| API-10-02 | POST | `/interviews/sessions/{sessionId}/answers` | Yes | CANDIDATE | Submit answer (text or audio) for a question |
| API-10-03 | POST | `/interviews/sessions/{sessionId}/complete` | Yes | CANDIDATE | Mark session as completed and trigger evaluation |

---

### MOD-11 — Question Delivery

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-11-01 | GET | `/interviews/sessions/{sessionId}/questions` | Yes | CANDIDATE | Retrieve randomized question list for session |

---

### MOD-12 — Voice Recording

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-12-01 | POST | `/media/audio/upload-url` | Yes | CANDIDATE | Request pre-signed S3 URL for audio upload |

---

### MOD-13 — Speech-To-Text

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-13-01 | POST | `/media/audio/transcribe` | Yes | CANDIDATE | Submit audio URL for Whisper STT transcription |

---

### MOD-14 — AI Evaluation

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-14-01 | GET | `/interviews/sessions/{sessionId}/evaluation` | Yes | CANDIDATE | Retrieve AI evaluation report for completed session |

---

### MOD-15 — Scoring Engine

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-15-01 | GET | `/interviews/sessions/{sessionId}/scores` | Yes | CANDIDATE | Retrieve per-criteria scores for a session |

---

### MOD-16 — Feedback Engine

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-16-01 | GET | `/interviews/sessions/{sessionId}/feedback` | Yes | CANDIDATE | Retrieve strengths, weaknesses, and recommendations |

---

### MOD-17 — Reporting

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-17-01 | GET | `/candidates/reports` | Yes | CANDIDATE | List all past session reports (paginated) |
| API-17-02 | GET | `/candidates/reports/{sessionId}` | Yes | CANDIDATE | Retrieve single session report detail |

---

### MOD-18 — Dashboard

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-18-01 | GET | `/candidates/dashboard` | Yes | CANDIDATE | Retrieve candidate performance dashboard data |
| API-18-02 | GET | `/admin/dashboard` | Yes | SUPER_ADMIN, CONTENT_ADMIN | Retrieve admin telemetry dashboard data |

---

### MOD-19 — Recommendation Engine

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-19-01 | GET | `/candidates/recommendations` | Yes | CANDIDATE | Retrieve personalized study topic recommendations |

---

### MOD-20 — Analytics

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-20-01 | GET | `/admin/analytics/platform` | Yes | SUPER_ADMIN | Platform-wide session and usage metrics |
| API-20-02 | GET | `/admin/analytics/content` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Question bank and ingestion volume metrics |

---

### MOD-21 — Notifications

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-21-01 | POST | `/notifications/register-device` | Yes | CANDIDATE | Register FCM device token for push notifications |

---

### MOD-22 — Audit Logs

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-22-01 | GET | `/admin/audit-logs` | Yes | SUPER_ADMIN | Retrieve paginated audit log records |
| API-22-02 | GET | `/admin/audit-logs/{logId}` | Yes | SUPER_ADMIN | Retrieve single audit log event detail |

---

### MOD-23 — Admin Portal

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-23-01 | POST | `/auth/admin/login` | No | Public | Admin credential login (returns JWT) |
| API-23-02 | GET | `/admin/users` | Yes | SUPER_ADMIN | List all admin users |

---

### MOD-24 — File Storage

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-24-01 | POST | `/files/upload-url` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Generate pre-signed S3 URL for document upload |
| API-24-02 | DELETE | `/files/{fileKey}` | Yes | SUPER_ADMIN | Manually delete a stored file |

---

### MOD-25 — Search & Filtering

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-25-01 | GET | `/questions/search` | Yes | CONTENT_ADMIN, SUPER_ADMIN | Full-text search questions via Elasticsearch |
| API-25-02 | GET | `/questions/filter` | Yes | CANDIDATE | Filter questions by department, level, technology |

---

### MOD-26 — AI Prompt Management

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-26-01a | POST | `/admin/ai/prompts` | Yes | SUPER_ADMIN | Create evaluation prompt template |
| API-26-01b | GET | `/admin/ai/prompts` | Yes | SUPER_ADMIN | List all prompt templates |
| API-26-01c | PUT | `/admin/ai/prompts/{id}` | Yes | SUPER_ADMIN | Update prompt template |
| API-26-01d | PUT | `/admin/ai/prompts/{id}/activate` | Yes | SUPER_ADMIN | Set active prompt version for evaluation type |

---

### MOD-27 — Configuration Management

| API-ID | Method | Endpoint | Auth Required | Role | Description |
| :--- | :---: | :--- | :---: | :--- | :--- |
| API-27-01a | GET | `/admin/config` | Yes | SUPER_ADMIN | List all system configuration keys |
| API-27-01b | PUT | `/admin/config/{key}` | Yes | SUPER_ADMIN | Update system configuration value |
| API-27-02a | GET | `/admin/feature-flags` | Yes | SUPER_ADMIN | List all feature flags and states |
| API-27-02b | PUT | `/admin/feature-flags/{flag}` | Yes | SUPER_ADMIN | Enable or disable a feature flag |

---

## 7. Global Traceability Matrix

| Module | Feature | API Endpoint | KPI ID | Telemetry Event |
| :--- | :--- | :--- | :--- | :--- |
| MOD-01 Authentication | OTP Login | POST `/auth/otp/request` | KPI-001 | `auth_otp_requested` |
| MOD-01 Authentication | OTP Login | POST `/auth/otp/verify` | KPI-001 | `auth_login_duration` |
| MOD-01 Authentication | JWT Token Management | POST `/auth/token/refresh` | KPI-001 | `token_refreshed` |
| MOD-01 Authentication | JWT Token Management | POST `/auth/logout` | KPI-001 | `auth_logout` |
| MOD-02 User Profile | Candidate Profile | GET `/candidates/profile` | KPI-001 | `profile_viewed` |
| MOD-02 User Profile | Candidate Profile | PUT `/candidates/profile` | KPI-001 | `profile_updated` |
| MOD-02 User Profile | Candidate Profile | DELETE `/candidates/profile` | KPI-012 | `account_deleted` |
| MOD-03 Department Mgmt | Department CRUD | POST `/admin/departments` | KPI-002 | `department_created` |
| MOD-03 Department Mgmt | Department CRUD | GET `/admin/departments` | KPI-002 | `metadata_sync_success` |
| MOD-03 Department Mgmt | Department CRUD | PUT `/admin/departments/{id}` | KPI-002 | `department_updated` |
| MOD-03 Department Mgmt | Department CRUD | DELETE `/admin/departments/{id}` | KPI-012 | `department_deleted` |
| MOD-04 Technology Mgmt | Technology Tags | POST `/admin/technologies` | KPI-002 | `technology_created` |
| MOD-04 Technology Mgmt | Technology Tags | GET `/admin/technologies` | KPI-002 | `metadata_sync_success` |
| MOD-05 Experience Level | Level Config | GET `/admin/experience-levels` | KPI-002 | `metadata_sync_success` |
| MOD-06 Question Repo | Question CRUD | GET `/admin/questions` | KPI-011 | `search_query_latency` |
| MOD-06 Question Repo | Question CRUD | POST `/admin/questions` | KPI-002 | `question_created` |
| MOD-07 Bulk Upload | Document Upload | POST `/admin/questions/ingest` | KPI-003 | `bulk_ingestion_seconds` |
| MOD-07 Bulk Upload | Document Upload | GET `/admin/questions/ingest/{taskId}` | KPI-003 | `bulk_ingestion_success` |
| MOD-08 Categorization | Q&A Extraction | GET `/admin/questions/ingest/{taskId}/results` | KPI-003 | `bulk_ingestion_seconds` |
| MOD-09 Interview Config | Session Setup | GET `/interviews/configuration/options` | KPI-004 | `session_init_latency` |
| MOD-10 Interview Session | Session Lifecycle | POST `/interviews/sessions` | KPI-004 | `session_init_latency` |
| MOD-10 Interview Session | Answer Submission | POST `/interviews/sessions/{id}/answers` | KPI-005 | `mock_answer_submitted` |
| MOD-10 Interview Session | Session Complete | POST `/interviews/sessions/{id}/complete` | KPI-006 | `interview_session_completed` |
| MOD-11 Question Delivery | Randomized Delivery | GET `/interviews/sessions/{id}/questions` | KPI-011 | `search_query_latency` |
| MOD-12 Voice Recording | Audio Capture | POST `/media/audio/upload-url` | KPI-005 | `whisper_stt_seconds` |
| MOD-13 Speech-To-Text | Whisper STT | POST `/media/audio/transcribe` | KPI-005 | `whisper_stt_seconds` |
| MOD-14 AI Evaluation | Evaluation Engine | GET `/interviews/sessions/{id}/evaluation` | KPI-006 | `ai_eval_latency` |
| MOD-15 Scoring Engine | Score Retrieval | GET `/interviews/sessions/{id}/scores` | KPI-006 | `ai_eval_latency` |
| MOD-16 Feedback Engine | Feedback Retrieval | GET `/interviews/sessions/{id}/feedback` | KPI-006 | `ai_eval_latency` |
| MOD-17 Reporting | Session Reports | GET `/candidates/reports` | KPI-007 | `dashboard_render_latency` |
| MOD-17 Reporting | Report Detail | GET `/candidates/reports/{sessionId}` | KPI-007 | `dashboard_render_latency` |
| MOD-18 Dashboard | Candidate Dashboard | GET `/candidates/dashboard` | KPI-007 | `dashboard_render_latency` |
| MOD-18 Dashboard | Admin Dashboard | GET `/admin/dashboard` | KPI-007 | `dashboard_render_latency` |
| MOD-19 Recommendation | Recommendations | GET `/candidates/recommendations` | KPI-008 | `recommendation_gen_seconds` |
| MOD-20 Analytics | Platform Metrics | GET `/admin/analytics/platform` | KPI-007 | `dashboard_render_latency` |
| MOD-20 Analytics | Content Metrics | GET `/admin/analytics/content` | KPI-003 | `bulk_ingestion_seconds` |
| MOD-21 Notifications | Device Registration | POST `/notifications/register-device` | KPI-009 | `notification_delivery_success` |
| MOD-22 Audit Logs | Audit Log Viewer | GET `/admin/audit-logs` | KPI-012 | `audit_log_success` |
| MOD-22 Audit Logs | Audit Log Detail | GET `/admin/audit-logs/{logId}` | KPI-012 | `audit_log_success` |
| MOD-23 Admin Portal | Admin Login | POST `/auth/admin/login` | KPI-001 | `auth_login_duration` |
| MOD-23 Admin Portal | User Management | GET `/admin/users` | KPI-010 | `config_sync_latency` |
| MOD-24 File Storage | Pre-signed URL | POST `/files/upload-url` | KPI-003 | `bulk_ingestion_seconds` |
| MOD-24 File Storage | File Deletion | DELETE `/files/{fileKey}` | KPI-012 | `audit_log_success` |
| MOD-25 Search & Filter | Question Search | GET `/questions/search` | KPI-011 | `search_query_latency` |
| MOD-25 Search & Filter | Question Filter | GET `/questions/filter` | KPI-011 | `search_query_latency` |
| MOD-26 AI Prompt Mgmt | Prompt CRUD | POST `/admin/ai/prompts` | KPI-010 | `config_sync_latency` |
| MOD-26 AI Prompt Mgmt | Activate Prompt | PUT `/admin/ai/prompts/{id}/activate` | KPI-010 | `config_sync_latency` |
| MOD-27 Config Mgmt | System Config | PUT `/admin/config/{key}` | KPI-010 | `config_sync_latency` |
| MOD-27 Config Mgmt | Feature Flags | PUT `/admin/feature-flags/{flag}` | KPI-010 | `config_sync_latency` |

---

## 8. Role-to-Endpoint Access Matrix

| Role | Auth Endpoints | Candidate Endpoints | Admin Read Endpoints | Admin Write Endpoints | Super Admin Only |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Public | ✅ | ❌ | ❌ | ❌ | ❌ |
| CANDIDATE | ✅ | ✅ | ❌ | ❌ | ❌ |
| CONTENT_ADMIN | ✅ | ❌ | ✅ | ✅ | ❌ |
| SUPER_ADMIN | ✅ | ❌ | ✅ | ✅ | ✅ |

> **Super Admin Only** endpoints: DELETE departments, DELETE technologies, audit log access, user management, AI prompt management, configuration management, feature flags.
