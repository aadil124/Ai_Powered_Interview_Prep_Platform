# Feature: FT-14-01 — AI Evaluation Engine

Module: MOD-14 — AI Evaluation & Scoring

Status: Approved

---

## 1. Purpose & Scope

### Objective
Asynchronously evaluate all candidate answers from a completed mock interview session using LLM APIs (OpenAI / Gemini / Claude), generating structured scoring across multiple criteria and detailed qualitative feedback, stored as a persistent evaluation report.

### Business Value
Automated AI evaluation removes manual grading bottlenecks, delivers instant, consistent feedback to candidates, and directly enables the platform's core value proposition of realistic, data-driven interview preparation.

### In Scope
- Async EvaluationProcessingJob triggered on session completion.
- LLM API call with structured rubric-based prompt per answer.
- JSON response parsing into scoring dimensions.
- Evaluation report persistence to PostgreSQL.
- Retrieval endpoint for candidate dashboard.

### Out Of Scope
- Human reviewer override of AI scores.
- Real-time grading during session.
- Batch re-evaluation of historical sessions.

---

## 2. User Story Traceability

| US-ID | Story | Acceptance Criteria |
|-------|-------|--------------------|
| US-003 | As a Candidate, I want to view a breakdown of my strengths and weaknesses, so that I can focus my study efforts on specific knowledge gaps. | Evaluation report available within 10 seconds of session completion. Includes overall score, per-criteria scores, strengths, weaknesses, and recommendations. |

---

## 3. Functional Requirement Traceability

| FR-ID | Requirement | Status |
|-------|------------|--------|
| FR-004 | Invoke LLM endpoints with structured evaluation prompts and parse the output JSON into a persistent database record. | Approved |

---

## 4. Inputs & Parameters

| Parameter | Type | Required | Validation Rules |
|-----------|------|----------|-----------------|
| sessionId | String (UUID) | Yes | Must be in COMPLETED state |
| answers | List of AnswerRecord | Yes | Each record must have questionId + transcribedText |
| evaluationCriteria | List of Enum | Yes | TECHNICAL_ACCURACY, COMMUNICATION_CLARITY, CONCEPTUAL_DEPTH |

---

## 5. Outputs & Results

### Success Response
- **API Response:** 200 OK with full evaluation report object.
- **UI Behavior:** Android app renders score ring, strengths/weaknesses cards, and Q&A breakdown.
- **Events Triggered:** `ai_evaluation_completed` telemetry event.

### Failure Response
- **Validation Error:** 400 - Session not in COMPLETED state.
- **Business Error:** 404 EVAL-002 - Evaluation report not found.
- **System Error:** 503 EVAL-003 - LLM API unavailable; job retried with exponential backoff.

---

## 6. API Responsibilities

| API-ID | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| API-14-01 | GET | `/api/v1/interviews/sessions/{sessionId}/evaluation` | Retrieve evaluation report |

### Request Payload

```json
{}
```

### Response Payload

```json
{
  "sessionId": "session-xyz-456",
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
  }
}
```

---

## 7. Integration Boundaries

| Component | Dependency Type | Description |
|-----------|----------------|-------------|
| OpenAI / Gemini / Claude | External AI | LLM grading API with structured rubric prompt |
| PostgreSQL | Database | Persist evaluation report as JSON blob + score columns |
| Redis | Queue | Async job concurrency control (Redisson distributed lock) |
| Spring @Async | Framework | EvaluationProcessingJob execution |
| Spring Security | Auth | Candidate JWT enforced on GET endpoint |

---

## 8. Error & Failure Scenarios

| Scenario | Detection | Handling | User Response |
|----------|-----------|----------|---------------|
| LLM API timeout | HTTP 504 from LLM | Retry with exponential backoff (3 attempts) | "Evaluation is taking longer than expected. Check back in a moment." |
| LLM response parsing failure | JSON parse exception | Log error EVAL-004, alert SRE | "Evaluation processing encountered an issue. Support has been notified." |
| Session not in COMPLETED state | Status check in DB | Return 400 | "Session must be completed before evaluation." |
| Evaluation not found | DB findById empty | Return 404 EVAL-002 | "Evaluation report not found." |

---

## 9. Test Case References

| TC-ID | Description | Type | Priority |
|-------|-------------|------|----------|
| TC-14-01-01 | Completed session triggers evaluation job | Integration | P0 |
| TC-14-01-02 | Evaluation report contains all criteria scores | API | P0 |
| TC-14-01-03 | LLM timeout triggers retry and eventually succeeds | Integration | P1 |
| TC-14-01-04 | Evaluation completes in < 10s (Performance) | Performance | P0 |
| TC-14-01-05 | Report persisted correctly in PostgreSQL | Unit | P0 |

---

## 10. KPI References

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|----------|--------|----------------|
| KPI-006 | AI Evaluation Latency | < 10s | `ai_eval_latency` |

---

## 11. Ownership

| Area | Owner |
|------|-------|
| Product | Product Manager |
| Backend | Spring Boot Developer / AI Lead |
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
| AI Evaluation Engine | US-003 | FR-004 | API-14-01 | TC-14-01-01 to TC-14-01-05 | KPI-006 |
