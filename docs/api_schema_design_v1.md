# API Schema & Design - AI-Powered Interview Prep (v1 Enhancement)

---

## 1. Architecture Overview

- **API Style:** REST (OpenAPI 3.0 Specification)
- **Auth:** JWT Bearer Token (Stateless)
- **Session Strategy:** Stateless — derived from JWT claims
- **Versioning:** `/api/v1` — URI path versioning
- **Base URL:** `https://api.interviewplatform.com/api/v1`
- **Content-Type:** `application/json` (all endpoints)
- **Rate Limiting:** Redis token-bucket; 100 req/min per IP; `429 Too Many Requests` on breach
- **CORS:** Restricted to `https://admin.interviewplatform.com` (Web Admin origin only)
- **Transport:** HTTPS/TLS 1.2+ mandatory

---

## 2. Module → Feature → API Mapping

| Module ID | Module Name | Feature Count | API Count |
| :--- | :--- | :---: | :---: |
| **MOD-28** | Dashboard Insights | 2 | 2 |

---

## 3. Common Reusable Schemas

### 3.1 Standard Success Envelope
All success payloads are wrapped in the following JSON structure:
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "uuid-v4-string",
    "timestamp": "2026-06-18T12:00:00Z"
  }
}
```

### 3.2 Standard Error Response (RFC 7807)
Field validation and server faults follow the error standard:
```json
{
  "success": false,
  "data": null,
  "error": {
    "status": 400,
    "title": "Validation Error",
    "detail": "Field-level validation failed",
    "instance": "/api/v1/admin/dashboard/candidate-performance",
    "timestamp": "2026-06-18T12:00:00Z",
    "errors": {
      "limit": "Limit must be a positive integer"
    }
  }
}
```

---

## 4. Security Design

| Concern | Implementation |
| :--- | :--- |
| Authentication | JWT Bearer tokens via `Authorization: Bearer <token>` header |
| Authorization (RBAC) | Enforced at controller method level via `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT_ADMIN')")` |
| SQL Injection | Parameterized queries using Spring Data JPA |
| CSRF | Disabled for stateless APIs; CORS origin whitelist restricted to Web Admin domain |
| Rate Limiting | Redis-backed filter limiting dashboard queries to 20 requests per minute per Admin user |

---

## 5. SLA Summary

| Metric | Target | KPI Source |
| :--- | :--- | :--- |
| Candidate Performance API Latency (P95) | < 1.5s | KPI-013 |
| Progression Engine Calculation Latency (P95) | < 1.5s | KPI-014 |
| Dashboard Refresh Sync Delay | < 2.0s | KPI-015 |

---

## 6. Full API Catalog by Module

### MOD-28 — Dashboard Insights

#### API-28-01: GET `/admin/dashboard/candidate-performance`
* **Description**: Retrieve a paginated list of candidate overall performance metrics. Supports filtering by department/technology and sorting.
* **Authentication**: Required (`SUPER_ADMIN`, `CONTENT_ADMIN`)
* **Request Parameters**:
  * `departmentId` (String, UUID, Optional)
  * `technologyId` (String, UUID, Optional)
  * `sortBy` (String, Optional) - Options: `score_desc`, `score_asc`, `attended_desc`
  * `page` (Integer, Optional, Default: 1)
  * `limit` (Integer, Optional, Default: 10)
* **Response Payload (Success)**:
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "candidateId": "cand-uuid-1",
        "fullName": "John Smith",
        "profilePhotoUrl": "https://storage.platform.com/profiles/john_smith.jpg",
        "departmentName": "Mobile Development",
        "technologyName": "React Developer",
        "overallScorePercentage": 87.0,
        "totalInterviewsAttended": 12,
        "lastActiveDate": "2026-06-18T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 125,
      "totalPages": 13,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "error": null,
  "meta": {
    "requestId": "a8d2c6e9-b5f7-410a-9d2c-88e49b817cfa",
    "timestamp": "2026-06-18T12:00:00Z"
  }
}
```

---

#### API-28-02: GET `/admin/dashboard/most-improved`
* **Description**: Fetch candidates who have demonstrated the highest average score improvement over time.
* **Authentication**: Required (`SUPER_ADMIN`, `CONTENT_ADMIN`)
* **Request Parameters**:
  * `limit` (Integer, Optional, Default: 5)
* **Response Payload (Success)**:
```json
{
  "success": true,
  "data": {
    "improvedCandidates": [
      {
        "candidateId": "cand-uuid-2",
        "fullName": "Rahul Sharma",
        "profilePhotoUrl": "https://storage.platform.com/profiles/rahul_sharma.jpg",
        "previousAverageScore": 58.0,
        "currentAverageScore": 82.0,
        "improvementPercentage": 24.0,
        "trend": "UPWARD"
      }
    ]
  },
  "error": null,
  "meta": {
    "requestId": "f4b6d8a0-e2c7-49db-84b2-298adcf4391e",
    "timestamp": "2026-06-18T12:05:00Z"
  }
}
```

---

## 7. Global Traceability Matrix

| Module | Feature | API Endpoint | KPI ID | Telemetry Event |
| :--- | :--- | :--- | :--- | :--- |
| **MOD-28** Dashboard Insights | Candidate Performance Card | GET `/admin/dashboard/candidate-performance` | KPI-013 | `dashboard_perf_card_latency` |
| **MOD-28** Dashboard Insights | Most Improved Candidate | GET `/admin/dashboard/most-improved` | KPI-014 | `dashboard_most_improved_latency` |

---

## 8. Role-to-Endpoint Access Matrix

| Role | Auth Endpoints | Candidate Endpoints | Admin Read Endpoints | Admin Write Endpoints | Super Admin Only |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Public | ❌ | ❌ | ❌ | ❌ | ❌ |
| CANDIDATE | ❌ | ❌ | ❌ | ❌ | ❌ |
| CONTENT_ADMIN | ❌ | ❌ | ✅ | ❌ | ❌ |
| SUPER_ADMIN | ❌ | ❌ | ✅ | ❌ | ❌ |

> **Admin Read Endpoints (MOD-28)**: GET `/admin/dashboard/candidate-performance`, GET `/admin/dashboard/most-improved`. Access is restricted to `SUPER_ADMIN` and `CONTENT_ADMIN` roles only.
