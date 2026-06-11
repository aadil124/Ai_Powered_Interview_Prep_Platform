# Test Cases Log — AI-Powered Interview Preparation and Assessment Platform

**Last Updated:** 2026-06-11
**Total Tests:** 74 | **Passing:** 0 | **Failing:** 74 | **Skipped:** 0

---

## Summary Dashboard

| Module | Total | ✅ Pass | ❌ Fail | ⏭ Skip |
| :--- | :---: | :---: | :---: | :---: |
| MOD01: Authentication | 15 | 0 | 15 | 0 |
| MOD02: User Profile | 10 | 0 | 10 | 0 |
| MOD03: Department Management | 13 | 0 | 13 | 0 |
| MOD04: Technology Management | 1 | 0 | 1 | 0 |
| MOD05: Experience Level Management | 1 | 0 | 1 | 0 |
| MOD06: Question Repository | 3 | 0 | 3 | 0 |
| MOD07: Bulk Upload | 7 | 0 | 7 | 0 |
| MOD08: Categorization Engine | 1 | 0 | 1 | 0 |
| MOD09: Interview Configuration | 1 | 0 | 1 | 0 |
| MOD10: Interview Session | 1 | 0 | 1 | 0 |
| MOD11: Question Delivery | 1 | 0 | 1 | 0 |
| MOD12: Voice Recording | 1 | 0 | 1 | 0 |
| MOD13: Speech-To-Text | 1 | 0 | 1 | 0 |
| MOD14: AI Evaluation | 1 | 0 | 1 | 0 |
| MOD15: Scoring Engine | 1 | 0 | 1 | 0 |
| MOD16: Feedback Engine | 1 | 0 | 1 | 0 |
| MOD17: Reporting | 1 | 0 | 1 | 0 |
| MOD18: Dashboard | 1 | 0 | 1 | 0 |
| MOD19: Recommendation Engine | 1 | 0 | 1 | 0 |
| MOD20: Analytics | 1 | 0 | 1 | 0 |
| MOD21: Notifications | 1 | 0 | 1 | 0 |
| MOD22: Audit Logs | 1 | 0 | 1 | 0 |
| MOD23: Admin Portal | 1 | 0 | 1 | 0 |
| MOD24: File Storage | 1 | 0 | 1 | 0 |
| MOD25: Search & Filtering | 1 | 0 | 1 | 0 |
| MOD26: AI Prompt Management | 1 | 0 | 1 | 0 |
| MOD27: Configuration Management | 1 | 0 | 1 | 0 |
| Security & Cross-Cutting | 3 | 0 | 3 | 0 |
| Performance Tests | 1 | 0 | 1 | 0 |
| **TOTAL** | 74 | 0 | 74 | 0 |

---

## MOD01: Authentication

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-01-01-01 | OTP Login | Valid email — OTP dispatched | Integration | High | ❌ FAIL | Pending impl |
| TC-01-01-02 | OTP Login | Valid phone — OTP dispatched | Integration | High | ❌ FAIL | Pending impl |
| TC-01-01-03 | OTP Login | Invalid email format | Integration | High | ❌ FAIL | Pending impl |
| TC-01-01-04 | OTP Login | 6th request within 10 minutes | Integration | High | ❌ FAIL | Pending impl |
| TC-01-01-05 | OTP Login | Valid OTP within TTL | Integration | High | ❌ FAIL | Pending impl |
| TC-01-01-06 | OTP Login | Expired OTP | Security | High | ❌ FAIL | Pending impl |
| TC-01-01-07 | OTP Login | Already used OTP (replay) | Security | High | ❌ FAIL | Pending impl |
| TC-01-01-08 | OTP Login | Wrong OTP | Security | High | ❌ FAIL | Pending impl |
| TC-01-02-01 | JWT Token Management | Valid refresh token | Integration | High | ❌ FAIL | Pending impl |
| TC-01-02-02 | JWT Token Management | Expired refresh token | Security | High | ❌ FAIL | Pending impl |
| TC-01-02-03 | JWT Token Management | Reuse of rotated (old) token | Security | High | ❌ FAIL | Pending impl |
| TC-01-02-04 | JWT Token Management | Malformed JWT string | Integration | High | ❌ FAIL | Pending impl |
| TC-01-02-05 | JWT Token Management | Valid JWT + refresh token | Integration | High | ❌ FAIL | Pending impl |
| TC-01-02-06 | JWT Token Management | Missing Authorization header | Security | High | ❌ FAIL | Pending impl |
| TC-01-02-07 | JWT Token Management | Token reuse after logout | Security | High | ❌ FAIL | Pending impl |

---

