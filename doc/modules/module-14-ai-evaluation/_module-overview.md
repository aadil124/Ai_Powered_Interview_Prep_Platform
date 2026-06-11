# Module Overview: MOD-14 — AI Evaluation & Scoring

## 1. Module Summary

### Purpose
Drives the automated grading of completed mock interview sessions using LLM APIs (OpenAI, Gemini, Claude). Generates structured performance scores, detailed feedback, strengths/weakness identification, and actionable improvement recommendations stored as persistent evaluation reports.

### Responsibilities
- Trigger evaluation job on session completion.
- Construct structured evaluation prompts per LLM API.
- Parse LLM response into scoring rubric dimensions.
- Persist evaluation report to PostgreSQL.
- Expose evaluation report retrieval endpoint.
- Generate actionable feedback and recommendations.

### Scope Boundaries
**In Scope:**
- Async EvaluationProcessingJob trigger on session complete.
- Multi-criteria scoring (Technical Accuracy, Communication Clarity, Conceptual Depth).
- Structured feedback generation (Strengths, Weaknesses, Recommendations).
- Evaluation report API endpoint.

**Out of Scope:**
- Human-in-the-loop grading or review workflow.
- Video analysis or non-verbal communication scoring.
- Real-time streaming evaluation during session.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-14-01 | AI Evaluation Engine | Backend Dev / AI Lead | P0 | Approved |
| FT-14-02 | Scoring & Feedback Engine | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-09 Interview Session (Completed session + answers as input)
- External AI APIs (OpenAI, Gemini, Claude — LLM grading)
- PostgreSQL (Evaluation report persistence)
- Redis (Async job concurrency control)

### Depended Upon By
- MOD-17 Reporting
- MOD-18 Dashboard
- MOD-19 Recommendation Engine

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-006 | AI Evaluation Latency | < 10s | `ai_eval_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| EVAL-001 | Evaluation not yet ready (processing) | 202 |
| EVAL-002 | Evaluation not found | 404 |
| EVAL-003 | LLM API call failed | 503 |
| EVAL-004 | LLM response parsing failed | 422 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| AI Evaluation Engine | US-003 | FR-004 | API-14-01 | TC-14-01 | KPI-006 |
| Scoring & Feedback | US-003 | FR-004 | API-14-02 | TC-14-02 | KPI-006 |
