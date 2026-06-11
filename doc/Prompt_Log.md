# Prompt Log
## AI-Powered Interview Preparation and Assessment Platform — A centralized web-based interview preparation platform for realistic mock interviews and automated assessment feedback.

---

## PROMPT 1 — Initialize Prompt Logger

**Output File:** `Doc/Prompt_Log.md`

---
### Prompt Content (Verbatim)

````text
I am starting the AI-Powered Interview Preparation and Assessment Platform project. 
Please initialize the prompt logger for this project by reading and following the global instructions located at `/Users/apple/.gemini/config/skills/prompt-logger.md`

Establish the Role:
- Act as the AI Prompt Auditor & SDLC Log Custodian.
- Create the `Doc/Prompt_Log.md` file in the workspace root.
- Initialize it for the project: "{{Project Name}}" — "[Insert Project Description]".
- Keep this skill active and log all subsequent instructions/prompts automatically.
````

---

## PROMPT 2 — Generate Project Context

**Output File:** `Project_Context.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Principal Systems Architect and SDLC Governance Lead.

Task: Generate a `Project_Context.md` file that serves as the single source of truth for the entire engineering workspace. This file will be used by AI agents and developers to ensure consistent architecture, security, and implementation standards across all project documents and code generation tasks.

Constraint Rules:
* Output ONLY raw markdown content.
* Do not include explanations, commentary, or extra text.
* Ensure the document is reusable across all SDLC artifacts (PRD, KPIs, Scope, Architecture, Code).
* Normalize all inputs into a clean, structured system context.
* Avoid duplication and ensure strict clarity.

---

### INPUT DATA FOR THIS RUN:

* **Project Name:** AI-Powered Interview Preparation and Assessment Platform

* **Frontend (Mobile):** Android (Kotlin, Jetpack Compose, MVVM, Clean Architecture, Hilt, Coroutines, Room, DataStore, Material 3)

* **Frontend (Web Admin):** React.js + TypeScript + Material UI

* **Backend:** Java 21, Spring Boot 3, Spring Security, Spring Data JPA, JWT, OpenAPI

* **Database & Cache:** PostgreSQL + Redis

* **Search Engine:** Elasticsearch

* **AI Services:** OpenAI, Gemini, Claude, Whisper (Speech-to-Text)

* **Authentication Model:** JWT, OTP, RBAC

* **User Roles:** Super Admin, Content Admin, Candidate

* **Core Domain:** AI-based mock interviews, evaluation engine, analytics dashboard, question repository system

* **Security Requirements:**

  * OWASP Top 10 Compliance
  * HTTPS/TLS encryption
  * SQL Injection prevention
  * XSS/CSRF protection
  * Secure file uploads with validation
  * Data encryption at rest and in transit
  * Audit logging for sensitive actions
  * Rate limiting (Redis-based, HTTP 429)

* **Engineering Standards:**
  * Clean Architecture (strict separation of concerns)
  * SOLID principles
  * DTO-based API communication
  * Global exception handling
  * OpenAPI-first API design
  * Structured logging (SLF4J + Logback + MDC)
  * Observability via Micrometer + Prometheus + Grafana

* **Performance Requirements:**
  * API latency < 3s
  * AI evaluation < 10s
  * Dashboard load < 2s
  * Search response < 2s

* **Scalability Requirements:**
  * 100,000+ users
  * 10,000 concurrent sessions
  * Stateless backend services
  * Redis caching layer for performance

* **Agent Constraints:**
  * No silent git commits
  * Ask before executing terminal commands
  * No assumptions without clarification
  * Generate production-grade modular code only
  * Never expose secrets or API keys
  * Prefer incremental diffs over full rewrites
  * Always follow architecture-first approach

---

### OUTPUT TEMPLATE (FOLLOW STRICTLY)

# Project Context - [Project Name]

## 1. Project Overview

* Description of system
* Core purpose
* High-level architecture summary

## 2. Technology Stack

### Mobile

### Web Admin

### Backend

### Database & Cache

### AI Services

## 3. System Architecture Principles

* Architectural style
* Design principles
* Service boundaries
* Communication patterns

## 4. Security & Compliance Standards

* Authentication & Authorization rules
* Data protection policies
* OWASP safeguards
* Encryption standards
* Audit & logging requirements
* Rate limiting rules

## 5. Engineering Standards

* Backend coding standards
* Frontend architecture rules
* API design rules
* Error handling conventions
* Logging & observability standards

## 6. Performance & Scalability Requirements
* Latency targets
* Throughput expectations
* Scaling strategy
* Caching strategy

## 7. AI Integration Standards
* LLM usage boundaries
* Prompt handling rules
* Speech-to-text pipeline
* Evaluation engine design principles

## 8. Data Architecture

* Database design principles
* Cache usage strategy
* Search indexing strategy
* Data retention rules

## 9. Authentication & Role Model

* JWT strategy
* OTP flow
* RBAC model
* Role responsibilities

## 10. Agent Operating Rules

* Execution constraints
* Code generation rules
* Safety rules
* Communication rules

## 11. Documentation Governance Rules
* Template strictness
* API contract rules
* KPI mapping rules
* Schema requirements

## 12. System Boundary Definition
* In-scope systems
* Out-of-scope systems
* External integrations

## 13. Output Principle
* No conversational output allowed
* Only structured artifacts allowed
* Always treat this file as the highest authority context
````

---

## PROMPT 3 — Generate Product Requirement Document (PRD)

**Output File:** `doc/PRD.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Product Manager specializing in developer-facing documentation.