## MOD02: User Profile

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-02-01-01 | Candidate Profile Management | Valid JWT — own profile | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-02 | Candidate Profile Management | No JWT | Security | High | ❌ FAIL | Pending impl |
| TC-02-01-03 | Candidate Profile Management | Valid JWT but profile deleted | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-04 | Candidate Profile Management | Update name only | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-05 | Candidate Profile Management | Duplicate email | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-06 | Candidate Profile Management | Invalid phone format | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-07 | Candidate Profile Management | Empty body | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-08 | Candidate Profile Management | Valid delete | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-09 | Candidate Profile Management | Sessions, answers, audio removed | Integration | High | ❌ FAIL | Pending impl |
| TC-02-01-10 | Candidate Profile Management | No JWT | Security | High | ❌ FAIL | Pending impl |

---

## MOD03: Department Management

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-03-01-01 | Department Management | Valid creation | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-02 | Department Management | Duplicate name | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-03 | Department Management | Missing name field | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-04 | Department Management | CANDIDATE role attempt | Security | High | ❌ FAIL | Pending impl |
| TC-03-01-05 | Department Management | List departments — results exist | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-06 | Department Management | No departments yet | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-07 | Department Management | CANDIDATE role | Security | High | ❌ FAIL | Pending impl |
| TC-03-01-08 | Department Management | Valid update | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-09 | Department Management | Department not found | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-10 | Department Management | Duplicate name | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-11 | Department Management | SUPER_ADMIN deletes existing dept | Integration | High | ❌ FAIL | Pending impl |
| TC-03-01-12 | Department Management | CONTENT_ADMIN attempts delete | Security | High | ❌ FAIL | Pending impl |
| TC-03-01-13 | Department Management | Department not found | Integration | High | ❌ FAIL | Pending impl |

---

## MOD04: Technology Management

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD04-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD05: Experience Level Management

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD05-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD06: Question Repository

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-06-01-01 | Question CRUD & Search | Valid question creation | Integration | High | ❌ FAIL | Pending impl |
| TC-06-01-02 | Question CRUD & Search | Missing questionText | Integration | High | ❌ FAIL | Pending impl |
| TC-06-01-03 | Question CRUD & Search | Invalid departmentId | Integration | High | ❌ FAIL | Pending impl |

---

## MOD07: Bulk Upload

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-07-01-01 | Document Upload Pipeline | Valid DOCX ingest trigger | Integration | High | ❌ FAIL | Pending impl |
| TC-07-01-02 | Document Upload Pipeline | File > 50MB | Integration | High | ❌ FAIL | Pending impl |
| TC-07-01-03 | Document Upload Pipeline | Unsupported file type (CSV) | Integration | High | ❌ FAIL | Pending impl |
| TC-07-01-04 | Document Upload Pipeline | Invalid departmentId | Integration | High | ❌ FAIL | Pending impl |
| TC-07-01-05 | Document Upload Pipeline | Poll PROCESSING task | Integration | High | ❌ FAIL | Pending impl |
| TC-07-01-06 | Document Upload Pipeline | Poll COMPLETED task | Integration | High | ❌ FAIL | Pending impl |
| TC-07-01-07 | Document Upload Pipeline | Invalid taskId | Integration | High | ❌ FAIL | Pending impl |

---

## MOD08: Categorization Engine

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD08-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD09: Interview Configuration

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD09-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD10: Interview Session

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD10-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD11: Question Delivery

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD11-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD12: Voice Recording

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD12-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD13: Speech-To-Text

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD13-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD14: AI Evaluation

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD14-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD15: Scoring Engine

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD15-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD16: Feedback Engine

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD16-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD17: Reporting

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD17-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD18: Dashboard

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD18-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD19: Recommendation Engine

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD19-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD20: Analytics

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD20-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD21: Notifications

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD21-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD22: Audit Logs

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD22-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD23: Admin Portal

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD23-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD24: File Storage

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD24-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD25: Search & Filtering

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD25-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD26: AI Prompt Management

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD26-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## MOD27: Configuration Management

| TC ID | Feature | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-MOD27-001 | Default Feature | Default GET test | Integration | High | ❌ FAIL | Pending impl |

---

## Security & Cross-Cutting Tests

| TC ID | Scope | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SEC-001 | Global | SQL injection attempt blocked | Security | Critical | ❌ FAIL | Pending impl |
| TC-SEC-002 | Global | XSS payload sanitized | Security | Critical | ❌ FAIL | Pending impl |
| TC-RATE-001 | Global | Rate limit exceeded returns 429 | Integration | High | ❌ FAIL | Pending impl |

---

## Performance Tests

| TC ID | Scope | Test Description | Target SLA | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-PERF-001 | Global | P95 latency < 300ms under 1000 users | P95 < 300ms | High | ❌ FAIL | Pending impl |

---

## Change Log
| Date | TC ID | Change | Author |
| :--- | :--- | :--- | :--- |
| 2026-06-11 | ALL | Initial creation — all FAIL | Antigravity |

# Test Execution Report

**Date:** 2026-06-11 21:49:15

**Command:** mvn clean test

## Result
- **Tests run:** 70
- **Failures:** 0
- **Errors:** 0
- **Skipped:** 0

## Status
All tests passed successfully
