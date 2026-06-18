# Module Design: MOD-28 — Dashboard Insights

## 1. Module Summary

### Purpose
Provides administrators with consolidated, real-time analytics widgets directly on the Web Admin Dashboard. This includes candidate performance snapshots and candidate progression velocity (most improved), enabling quick evaluations without deep report navigation.

### Responsibilities
- Serve aggregated candidate metrics (scores, attendance, activity).
- Calculate progression statistics (differential learning velocity).
- Support filtering by department/technology stack.
- Trigger real-time dashboard refresh updates via websocket/events.

### Scope Boundaries
* **In Scope**: Candidate performance stats cards; candidate improvement metrics; sorting/filtering; cache-aside Redis optimization.
* **Out of Scope**: Individual cohort peer comparisons; raw file attachments access; PDF report exports; recommendation engine path modifications.

---

## 2. API-28-01: Candidate Performance Metrics

### Traceability
- **Module**: MOD-28 — Dashboard Insights
- **Feature**: FT-28-01 — Candidate Performance Card
- **User Story**: US-004
- **Functional Requirement**: FR-005

### Purpose
Retrieve a paginated list of candidate overall performance metrics. Supports filtering by department/technology and sorting by score or attendance.

### Authentication
Required (JWT Bearer Token in `Authorization` header).

### Authorization
Requires `SUPER_ADMIN` or `CONTENT_ADMIN` roles.

### Request Schema
* **Method**: GET
* **Endpoint**: `/api/v1/admin/dashboard/candidate-performance`
* **Query Parameters**:
  * `departmentId` (String, UUID, Optional)
  * `technologyId` (String, UUID, Optional)
  * `sortBy` (String, Optional) - Default: `score_desc`. Options: `score_desc`, `score_asc`, `attended_desc`
  * `page` (Integer, Optional, Default: 1)
  * `limit` (Integer, Optional, Default: 10)

### Validation Rules
| Parameter | Rule | Description |
| :--- | :--- | :--- |
| `departmentId` | Optional; must be valid UUID v4 format | Filter by department |
| `technologyId` | Optional; must be valid UUID v4 format | Filter by technology |
| `sortBy` | Optional; must match regex `^(score_desc|score_asc|attended_desc)$` | Sorting behavior |
| `page` | Optional; min value: 1 | Pagination page index |
| `limit` | Optional; min value: 1, max value: 100 | Items per page limit |

### Response Schema

#### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "candidateId": "cand-9f2d8a0c-43f1-4c1d-87be-221199ee44aa",
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

#### Error (400 Bad Request)
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

### Business Rules
- Return only active candidate accounts.
- Calculate overall score as the math average of all completed sessions.
- Fallback profile images to initials SVG format in the client layer if `profilePhotoUrl` is null.
- Redis caching applied with a 10-second TTL to avoid database transaction locks on high-concurrency dashboards.

### Error Response Codes
- `400 BAD_REQUEST`: Parameter format or range mismatch.
- `401 UNAUTHORIZED`: Authentication token is missing, corrupted, or expired.
- `403 FORBIDDEN`: Insufficient role authority (e.g. Candidates accessing dashboard).

### Security
- Role checks enforced via method security interceptors.
- Output values sanitized (pre-signed, read-only URLs for profile photos).

### Performance SLA
- P95 latency < 1.5 seconds (`KPI-013`).

### Telemetry / Monitoring
- Metrics event: `dashboard_perf_card_latency`
- Telemetry event logging:
```text
event_name: dashboard_perf_card_latency
fields:
  - request_id
  - user_id (admin)
  - latency_ms
  - status
```

### Test Cases

| TC-ID | Description | Type | Priority |
| :--- | :--- | :--- | :--- |
| TC-28-01-01 | Dashboard returns correct session count and averages | API | P0 |
| TC-28-01-02 | Filter by department yields only matched candidates | API | P0 |
| TC-28-01-03 | Sort by score desc returns highest scorer first | API | P0 |
| TC-28-01-04 | Request without authentication header yields 401 | Security | P0 |
| TC-28-01-05 | Client request using CANDIDATE token yields 403 | Security | P0 |
| TC-28-01-06 | Cache check: subsequent loads within 10s hit Redis | Integration | P1 |

---

## 3. API-28-02: Most Improved Candidates

### Traceability
- **Module**: MOD-28 — Dashboard Insights
- **Feature**: FT-28-02 — Most Improved Candidate
- **User Story**: US-005
- **Functional Requirement**: FR-006

### Purpose
Retrieve a list of candidates who have shown the highest positive average score improvement over time.

### Authentication
Required (JWT Bearer Token in `Authorization` header).

### Authorization
Requires `SUPER_ADMIN` or `CONTENT_ADMIN` roles.

### Request Schema
* **Method**: GET
* **Endpoint**: `/api/v1/admin/dashboard/most-improved`
* **Query Parameters**:
  * `limit` (Integer, Optional, Default: 5)

### Validation Rules
| Parameter | Rule | Description |
| :--- | :--- | :--- |
| `limit` | Optional; min value: 1, max value: 50 | Restricts response list length |

### Response Schema

#### Success (200 OK)
```json
{
  "success": true,
  "data": {
    "improvedCandidates": [
      {
        "candidateId": "cand-7c1a8e9d-21b4-4b5c-98aa-332288dd44cc",
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

### Business Rules
- Calculate improvement by comparing historical averages (first N-1 sessions) with recent averages (the last completed session).
- Require at least 2 completed sessions for a candidate to be eligible. Exclude single-session candidates.
- Filter out candidates with negative or 0% progression deltas (widget highlights progression, not regression).
- Sort candidates in descending order of the calculated improvement percentage.

### Error Response Codes
- `400 BAD_REQUEST`: Query limits format or range mismatch.
- `401 UNAUTHORIZED`: Authentication token validation failure.
- `403 FORBIDDEN`: Admin access checks failed.

### Security
- Standard JWT and CORS protections.
- Input validation on parameters to prevent buffer size attacks.

### Performance SLA
- P95 latency < 1.5 seconds (`KPI-014`).

### Telemetry / Monitoring
- Metrics event: `dashboard_most_improved_latency`
- Log fields: `request_id`, `latency_ms`, `status`, `returned_count`.

### Test Cases

| TC-ID | Description | Type | Priority |
| :--- | :--- | :--- | :--- |
| TC-28-02-01 | Dynamic progression calculation delta matches mathematical baseline | API | P0 |
| TC-28-02-02 | Candidate with only 1 session completed is excluded | API | P0 |
| TC-28-02-03 | Candidates with negative improvement delta are filtered out | API | P0 |
| TC-28-02-04 | Parameter limit restricts returned candidates count correctly | API | P1 |
| TC-28-02-05 | Client request using CANDIDATE token yields 403 | Security | P0 |
