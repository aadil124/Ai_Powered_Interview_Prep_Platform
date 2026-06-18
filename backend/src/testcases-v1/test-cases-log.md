# Test Cases Log - AI-Powered Interview Preparation and Assessment Platform

| Test ID | Module | Feature | Test Description | Type (Unit/Integration/Edge) | Expected Result | Status | Last Run Date | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-28-01-01** | MOD-28 | FT-28-01 | Happy path request with default parameters | Unit / API | 200 OK with paginated list of candidates and success = true | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-02** | MOD-28 | FT-28-01 | Filter by departmentId | Unit / API | 200 OK with candidates filtered by departmentId | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-03** | MOD-28 | FT-28-01 | Filter by technologyId | Unit / API | 200 OK with candidates filtered by technologyId | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-04** | MOD-28 | FT-28-01 | Sort by score descending | Unit / API | 200 OK with candidates sorted by score descending | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-05** | MOD-28 | FT-28-01 | Sort by score ascending | Unit / API | 200 OK with candidates sorted by score ascending | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-06** | MOD-28 | FT-28-01 | Sort by attended count descending | Unit / API | 200 OK with candidates sorted by interview count descending | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-07** | MOD-28 | FT-28-01 | Invalid departmentId UUID format validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-08** | MOD-28 | FT-28-01 | Invalid technologyId UUID format validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-09** | MOD-28 | FT-28-01 | Invalid sortBy parameter validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-10** | MOD-28 | FT-28-01 | Page parameter < 1 validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-11** | MOD-28 | FT-28-01 | Limit parameter < 1 validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-12** | MOD-28 | FT-28-01 | Limit parameter > 100 validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-13** | MOD-28 | FT-28-01 | Anonymous request security check | Security | 401 Unauthorized due to missing JWT token | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-14** | MOD-28 | FT-28-01 | Candidate role request authorization check | Security | 403 Forbidden due to insufficient role permissions | FAIL | 2026-06-18 | Not implemented |
| **TC-28-01-15** | MOD-28 | FT-28-01 | Rate limit threshold hit edge case | Edge | 429 Too Many Requests with retryAfterSeconds header | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-01** | MOD-28 | FT-28-02 | Happy path request with limit parameter | Unit / API | 200 OK with list of improved candidates and success = true | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-02** | MOD-28 | FT-28-02 | Limit parameter < 1 validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-03** | MOD-28 | FT-28-02 | Limit parameter > 50 validation | Unit / API | 400 Bad Request with field-level validation errors | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-04** | MOD-28 | FT-28-02 | Anonymous request security check | Security | 401 Unauthorized due to missing JWT token | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-05** | MOD-28 | FT-28-02 | Candidate role request authorization check | Security | 403 Forbidden due to insufficient role permissions | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-06** | MOD-28 | FT-28-02 | Candidates with only 1 session completed are excluded | Edge | 200 OK; single-session candidates omitted from progression list | FAIL | 2026-06-18 | Not implemented |
| **TC-28-02-07** | MOD-28 | FT-28-02 | Candidates with flat or negative progression delta are filtered | Edge | 200 OK; negative/flat progression candidates omitted from list | FAIL | 2026-06-18 | Not implemented |
