# Module Overview: MOD-24 — File Storage

## 1. Module Summary

### Purpose
Manages all file storage operations on AWS S3 — generating pre-signed upload URLs for admin documents and candidate audio, enforcing file size and type constraints, and executing automated lifecycle deletion policies (audio cleanup after 30 days).

### Responsibilities
- Pre-signed URL generation for admin document uploads.
- Pre-signed URL generation for candidate audio uploads.
- File metadata tracking (key, bucket, upload timestamp, owner).
- Automated lifecycle deletion (AudioCleanupJob — 30-day TTL).
- File access control (owner-scoped URLs only).

### Scope Boundaries
**In Scope:** Pre-signed URL generation; file metadata DB; lifecycle deletion job.
**Out of Scope:** CDN distribution; image processing; video storage.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-24-01 | Pre-signed URL Management | Backend Dev | P0 | Approved |
| FT-24-02 | Automated File Lifecycle Deletion | Backend Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- AWS S3 (External)
- PostgreSQL (File metadata records)
- MOD-01 Authentication (Owner identity scoping)

### Depended Upon By
- MOD-07 Bulk Upload
- MOD-12 Voice Recording
- MOD-22 Audit Logs (deletion events)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-012 | Audit Log Write Success | 100% | `audit_log_success` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| FS-001 | Pre-signed URL generation failed | 500 |
| FS-002 | File not found in S3 | 404 |
| FS-003 | File deletion failed | 500 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Pre-signed URL Mgmt | US-001 | FR-011 | API-24-01 | TC-24-01 | KPI-012 |
| File Lifecycle Deletion | US-012 | FR-015 | Async Job | TC-24-02 | KPI-012 |
