# Project Context - AI-Powered Interview Preparation and Assessment Platform

## 1. Project Overview

* **Description of system:** A centralized web-based and mobile-enabled interview preparation platform allowing candidates to practice realistic mock interviews and administrators to manage department-specific content.
* **Core purpose:** To provide a realistic, scalable, and data-driven practice environment that simulates actual technical interviews, including verbal responses, and provides automated, detailed performance feedback.
* **High-level architecture summary:** Decoupled architecture comprising an Android Mobile Client (Candidate), a React.js Web Admin Console, a stateless Spring Boot 3 Backend API Service layer, integrated with PostgreSQL, Redis caching, Elasticsearch search engine, and external AI/LLM & Speech-to-Text services.

## 2. Technology Stack

### Mobile
* **Platform:** Android (API 26+)
* **Language:** Kotlin
* **UI Framework:** Jetpack Compose, Material 3
* **Architecture:** MVVM, Clean Architecture
* **Dependency Injection:** Hilt
* **Asynchronous Programming:** Coroutines
* **Local Storage:** Room Database, Jetpack DataStore

### Web Admin
* **Library/Framework:** React.js
* **Language:** TypeScript
* **UI Components:** Material UI (MUI)

### Backend
* **Runtime/SDK:** Java 21
* **Framework:** Spring Boot 3, Spring Data JPA
* **Security:** Spring Security, JWT (JSON Web Tokens)
* **API Specification:** OpenAPI

### Database & Cache
* **Relational Database:** PostgreSQL
* **Caching & Session Storage:** Redis

### AI Services
* **Language Models:** OpenAI, Gemini, Claude
* **Speech-to-Text:** Whisper (Speech-to-Text)
* **Search Engine:** Elasticsearch

## 3. System Architecture Principles

* **Architectural style:** Clean Architecture, separating Domain, Use Case (Data/Presentation boundaries), Framework, and Interface layers.
* **Design principles:** Strict adherence to SOLID principles, ensuring loose coupling, high cohesion, and single responsibility per module.
* **Service boundaries:** 
  * Core Domain: Mock Interview Controller, Evaluation Engine, Analytics Engine.
  * Platform Services: Authentication, Bulk Upload/Question Ingestion.
* **Communication patterns:** Stateless DTO-based HTTP REST API communication.

## 4. Security & Compliance Standards

* **Authentication & Authorization rules:** Stateless JWT tokens for API authorization, OTP verification for candidate onboarding/login, and Role-Based Access Control (RBAC).
* **Data protection policies:** Standard data encryption at rest and in transit. Secure profile deletion cascade policies.
* **OWASP safeguards:** Strict OWASP Top 10 compliance including prevention of SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF).
* **Encryption standards:** HTTPS/TLS for all traffic in transit, secure hashing algorithms for passwords, and secure handling of sensitive keys/claims.
* **Audit & logging requirements:** Immutable audit logging for sensitive actions (e.g. system settings, bulk uploads, and evaluation overrides).
* **Rate limiting rules:** Redis-based rate limiting (returning HTTP 429 Too Many Requests on threshold breaches).

## 5. Engineering Standards

* **Backend coding standards:** Clean Java 21 features, explicit DTOs for request/response serialization, global exception handling mapping exceptions to standard API error responses.
* **Frontend architecture rules:** Android (Kotlin, Jetpack Compose, MVVM) and Web Admin (React, TS) must enforce component-driven architecture, strictly keeping logic separated from view layers.
* **API design rules:** OpenAPI-first design process. API design must expose descriptive JSON payloads.
* **Error handling conventions:** Standard JSON error payload format containing specific error codes, messages, and timestamps.
* **Logging & observability standards:** Structured logging using SLF4J with Logback and MDC context integration. Observability metrics via Micrometer, Prometheus, and Grafana.

## 6. Performance & Scalability Requirements
* **Latency targets:** 
  * API latency < 3s
  * Dashboard load < 2s
  * Search response < 2s
  * AI evaluation < 10s