Task: Generate a PRD in Markdown format from the provided BRD.

Context:
project context : @[Project_Context.md] 

Inputs:
- BRD Details: @[brd_statement] 
- Minimum OS/API Requirement: [Android API 26+]

Output Structure:

# PRD - {PROJECT_NAME}

## 1. Problem Statement
## 2. Solution Overview
### Core Features
- [Feature]: [Description]

## 3. User Flow
```
[Screen A] --> [Screen B]
```

## 4. API Design
### 4.N. [Action]
- Endpoint: METHOD /path
- Request Payload: `{}`
- Response Payload: `{}`
### Standard Error Schemas
[400 and 401 JSON schemas]

## 5. Edge Cases (minimum 3)
### 5.N. [Case]
- Case: [Description]
- Handling: [Approach]

## 6. KPIs & Acceptance Criteria
## 7. Limitations
## 8. Data Privacy & Compliance (GDPR / CCPA)
## 9. User Stories
[US-00N: As a [user], I want to [action], so that [outcome]]

## 10. Acceptance Criteria Matrix
| Feature | Acceptance Criteria |

## 11. Functional Requirements Matrix
| FR-ID | Module / Feature | Description |
````

---

## PROMPT 4 — Generate Key Performance Indicators (KPIs)

**Output File:** `doc/KPIs.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Product Analytics Manager and SRE.

Task: Generate a KPIs document using the PRD @[doc/PRD.md] .

Context : @[Project_Context.md] 

Inputs:
- PRD features list: [paste from docs/prd.md]


Output Structure:

# KPIs - {PROJECT_NAME}

## 1. Document Control
## 2. Purpose
## 3. KPI Framework
## 4. KPI Categories
## 5. Module KPI Matrix
[Group the 27 features into 12 distinct modules and document KPIs for each module]
## 6. Business KPIs
## 7. SLA Metrics
## 8. Success Metrics
## 9. Traceability Matrix
````

---

## PROMPT 5 — Generate Project Scope

**Output File:** `doc/Project_Scope.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Technical Program Manager and Systems Architect.

Task: Generate a Project Scope document from the PRD @[doc/PRD.md]  and KPIs @[doc/KPIs.md] .

Context : @[Project_Context.md] 

Inputs:
- Development Timeline: [e.g., 6 weeks]
- Team Roles: [e.g., PM, Architect, Android Dev, Spring Boot Dev, QA, DevOps]

Output Structure:

# Project Scope - {PROJECT_NAME}

## 1. Document Control
## 2. Project Description & Objectives

## 3. System Architecture Diagram
```mermaid
graph TD
    [Map: client → API → DB → cache → queue]
```

## 4. In-Scope Deliverables
### Phase 1: MVP
### Phase 2: [Next phase]

## 5. Release Plan
[MVP → v1.0 → v1.1 → v2.0 roadmap]

## 6. Deployment Architecture
[Frontend channel, backend hosting, DB, Redis, alerting]

## 7. RACI Matrix
| Deliverable | PM | Architect | Android Dev | Spring Boot Dev | QA | DevOps |

## 8. Milestones & Timeline
| Milestone | Description | Target Date | Owner |
````

---

## PROMPT 6 — Generate Project Boundaries

**Output File:** `doc/Project_Boundaries.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Lead Software Architect.

Task: Generate a Project Boundaries document to prevent scope creep.

Context : @[Project_Context.md] 

Output Structure:

# Project Boundaries - {PROJECT_NAME}

## 1. Document Control
## 2. Definition & Objectives
## 3. Explicit Exclusions (Out of Scope)
## 4. Technical & Architectural Constraints
[Numerical limits: DB size, upload caps, throttle rates]

## 5. Security & Compliance Boundaries
[PCI-DSS scope, field-level encryption, JWT constraints]

## 6. Assumption Register
## 7. Dependency Register
[Third-party APIs, packages, frameworks]

## 8. Scope Change Management Protocol
[Submission → Impact Assessment → Approval threshold → Doc update]

## 9. Legacy Assumptions & Support Policy
````

---

## PROMPT 7 — Generate Project Personas

**Output File:** `doc/frontend_mobile_persona.md`, `doc/frontend_web_persona.md`, `doc/backend_persona.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Principal Systems Architect.

Task:
Generate THREE .md files in a single response:
1. Frontend Mobile Persona (Candidate App)
2. Frontend Web Persona (Admin Dashboard)
3. Backend Persona (Core System Architecture)

---

PROJECT CONTEXT
Project Name: {PROJECT_NAME}

Primary Candidate Screens (Mobile):
{MOBILE_SCREENS}

Primary Admin Screens (Web):
{WEB_SCREENS}

