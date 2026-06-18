# Prompt Log

## AI-Powered Interview Preparation and Assessment Platform — An AI-powered platform for simulated interview practice, automated grading, customized prep paths, and feedback.

---

## PROMPT 1 — Initialize Prompt Logger for the Project

**Output File:** `docs/Prompt_Log_Cross_Project.md`

---

### Prompt Content (Verbatim)

````text
I am starting on new feature for the AI-Powered Interview Preparation and Assessment Platform project. 
Please initialize the prompt logger for this project by reading and following the global instructions located at `C:\Users\md.adil\.gemini\config\skills\prompt_logger.md`
 
Establish the Role:
- Act as the AI Prompt Auditor & SDLC Log Custodian.
- Create the `docs/Prompt_Log_Cross_Project.md` file in the workspace root.
- Initialize it for the project: "{{Project Name}}" — "[Insert Project Description]".
- Keep this skill active and log all subsequent instructions/prompts automatically.
 
 
write this prompt for window
````

---

## PROMPT 2 — Analyze Codebase and Generate Project Analysis

**Output File:** `docs/PROJECT_ANALYSIS.md`

---

### Prompt Content (Verbatim)

````text
Analyze the complete codebase and generate:

1. Project architecture overview
2. Folder structure explanation
3. Existing modules and features
4. API integration flow
5. State management flow
6. Reusable components inventory
7. Navigation and routing flow
8. Design system and theme usage
9. Potential extension points for new features

Do not modify any code.

Generate a detailed docs/PROJECT_ANALYSIS.md document.
````

---

## PROMPT 3 — Create prd_v1.md based on enhancement.md

**Output File:** `docs/prd_v1.md`

---

### Prompt Content (Verbatim)

````text
ROLE
You are a senior product manager and technical business analyst working on an existing AI-Powered Interview Preparation and Assessment Platform.

CONTEXT
- New feature requirements are in @[docs/enhancement.md] 
- Existing PRD: doc/PRD.md — READ ONLY. Do not edit, rename, or move this file. Use it purely as a reference for structure, tone, and ID numbering scheme.

FORMAT
- Create exactly one new file: docs/prd_v1.md.
- Mirror prd.md's section structure exactly: Problem Statement, Solution Overview (Core Features), User Flow (diagram), API Design (request/response stubs only — full schema comes in a later step), Edge Cases (minimum 3 per feature), KPIs & Acceptance Criteria, Limitations, Data Privacy & Compliance, User Stories, Acceptance Criteria Matrix, Functional Requirements Matrix.
- Continue ID numbering from where prd.md leaves off — do not reuse or collide with existing MOD-IDs, FT-IDs, FR-IDs, or US-IDs. Scan prd.md first to find the highest existing number in each series before assigning new ones.
- Do not duplicate or restate existing features from prd.md; only document the NEW features from enhancement.md.

TASK
1. Parse docs/enhancement.md and extract the complete, distinct list of new features/capabilities being requested.
2. Scan doc/PRD.md to identify the current highest ID in each numbering series (MOD, FT, FR, US) and the exact table/header formatting conventions used.
3. Group related new features into one or more new Modules (MOD-xxx), consistent with how prd.md groups modules.
4. For every new feature, write: Problem Statement entry, Solution Overview entry, User Story (US-xxx), Functional Requirement(s) (FR-xxx), minimum 3 Edge Cases, and an Acceptance Criteria Matrix row.
5. Write the complete docs/prd_v1.md file.
6. End your response with a summary table: New Feature | MOD-ID | FT-ID | FR-ID(s) | US-ID(s) — so I can verify nothing was skipped before moving to the next step.

Do not modify docs/prd.md under any circumstances.
````

---

## PROMPT 4 — Define KPIs and Telemetry for prd_v1.md features

**Output File:** `docs/kpi_v1.md`

---

### Prompt Content (Verbatim)

````text
ROLE
You are a senior product analytics lead defining telemetry, SLAs (Service Level Agreement), and business KPIs for newly scoped product features.

