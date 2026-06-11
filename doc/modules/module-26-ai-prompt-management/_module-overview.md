# Module Overview: MOD-26 — AI Prompt Management

## 1. Module Summary

### Purpose
Manages the lifecycle of system prompt templates used by the AI Evaluation Engine — allowing Super Admins to version, activate, and update evaluation rubric prompts without requiring code deployments.

### Responsibilities
- CRUD for evaluation prompt templates (stored in DB, not hardcoded).
- Active prompt version selection per evaluation type.
- Prompt rendering with session context injection.
- Audit logging of all prompt version changes.

### Scope Boundaries
**In Scope:** Prompt template CRUD; version management; active-version selection; audit trail.
**Out of Scope:** A/B testing of prompt variants; automated prompt optimization.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-26-01 | Prompt Template Management | Backend Dev / AI Lead | P1 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-01 Authentication (Super Admin JWT)
- PostgreSQL (Prompt template storage)
- MOD-22 Audit Logs (version change tracking)

### Depended Upon By
- MOD-14 AI Evaluation (active prompt retrieval)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-010 | Config Update Sync Time | < 1s | `config_sync_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| PMGR-001 | Prompt template not found | 404 |
| PMGR-002 | No active prompt for evaluation type | 500 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Prompt Template Mgmt | US-018 | FR-022 | API-26-01 | TC-26-01 | KPI-010 |