Key Entities to Model:
{KEY_ENTITIES}

Technical Constraints:
- @[Project_Context.md] 
---

OUTPUT FORMAT (STRICT)

Generate exactly 3 sections:

---

# 1. docs/frontend_mobile_persona.md

Include:

## Persona Profile
- Device assumptions
- UI toolkit
- User type

## Screen Wireframes (for each screen)
For each screen include:
- Primary goal
- Layout hierarchy
- Interaction flow (Mermaid diagram)
- Animations & transitions

## Styling (Material Design 3)
- Color system
- Typography system

## Component States
- Button / Input / Card states

## Empty States
- No data, offline, no permission

## Error States
- 401 / 403 / timeout / network failure

## Responsive Breakpoints
- Compact / Medium / Expanded

## Accessibility
- Touch targets, semantics, screen reader support

---

# 2. docs/frontend_web_persona.md

Include:

## Persona Profile
- Platform
- Framework
- UI library

## Screen Wireframes (Admin screens)
For each screen include:
- Primary goal
- Layout structure
- Data flow
- Mermaid diagram

## Styling System
- Colors
- Typography

## Component States
- Table, modal, button states

## Empty States
- No records, no results, empty dashboards

## Error States
- 400 / 401 / 403 / 404 / 500

## Responsive Breakpoints
- Mobile / Tablet / Desktop

## Accessibility
- ARIA roles
- Keyboard navigation
- Focus management

---

# 3. docs/backend_persona.md

Include:

## System Profile
- Framework
- Language
- DB
- Auth model

## Validation Layer
- DTO examples (Java records)
- Constraints

## Database Schema (PostgreSQL)
- Tables with UUID primary keys
- Foreign keys
- Indexes

## Rate Limiting
- Endpoint-based limits
- 429 response format

## Security Standards
- OWASP Top 10
- JWT rotation
- Password hashing
- CSRF protection

## Logging Standards
- SLF4J levels
- MDC correlation ID

## Monitoring
- CPU, RAM, latency, DB thresholds

## Disaster Recovery
- RPO / RTO
- backup strategy
- replication

## Async Jobs
- Job list with triggers
- concurrency control strategy

---

FORMATTING RULES
- Use clean Markdown
- Use Mermaid diagrams for flows
- Use code blocks for SQL and Java
- Be production-grade and implementation ready
- Avoid generic explanations; be specific and structured
- Ensure consistency across all 3 personas

---
````

---

## PROMPT 8 — Generate Module Documentation Package

**Output File:** `doc/modules/module-*/` (Multiple files)

---
### Prompt Content (Verbatim)

````text
System Role: You are a Principal Systems Architect, Product Owner, Solution Architect, QA Lead, and Technical Documentation Expert.

Task: Generate a complete Module Documentation Package for the provided PRD @[doc/PRD.md].

The output must create documentation files following the required folder structure. Generate:
1. Module Overview document
2. Individual Feature documents
3. Full traceability from Module → Feature → User Story → Functional Requirement → API → Test Case → KPI

No orphan references are allowed.

Modules generated:
- MOD-01: Authentication (_module-overview, feature-01-otp-login, feature-02-jwt-token-management)
- MOD-03: Organization Management (_module-overview, feature-01-department-management)
- MOD-06: Content Management (_module-overview, feature-01-bulk-question-ingestion)
- MOD-09: Interview Session (_module-overview, feature-01-session-initialization, feature-02-voice-input-stt)
- MOD-14: AI Evaluation (_module-overview, feature-01-ai-evaluation-engine)
- MOD-18: Analytics Dashboard (_module-overview, feature-01-candidate-performance-dashboard)
- MOD-22: Compliance & Audit (_module-overview, feature-01-audit-logging)
````

---

## PROMPT 9 — Verify & Complete All 27 Modules + Generate API Schema

**Output File:** `doc/modules/module-[02..27]/` (20 new modules), `doc/api-schema.md`

---
### Prompt Content (Verbatim)

````text
System Role: You are a Principal Backend Architect and API Designer.

Task: Generate a global API Schema Overview document (`api-schema.md`) in Markdown format covering architecture, authentication strategy, common reusable schemas, and the full module-to-API mapping table.

Constraint Rules:
- Output ONLY the requested Markdown content without any conversational intro or concluding text.
- Keep schemas FIRST priority. Avoid long explanations. No unnecessary theory.
- Every API listed MUST trace back to a Module → Feature → User Story (no orphan APIs).

INPUT: @[Project_Context.md] @[doc/Project_Scope.md] @[doc/Project_Boundaries.md]
Modules: /doc/modules (all 27)

Actions performed:
1. Gap analysis identified 20 missing module directories.
2. Created missing modules MOD-02 through MOD-27 (excluding pre-existing MOD-01, MOD-03, MOD-14, MOD-18, MOD-22).
3. Removed incorrectly bundled legacy folders (module-06-content-management, module-09-interview-session).
4. All 27 modules now correctly numbered and individually documented.
5. Generated doc/api-schema.md with 57 API endpoints across 27 modules with full KPI traceability.
````

---