CONTEXT
- @[docs/prd_v1.md]  (just created) — the source of truth for what features, modules, and FR/US IDs exist in this version.
- Existing KPI doc: doc/KPIs.md — READ ONLY. Do not edit, rename, or move this file. Use it purely as a reference for structure, telemetry-naming conventions, and ID numbering scheme.

FORMAT
- Create exactly one new file: docs/kpi_v1.md.
- Mirror kpi.md's section structure exactly: Document Control, Purpose, KPI Framework, KPI Categories, Module KPI Matrix (grouped by the new MOD-IDs from prd_v1.md), Business KPIs, SLA Metrics, Success Metrics, Traceability Matrix.
- Continue ID numbering from where kpi.md leaves off — do not reuse or collide with existing KPI-IDs or MOD-IDs. Scan kpi.md first to find the highest existing KPI-ID.
- Every row in the Module KPI Matrix and Traceability Matrix must reference an actual MOD-ID/FR-ID that exists in docs/prd_v1.md — no orphan KPIs.

TASK
1. Read @[docs/prd_v1.md]  fully and list every new module and functional requirement that needs telemetry/SLA coverage.
2. Scan docs/kpi.md to find the current highest KPI-ID and confirm the telemetry event-naming pattern (e.g. snake_case event names) and table column conventions.
3. For each new module, define: KPI ID, KPI Name & Description, Owner, Verification Method, Target Criteria, Telemetry Event/Log Source, Alert Route.
4. Add corresponding Business KPIs, SLA Metrics, and Success Metrics for any user-facing or platform-wide new capability.
5. Build the Traceability Matrix mapping each new KPI-ID back to its prd_v1.md Module/Feature and a business/product goal.
6. Write the complete docs/kpi_v1.md file.
7. End your response with a coverage check: confirm every MOD-ID introduced in prd_v1.md has at least one corresponding KPI-ID.

Do not modify docs/kpi.md under any circumstances.
````

---

## PROMPT 5 — Design API Contracts for new dashboard features

**Output File:** `docs/api_schema_design_v1.md`

---

### Prompt Content (Verbatim)

````text
ROLE
You are a senior backend API architect responsible for designing REST API contracts.

CONTEXT
- @[docs/prd_v1.md]  and @[docs/kpi_v1.md] — the source of truth for what to build and the SLAs each endpoint must meet.
- @[doc/backend_persona.md]  — defines tech stack, coding conventions, auth model, and architectural constraints to follow.
- Existing reference docs (READ ONLY, do not modify): docs/api-design.md and docs/api-schema.md — use these purely for structure, schema conventions (success/error envelope, pagination, JWT response shape), and API/Module-ID numbering scheme.

FORMAT
- Create exactly one new file: docs/api_schema_design_v1.md.
- This is the high-level/consolidated design doc only — NOT the detailed per-module files (those come in the next step). Mirror the structure of api-design.md/api-schema.md: Architecture Overview, Module → Feature → API Mapping table, Common Reusable Schemas, Security Design, SLA Summary (pulled from kpi_v1.md targets), Full API Catalog by Module (table form, one row per endpoint), Global Traceability Matrix (Module/Feature/Endpoint/KPI-ID/Telemetry Event), Role-to-Endpoint Access Matrix.
- Continue Module-ID and API-ID numbering from the highest existing value in api-design.md/api-schema.md — no collisions.

TASK
1. Cross-reference every FR-ID in prd_v1.md and every KPI-ID in kpi_v1.md to ensure every new feature gets at least one corresponding API endpoint with a matching SLA.
2. Apply the conventions in docs/backend-persona.md (auth pattern, error format, naming) consistently across all new endpoint listings.
3. Write the complete docs/api_schema_design_v1.md file.
4. End with a coverage check confirming every FR-ID from prd_v1.md maps to at least one endpoint in the API catalog, and every endpoint maps to a KPI-ID from kpi_v1.md.

