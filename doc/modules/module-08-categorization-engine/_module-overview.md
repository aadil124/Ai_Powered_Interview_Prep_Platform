# Module Overview: MOD-08 — Categorization Engine

## 1. Module Summary

### Purpose
Automatically parses raw text extracted from uploaded documents, identifies Q&A patterns using AI-assisted extraction, classifies them under the correct department/subdomain, and writes structured question records to both PostgreSQL and the Elasticsearch index.

### Responsibilities
- Text extraction from PDF/DOCX/TXT (Apache Tika / custom parser).
- Q&A pattern recognition using LLM prompt classification.
- Department and subdomain assignment per extracted question.
- Elasticsearch document indexing per question.
- Ingestion job status update (PROCESSING → COMPLETED / FAILED).

### Scope Boundaries
**In Scope:** Text parsing; Q&A extraction; classification; ES indexing; job status lifecycle.
**Out of Scope:** Duplicate question deduplication; manual editor review workflow.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-08-01 | Question Extraction & Indexing | Backend Dev / AI Lead | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-07 Bulk Upload (raw file from S3)
- MOD-03 Organization Management (department/subdomain reference)
- MOD-25 Search & Filtering (Elasticsearch write)
- External AI APIs (Q&A pattern extraction)
- PostgreSQL

### Depended Upon By
- MOD-06 Question Repository
- MOD-11 Question Delivery

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-003 | Bulk Ingestion Latency | < 15s | `bulk_ingestion_seconds` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| CAT-001 | Document parsing failed | 422 |
| CAT-002 | No Q&A patterns detected | 422 |
| CAT-003 | Elasticsearch index write failure | 500 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Question Extraction & Indexing | US-001 | FR-001 | API-08-01 | TC-08-01 | KPI-003 |
