# Project Boundaries - AI-Powered Interview Preparation and Assessment Platform

## 1. Document Control
- **Project Name:** AI-Powered Interview Preparation and Assessment Platform
- **Document Version:** 1.0.0
- **Date:** 2026-06-11
- **Status:** Draft

## 2. Definition & Objectives
This document establishes the strict boundaries, constraints, and exclusions for the development and operation of the AI-Powered Interview Preparation and Assessment Platform. Its primary objective is to prevent scope creep, ensure alignment with the overarching architectural context, and provide clear guardrails for AI agents and human developers regarding what is *not* to be built or supported.

## 3. Explicit Exclusions (Out of Scope)
The following features and capabilities are strictly out of scope for the current system:
- Real-time video interview hosting or recording.
- Live human-to-human interview matching or coordination.
- Candidate resume parsing, job application tracking, or recruiter portal features.
- Native iOS client application (only Android API 26+ is supported).
- Offline mock interview support (an active internet connection is required).
- Custom internal LLM training or fine-tuning (only third-party AI APIs will be utilized).

## 4. Technical & Architectural Constraints
- **Upload Caps:** Bulk Q&A ingestion files (PDF/DOCX/TXT) are strictly capped at 50MB per file.
- **Audio Capture Caps:** Candidate voice responses are limited to a maximum of 120 seconds per question.
- **Throttle Rates:** API requests are rate-limited via Redis to 100 requests per minute per IP to prevent abuse and API exhaustion.
- **Scaling Limits:** The backend architecture must be designed to support a maximum of 10,000 concurrent active mock interview sessions.
- **Latency Constraints:** API response times must remain under 3 seconds, and AI evaluation generation must remain under 10 seconds.

## 5. Security & Compliance Boundaries
- **Authentication Scope:** Stateless JWTs with short-lived access tokens and secure refresh token rotation.
- **Data Encryption:** TLS 1.2+ mandatory for all data in transit. AES-256 encryption for data at rest, specifically for stored audio files and generated evaluation reports.
- **Compliance:** Full OWASP Top 10 compliance. The system does not handle payment or financial data, hence PCI-DSS compliance is out of scope.
- **Data Retention:** Audio files must be hard-deleted via automated cascade policies 30 days post-evaluation.

## 6. Assumption Register
- Candidates have access to Android devices running API level 26 or higher with functional microphones.
- Administrators possess properly formatted Q&A documents for bulk ingestion.
- The external AI and Speech-to-Text APIs (OpenAI, Gemini, Claude, Whisper) will maintain their documented uptime SLAs and response formats.
- The provided architecture (Clean Architecture, MVVM for Android, stateless Spring Boot backend) is sufficient to meet the scalability requirements.

## 7. Dependency Register
- **Frontend (Mobile):** Android SDK, Kotlin, Jetpack Compose, Material 3, Hilt, Coroutines, Room, DataStore.
- **Frontend (Web):** React.js, TypeScript, Material UI.
- **Backend:** Java 21, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, OpenAPI.
- **Data & Cache:** PostgreSQL, Redis, Elasticsearch.
- **External AI:** OpenAI API, Gemini API, Claude API, Whisper Speech-to-Text API.

## 8. Scope Change Management Protocol
Any proposed addition, modification, or removal of features/constraints must follow this protocol:
1. **Submission:** The requester submits a documented scope change proposal detailing the business justification.
2. **Impact Assessment:** The PM and Lead Architect review the proposal to assess the impact on timeline, budget, technical debt, and system boundaries.
3. **Approval Threshold:** Changes require explicit sign-off from both the Technical Program Manager and the Lead Systems Architect.
4. **Documentation Update:** If approved, this Project Boundaries document, along with the PRD and KPIs, must be updated and versioned before any development begins.

## 9. Legacy Assumptions & Support Policy
- **Legacy Systems:** There are no legacy data migration requirements; this is a greenfield project.
- **OS Support:** Devices running Android OS versions below API 26 will not be supported or provided with backward compatibility patches.
- **API Versioning:** The API follows a strict `/api/v1/` versioning strategy. Deprecation of v1 endpoints requires a minimum 6-month notice period before sunsetting.
