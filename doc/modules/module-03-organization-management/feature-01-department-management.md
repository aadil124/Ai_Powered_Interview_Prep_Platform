# Feature: FT-03-01 — Department Management

Module: MOD-03 — Department & Organization Management

Status: Approved

---

## 1. Purpose & Scope

### Objective
Provide Content Admins and Super Admins with full CRUD control over departments and their technical subdomains, enabling organized partitioning of interview content (e.g., Mobile Development, Web Development, Backend Development).

### Business Value
Structured departments are the fundamental building block allowing admins to categorize questions and candidates to select targeted practice areas.

### In Scope
- Create, Read, Update, Delete departments.
- Associate subdomains to a parent department.
- List all departments with pagination.

### Out Of Scope
- Department-level user permissions.
- Department-specific SLAs or configuration settings.

---

## 2. User Story Traceability

| US-ID | Story | Acceptance Criteria |
|-------|-------|--------------------|
| US-007 | As a Content Admin, I want to create departments and subdomains so that interview content is organized by technical area. | Admin can create a department with a name and at least one subdomain. Duplicate department names rejected with 409. |

---

## 3. Functional Requirement Traceability

| FR-ID | Requirement | Status |
|-------|------------|--------|
| FR-009 | System must allow admins to create, update, list, and delete departments and subdomains via REST API. | Approved |

---

## 4. Inputs & Parameters

| Parameter | Type | Required | Validation Rules |
|-----------|------|----------|-----------------|
| name | String | Yes | Min 3 chars, max 100, unique |
| subdomain | String | Yes | Min 3 chars, max 100 |
| description | String | No | Max 500 chars |

---

## 5. Outputs & Results

### Success Response
- **API Response:** 201 Created with department object including UUID.
- **UI Behavior:** Admin sees new department in the DataGrid list.
- **Events Triggered:** `department_created` telemetry event.

### Failure Response
- **Validation Error:** 400 - Missing required field.
- **Business Error:** 409 - Duplicate department name.
- **System Error:** 500 - Database write failure.

---

## 6. API Responsibilities

| API-ID | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| API-03-01a | POST | `/api/v1/admin/departments` | Create department |
| API-03-01b | GET | `/api/v1/admin/departments` | List all departments |
| API-03-01c | PUT | `/api/v1/admin/departments/{id}` | Update department |
| API-03-01d | DELETE | `/api/v1/admin/departments/{id}` | Delete department |

### Request Payload (Create Department)

```json
{
  "name": "Mobile Development",
  "subdomain": "Android Development",
  "description": "Questions covering Android SDK, Jetpack, and Kotlin."
}
```

### Response Payload

```json
{
  "id": "dept-a1b2c3",
  "name": "Mobile Development",
  "subdomain": "Android Development",
  "createdAt": "2026-06-11T12:00:00Z"
}
```

---

## 7. Integration Boundaries

| Component | Dependency Type | Description |
|-----------|----------------|-------------|
| PostgreSQL | Database | Persist department and subdomain records |
| Spring Security | Auth | Admin role required (CONTENT_ADMIN or SUPER_ADMIN) |
| Elasticsearch | Search | Sync department/subdomain data for filtered search |

---

## 8. Error & Failure Scenarios

| Scenario | Detection | Handling | User Response |
|----------|-----------|----------|---------------|
| Duplicate department name | DB unique constraint | Return 409 | "A department with this name already exists." |
| Department not found on update/delete | JPA findById empty | Return 404 | "Department not found." |
| DB write failure | JPA exception | Return 500, alert SRE | "Failed to save department. Please retry." |

---

## 9. Test Case References

| TC-ID | Description | Type | Priority |
|-------|-------------|------|----------|
| TC-03-01-01 | Create department returns 201 with UUID | API | P0 |
| TC-03-01-02 | Duplicate name returns 409 | API | P0 |
| TC-03-01-03 | List departments returns paginated results | API | P1 |
| TC-03-01-04 | Delete department cascades subdomain removal | Integration | P1 |

---

## 10. KPI References

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|----------|--------|----------------|
| KPI-002 | Metadata Sync Success | 99% | `metadata_sync_success` |

---

## 11. Ownership

| Area | Owner |
|------|-------|
| Product | Product Manager |
| Backend | Spring Boot Developer |
| Frontend | React Web Developer |
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
| Department Management | US-007 | FR-009 | API-03-01a/b/c/d | TC-03-01-01 to TC-03-01-04 | KPI-002 |