Do not modify docs/api-design.md or docs/api-schema.md.
````

---

## PROMPT 6 — Detail new modules in docs/modules_v1/

**Output File:** `docs/modules_v1/module-28-dashboard-insights/`

---

### Prompt Content (Verbatim)

````text
ROLE
You are a senior full-stack tech lead breaking down a
product module into implementation-ready feature files.

CONTEXT
- docs/api_schema_design_v1.md, docs/prd_v1.md, docs/kpi_v1.md — the source of truth for endpoints, behavior, and SLAs.
- doc/backend-persona.md — tech stack and coding conventions to follow.
- Existing reference folder (READ ONLY, do not modify): doc/modules/ — use this purely as a template for how individual module files are structured, named, and formatted.

FORMAT
- Create a new folder docs/modules_v1/, with one markdown file per new module listed in docs/api_schema_design_v1.md, using the exact same naming convention and internal structure as files in doc/modules/.
- Each module file must include, per endpoint: Traceability (Module/Feature/User Story/Functional Requirement), Purpose, Authentication, Authorization, Request Schema, Validation Rules, Response Schema (success + error), Business Rules, Error Response Codes, Security, Performance SLA, Telemetry/Monitoring, Test Cases table (just IDs + short descriptions — full test code comes in the next step).

TASK
1. For each module in docs/api_schema_design_v1.md's Module → Feature → API Mapping table, create the corresponding file in docs/modules_v1/.
2. Pull exact request/response shapes from docs/api_schema_design_v1.md and expand them to full schemas with field-level validation rules.
3. Pull SLA targets and telemetry event names directly from docs/kpi_v1.md so they match exactly — no invented metrics.
4. Write all files into docs/modules_v1/.
5. End with a checklist confirming every module in docs/api_schema_design_v1.md's mapping table has a corresponding file in docs/modules_v1/.

Do not modify any file inside docs/modules/.
````

---

## PROMPT 7 — Create TDD test cases for dashboard insights

**Output File:** `testcases-v1/` and `docs/test-cases-log.md`

---

### Prompt Content (Verbatim)

````text
ROLE
You are a senior SDET practicing strict Test-Driven Development (write failing tests before any implementation exists).

CONTEXT
- docs/prd_v1.md, docs/kpi_v1.md, docs/api_schema_design_v1.md, docs/modules_v1/ — source of truth for behavior and SLAs.
- backend/src/test — READ ONLY. Inspect this folder for the existing test framework, assertion style, file/folder naming convention, and mocking patterns already used in this project, and replicate them exactly for consistency.

FORMAT
- Create a new folder testcases-v1/ at the same level/convention as backend/src/test, with one test file per new module/feature, using the same test framework and naming pattern already in use.
- Write a minimum of 10–15 test cases per feature, covering: happy path, validation failures, auth/authz failures, boundary conditions, and at least 2–3 explicit edge cases per feature (pulled from the Edge Cases sections of prd_v1.md and docs/modules_v1/).
- Create testcases-v1/test-cases-log.md containing a single markdown table with columns: Test ID | Module | Feature | Test Description | Type (Unit/Integration/Edge) | Expected Result | Status | Last Run Date | Notes.
- Since no backend implementation exists yet, every row's Status must be "FAIL" with Notes = "Not implemented".

TASK
1. For each module in docs/modules_v1/, derive test scenarios directly from its Request/Response Schema, Validation Rules, Business Rules, and Error Response Codes.
2. Write the actual test code in testcases-v1/, matching backend/src/test conventions.
3. Generate docs/test-cases-log.md with the full fail-state table described above.
4. Confirm in your response that these tests currently fail to compile/run only because the implementation doesn't exist yet (not due to malformed test code).

Do not modify any file under backend/src/test.
````

---

## PROMPT 8 — Run the testcases

**Output File:** N/A (execution command)

---

### Prompt Content (Verbatim)

````text
now run the testcase
````


