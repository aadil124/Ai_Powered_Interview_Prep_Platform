# PRD - AI-Powered Interview Preparation and Assessment Platform

## 1. Problem Statement
Job seekers and working professionals struggle to prepare effectively for technical interviews due to the lack of realistic, interactive practice environments, structured question repositories, and targeted feedback. Existing platforms focus on static questions and multiple-choice tests, which fail to simulate real interview scenarios where candidates must explain complex concepts verbally. Consequently, candidates face a major gap in verbal communication confidence and real-time knowledge assessment under simulated pressure.

## 2. Solution Overview
The AI-Powered Interview Preparation and Assessment Platform is a centralized web and mobile system that facilitates realistic interview practice. Administrators manage content and subdomains via a web console, while candidates utilize a mobile application to practice randomized mock interviews via voice or text input, obtaining instant AI-driven grading, progress analytics, and constructive feedback.

### Core Features
- **Department & Subdomain Management**: Administrative capability to partition interview content into specific domains (e.g., Mobile Development, Web Development, Backend Development, Database Technologies).
- **Bulk Question Ingestion**: Administrative bulk upload system supporting PDF, DOCX, and TXT files, with automatic parser extraction, categorization, and indexing.
- **Interactive Mock Interviews**: Candidate interview session builder filtering by department, difficulty level, and question count, delivering randomized questions.
- **Dual-Input Mode**: Real-time response entry via direct text keyboard input or integrated Whisper-driven voice-to-text transcription.
- **AI Evaluation Engine**: Automated scoring using LLMs based on predefined criteria, providing detailed analytics, strengths/weaknesses identification, and progress tracking.

## 3. User Flow
```
[Admin Web Console] ----> [Uploads QA Document (PDF/DOCX/TXT)] ----> [System Extracts/Indexes Questions]
                                                                                |
                                                                                v
[Candidate Mobile Client] --> [Login / Select Dept & Level] --> [Initialize Mock Session]
                                                                                |
                                                                                v
[Start Assessment Loop] <--- [Randomized Question Displayed] <--- [Voice / Text Input response]
        |
        v
[Complete Session] --> [AI Evaluation Processing] --> [View Feedback & Strengths Report]
```

## 4. API Design

### 4.1. Bulk Question Ingestion
- Endpoint: POST `/api/v1/admin/questions/ingest`
- Request Payload:
```json
{
  "departmentId": "dept-123",
  "subdomain": "Mobile Development",
  "fileUrl": "https://storage.platform.com/uploads/qa_android.docx"
}
```
- Response Payload:
```json
{
  "taskId": "task-abc-987",
  "status": "PROCESSING",
  "message": "Bulk ingestion task initialized successfully."
}
```

### 4.2. Initialize Mock Session
- Endpoint: POST `/api/v1/interviews/sessions`
- Request Payload:
```json
{
  "departmentId": "dept-123",
  "experienceLevel": "MID_LEVEL",
  "questionCount": 5,
  "inputMode": "VOICE"
}
```
- Response Payload:
```json
{
  "sessionId": "session-xyz-456",
  "status": "INITIALIZED",
  "questions": [
    {
      "questionId": "q-001",
      "text": "Explain the difference between MVVM and Clean Architecture in Android."
    },
    {
      "questionId": "q-002",
      "text": "What is the purpose of Hilt in Kotlin-based development?"
    }
  ]
}
```

### 4.3. Submit Response
- Endpoint: POST `/api/v1/interviews/sessions/session-xyz-456/answers`
- Request Payload:
```json
{
  "questionId": "q-001",
  "responseType": "AUDIO",
  "audioUrl": "https://storage.platform.com/audio/response_001.wav",
  "transcribedText": "MVVM separates the UI logic from the business logic using a ViewModel, whereas Clean Architecture introduces strict boundary layers like Use Cases and Entities."
}
```
- Response Payload:
```json
{
  "answerId": "ans-999",
  "sessionId": "session-xyz-456",
  "status": "SAVED"
}
```

