# Module Overview: MOD-15 — Scoring Engine

## 1. Module Summary

### Purpose
Parses the raw LLM grading response into structured, multi-dimensional numeric scores across defined evaluation criteria (Technical Accuracy, Communication Clarity, Conceptual Depth), and persists the scoring record linked to the evaluation report.

### Responsibilities
- Parse LLM JSON output into score dimension fields.
- Calculate weighted overall score from criteria scores.
- Persist ScoreRecord to PostgreSQL linked to the session.
- Expose per-question and aggregate score retrieval.

### Scope Boundaries
**In Scope:** Score parsing; weighted calculation; DB persistence; score API.
**Out of Scope:** Peer benchmarking scores; score override by admin.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-15-01 | Score Calculation & Persistence | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-14 AI Evaluation (LLM raw response)
- PostgreSQL (ScoreRecord persistence)

### Depended Upon By
- MOD-16 Feedback Engine
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
| SCORE-001 | Score parsing failed | 422 |
| SCORE-002 | Score record not found | 404 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Score Calculation | US-003 | FR-004 | API-15-01 | TC-15-01 | KPI-006 |
