# Module Overview: MOD-06 — Question Repository

## 1. Module Summary

### Purpose
Manages the structured, queryable repository of all extracted interview questions. Provides CRUD operations for individual questions, supports manual question entry by admins, and serves as the canonical source of questions for session delivery.

### Responsibilities
- Manual question CRUD by Content Admins.
- List/search questions by department, subdomain, technology, and level.
- Question deactivation without deletion.
- Source of truth consumed by MOD-11 Question Delivery.

### Scope Boundaries
**In Scope:** Question CRUD (manual entry); list/filter by metadata; soft-delete (deactivation).
**Out of Scope:** Question versioning history; collaborative question editing.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-06-01 | Question CRUD & Search | Backend Dev | P1 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-01 Authentication (Admin JWT for write; Candidate JWT for read)
- MOD-03 Department Management (department/subdomain reference)
- MOD-04 Technology Management (technology tag reference)
- MOD-05 Experience Level Management (difficulty reference)
- PostgreSQL
- MOD-25 Search & Filtering (Elasticsearch for query)

### Depended Upon By
- MOD-11 Question Delivery

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-011 | Search Query Latency | < 2s | `search_query_latency` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| QREP-001 | Question not found | 404 |
| QREP-002 | Department/subdomain mismatch | 400 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Question CRUD | US-009 | FR-011 | API-06-01 | TC-06-01 | KPI-011 |