### 4.4. Get Evaluation Report
- Endpoint: GET `/api/v1/interviews/sessions/session-xyz-456/evaluation`
- Request Payload: `{}`
- Response Payload:
```json
{
  "sessionId": "session-xyz-456",
  "overallScore": 82,
  "criteriaScores": {
    "technicalAccuracy": 85,
    "communicationClarity": 78,
    "conceptualDepth": 83
  },
  "feedback": {
    "strengths": [
      "Demonstrated good knowledge of boundary separation in Clean Architecture."
    ],
    "weaknesses": [
      "Could improve explanation of LiveData/StateFlow data bindings in MVVM."
    ],
    "actionableRecommendations": [
      "Review state restoration practices and lifecycle-aware coroutines flows."
    ]
  }
}
```

### Standard Error Schemas

#### 400 Bad Request
```json
{
  "timestamp": "2026-06-11T12:17:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request parameters provided.",
  "path": "/api/v1/interviews/sessions"
}
```

#### 401 Unauthorized
```json
{
  "timestamp": "2026-06-11T12:17:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication token is missing or expired.",
  "path": "/api/v1/interviews/sessions"
}
```

## 5. Edge Cases (minimum 3)

### 5.1. Audio Transcription Failure
- Case: Candidate submits a voice response, but ambient noise or poor connection causes the Whisper API to fail to transcribe.
- Handling: The mobile client falls back to notifying the candidate, prompting them to either re-record or manually edit/type their response.

### 5.2. Bulk Document Upload Formatting Issues
- Case: Admin uploads an unsupported, corrupted, or heavily misformatted PDF/DOCX file.
- Handling: The ingestion parser intercepts the file, returns a clear error listing the parsing validation faults, and halts database persistence.

### 5.3. Interrupted Interview Session
- Case: The mobile app crashes, or network connectivity drops during an active mock interview.
- Handling: The system caches local answers in the SQLite Room DB, allowing the session to resume exactly from the last answered question when reconnected.

## 6. KPIs & Acceptance Criteria
- **Bulk Ingestion Latency**: Uploaded documents of under 10MB must be parsed, categorized, and indexed within 15 seconds.
- **Audio Conversion Time**: Whisper speech-to-text conversion for a 30-second audio clip must complete under 3 seconds.
- **AI Scoring Time**: AI evaluation reports must return within 10 seconds of mock session completion.
- **System Availability**: Backend services and database layers must meet a 99.9% availability SLA target.

## 7. Limitations
- **OS Baseline**: Android client requires a minimum target of Android API 26 (Android 8.0) or higher.
- **File Ingestion Limits**: Bulk uploads are capped at 50MB per document.
- **Audio Capture Cap**: Candidates are limited to a maximum response duration of 120 seconds per question.

## 8. Data Privacy & Compliance (GDPR / CCPA)
- **Data Retention**: Audio recordings are purged from active server storage 30 days after the evaluation report is generated.
- **Consent Check**: Explicit audio recording consent is required from Candidates during the initial onboarding step.
- **Right to be Forgotten**: Account deletion cascades immediately to remove all personal identifiers, interview records, and stored audio clips.

## 9. User Stories
- **US-001**: As a Content Admin, I want to upload a technical document in bulk, so that I can automatically expand the question bank for Web Development.
- **US-002**: As a Candidate, I want to use my voice to answer mock questions, so that I can practice articulating technical concepts verbally.
- **US-003**: As a Candidate, I want to view a breakdown of my strengths and weaknesses, so that I can focus my study efforts on specific knowledge gaps.

## 10. Acceptance Criteria Matrix
| Feature | Acceptance Criteria |
| :--- | :--- |
| Bulk Question Ingestion | System parses PDF/DOCX files, maps them to the correct department, and displays a success log with the number of imported questions. |
| Voice input response | Candidate voice input is captured, converted using Whisper STT, and shown as editable text prior to submission. |
| Performance Analytics | Dashboard displays visual metrics tracking scores over time, categorized by technical subdomains. |

## 11. Functional Requirements Matrix
| FR-ID | Module / Feature | Description |
| :--- | :--- | :--- |
| FR-001 | Ingestion Engine | Automatically extract text, identify Q&A patterns, and classify questions under selected subdomains. |
| FR-002 | Session Orchestrator | Dynamically fetch random questions based on selected parameters and prevent question repetition within the session. |
| FR-003 | Audio Processing | Route audio recordings securely to Whisper API and fall back gracefully on transcription timeouts. |
| FR-004 | AI Evaluation Engine | Invoke LLM endpoints with structured evaluation prompts and parse the output JSON into a persistent database record. |