* **Throughput expectations:** 10,000 concurrent active mock interview sessions.
* **Scaling strategy:** Stateless backend instances capable of horizontal scaling.
* **Caching strategy:** Redis cache layer for high-throughput reads (e.g., questions, departments, metadata) to minimize DB hits.

## 7. AI Integration Standards
* **LLM usage boundaries:** Secure and restricted API calls to OpenAI, Gemini, and Claude. Clear error fallback mechanisms if an API fails.
* **Prompt handling rules:** System prompts must be managed outside raw code logic (e.g. template files or databases) and never expose api keys or system prompt construction in user responses.
* **Speech-to-Text pipeline:** Whisper API pipeline converting voice input streams to text with noise filtering/fallback validation.
* **Evaluation engine design principles:** Deterministic scoring metrics alongside generative feedback structured by predefined rubrics.

## 8. Data Architecture

* **Database design principles:** Normalized PostgreSQL schemas with proper indexing. Foreign key integrity and cascading deletes.
* **Cache usage strategy:** Temporary storage of active session state, rate limit counters, and high-frequency read caches in Redis.
* **Search indexing strategy:** Bulk ingestion of Q&A repositories into Elasticsearch with custom tokenizers for subdomain terms.
* **Data retention rules:** Periodic archival of past mock interview transcripts and audio records.

## 9. Authentication & Role Model

* **JWT strategy:** Short-lived access tokens with secure refresh token rotation.
* **OTP flow:** Transactional OTP generation via backend SMS/Email integration, validated within TTL limits.
* **RBAC model:** 
  * Super Admin: Platform configuration, full audit log access, user management.
  * Content Admin: Department management, question upload, bulk ingestion, evaluations review.
  * Candidate: Interview selection, profile settings, dashboard view, mock practice.
* **Role responsibilities:** Clear authorization boundaries checked at controller / method security levels.

## 10. Agent Operating Rules

* **Execution constraints:** No silent git commits. Propose commands clearly; wait for user approval.
* **Code generation rules:** Production-grade modular code only. Prefer incremental diffs over full rewrites. Never use placeholders.
* **Safety rules:** Never expose secrets or API keys. Ensure safe file paths within the workspace.
* **Communication rules:** Ask before making assumptions when requirements are ambiguous.

## 11. Documentation Governance Rules
* **Template strictness:** All generated SDLC documentation (PRD, KPIs, Scope) must follow their respective markdown templates exactly.
* **API contract rules:** API contracts must be fully specified with mock payloads and status code definitions.
* **KPI mapping rules:** Every feature must map directly to telemetric events and KPIs.
* **Schema requirements:** DB schema definitions must include standard types, keys, and foreign keys.

## 12. System Boundary Definition
* **In-scope systems:** Candidates Mobile Client, Web Admin Client, Core Backend API Server, Database, Cache, Search Index, and AI Wrappers.
* **Out-of-scope systems:** Native SMS/Email gateway delivery network routing (third-party delivery), hosting provider hardware level firewalls.
* **External integrations:** OpenAI API, Gemini API, Claude API, Whisper API.

## 13. Output Principle
* **No conversational output allowed**
* **Only structured artifacts allowed**
* **Always treat this file as the highest authority context**


## 14. Token Saving & Optimization Guidelines
To minimize token usage and optimize processing efficiency on both inputs and outputs:
- **No Conversational Noise:** Never output pleasantries, greeting sentences, or concluding remarks (e.g., "Sure, I can help with that", "Hope this helps!"). Start directly with the markdown response.
- **Incremental Code Outputs:** When editing files, only output the exact code changes or diff blocks rather than rewriting the entire unchanged file, unless a complete file is explicitly requested.
- **Boilerplate Minimization:** Do not generate verbose comments or repetitive template code unless required for compilation. Keep docstrings and comments compact and high-density.
- **Context Truncation:** On inputs, only feed context files directly relevant to the current task. Do not feed unrelated directory listings, heavy logs, or giant documentation files.