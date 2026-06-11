# Feature: FT-18-01 — Candidate Performance Dashboard

Module: MOD-18 — Analytics & Dashboard

Status: Approved

---

## 1. Purpose & Scope

### Objective
Present candidates with a visual, data-rich performance dashboard showing historical mock interview session scores, trend lines over time, and subdomain-level strength/weakness analytics — enabling targeted study focus.

### Business Value
Data-driven progress tracking increases platform retention and repeat usage. It directly fulfills the core promise of "identifying knowledge gaps and areas requiring improvement" from the BRD.

### In Scope
- List of past mock sessions with dates, departments, and scores.
- Overall score trend chart (line chart over time).
- Subdomain breakdown of strengths and weaknesses.
- Aggregated criteria scores (Technical Accuracy, Clarity, Depth).

### Out Of Scope
- Peer benchmarking or leaderboard.
- Progress notifications or email reports.

---

## 2. User Story Traceability

| US-ID | Story | Acceptance Criteria |
|-------|-------|--------------------|
| US-003 | As a Candidate, I want to view a breakdown of my strengths and weaknesses, so that I can focus my study efforts on specific knowledge gaps. | Dashboard loads in < 2s. Score trend chart displays at least 3 past sessions. Subdomain breakdown shows distinct categories. |

---

## 3. Functional Requirement Traceability

| FR-ID | Requirement | Status |
|-------|------------|--------|
| FR-012 | System must aggregate candidate evaluation history and serve visual performance metrics via API within 2 seconds. | Approved |

---

## 4. Inputs & Parameters

| Parameter | Type | Required | Validation Rules |
|-----------|------|----------|-----------------|
| candidateId | String (UUID, from JWT) | Yes (implicit) | Derived from authenticated JWT claim |
| dateFrom | ISO-8601 Date | No | Optional filter for date range |
| dateTo | ISO-8601 Date | No | Optional filter for date range |
| departmentId | String (UUID) | No | Optional department filter |

---

## 5. Outputs & Results

### Success Response
- **API Response:** 200 OK with aggregated dashboard payload.
- **UI Behavior:** Android app renders score ring, trend chart, and strength/weakness card list.
- **Events Triggered:** `dashboard_viewed` telemetry event.

### Failure Response
- **Validation Error:** 400 - Invalid date range format.
- **Business Error:** 404 DASH-001 - No session history for this candidate.
- **System Error:** 503 DASH-002 - DB aggregation query timeout.

---

## 6. API Responsibilities

| API-ID | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| API-18-01 | GET | `/api/v1/candidates/dashboard` | Retrieve candidate performance dashboard data |

### Request Payload

```json
{}
```

### Response Payload

```json
{
  "candidateId": "cand-abc-123",
  "totalSessions": 7,
  "averageScore": 76,
  "scoreTrend": [
    { "date": "2026-05-10", "score": 68 },
    { "date": "2026-05-20", "score": 74 },
    { "date": "2026-06-01", "score": 82 }
  ],
  "subdomainBreakdown": {
    "Android Development": { "averageScore": 84, "sessionsCount": 4 },
    "Backend Development": { "averageScore": 71, "sessionsCount": 3 }
  },
  "topStrengths": ["Clean Architecture boundary knowledge", "Coroutines lifecycle awareness"],
  "topWeaknesses": ["LiveData vs StateFlow distinction", "Dependency Injection edge cases"]
}
```

---

## 7. Integration Boundaries

| Component | Dependency Type | Description |
|-----------|----------------|-------------|
| PostgreSQL | Database | Aggregate query across evaluation_reports and interview_sessions tables |
| Redis | Cache | Cache dashboard response per candidateId (TTL: 60s) |
| Spring Security | Auth | Candidate JWT; candidateId extracted from token claims |

---

## 8. Error & Failure Scenarios

| Scenario | Detection | Handling | User Response |
|----------|-----------|----------|---------------|
| No session history | Empty DB query | Return 404 DASH-001 | "You haven't completed any mock interviews yet. Start your first session!" |
| DB aggregation timeout | Query > 3s threshold | Return 503, log alert | "Unable to load dashboard. Please try again shortly." |
| Invalid date range | Validation on dateFrom > dateTo | Return 400 | "Invalid date range. Start date must be before end date." |

---

## 9. Test Case References

| TC-ID | Description | Type | Priority |
|-------|-------------|------|----------|
| TC-18-01-01 | Dashboard returns correct session count and averages | API | P0 |
| TC-18-01-02 | Score trend list ordered chronologically | API | P0 |
| TC-18-01-03 | Dashboard loads in < 2s (Performance) | Performance | P0 |
| TC-18-01-04 | Empty history returns 404 with proper message | API | P1 |
| TC-18-01-05 | Redis cache serves second request within 60s TTL | Integration | P1 |

---

## 10. KPI References

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|----------|--------|----------------|
| KPI-007 | Dashboard Load Time | < 2s | `dashboard_render_latency` |

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
| Candidate Dashboard | US-003 | FR-012 | API-18-01 | TC-18-01-01 to TC-18-01-05 | KPI-007 |
