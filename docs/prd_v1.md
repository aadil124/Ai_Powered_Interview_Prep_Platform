# PRD - AI-Powered Interview Preparation and Assessment Platform (v1 Enhancement)

## 1. Problem Statement
Administrators and platform managers lack quick, unified visibility into candidate performance and improvement trends directly from the admin dashboard. Currently, to evaluate candidate progression, identify top talent, or locate rapidly improving candidates, administrators must navigate through individual, detailed reports. This creates friction, slows administrative review cycles, and limits high-level cohort tracking.

## 2. Solution Overview
This enhancement introduces two additional candidate analytics widgets to the Web Admin Dashboard: the Candidate Performance Card and the Most Improved Candidate Widget. These tools aggregate historical evaluation data to present clean visual metrics, enabling quick reviews without detailed page navigation.

### Core Features
* **Candidate Performance Card (FT-28-01)**: Provides a quick snapshot of candidate engagement and grading, displaying photo, name, department, latest overall score, a visual progress bar, total interviews attended, and activity status. Supports sorting, filtering, and live refreshing.
* **Most Improved Candidate Widget (FT-28-02)**: Compares historical interview evaluations with recent scores to dynamically calculate positive progress. Highlight candidates showing significant learning velocity, with supporting trend indicators and sorting capabilities.

## 3. User Flow
```
[Admin Web Console] ----> [Renders Dashboard Widgets] ----> [View Performance Card & Most Improved List]
                                                                        |
                                                                        +---> [Filter by Dept / Sort by Delta]
                                                                        |
[Candidate Mobile Client] --> [Completes Interview] --> [AI Evaluation Done] ---> [Broadcasts Refresh Signal]
```

## 4. API Design

### 4.5. Get Candidate Performance Metrics (Dashboard Widget)
* **Endpoint**: GET `/api/v1/admin/dashboard/candidate-performance`
* **Request Payload**: `{}` (Query Parameters: `departmentId`, `technologyId`, `sortBy`, `page`, `limit`)
* **Response Payload**:
```json
{
  "candidates": [
    {
      "candidateId": "cand-uuid-1",
      "fullName": "John Smith",
      "profilePhotoUrl": "https://storage.platform.com/profiles/john_smith.jpg",
      "departmentName": "Mobile Development",
      "technologyName": "React Developer",
      "overallScorePercentage": 87.0,
      "totalInterviewsAttended": 12,
      "lastActiveDate": "2026-06-18T10:00:00Z"
    }
  ],
  "totalCandidates": 125,
  "page": 1,
  "limit": 10
}
```

### 4.6. Get Most Improved Candidates (Dashboard Widget)
* **Endpoint**: GET `/api/v1/admin/dashboard/most-improved`
* **Request Payload**: `{}` (Query Parameters: `limit`)
* **Response Payload**:
```json
{
  "improvedCandidates": [
    {
      "candidateId": "cand-uuid-2",
      "fullName": "Rahul Sharma",
      "profilePhotoUrl": "https://storage.platform.com/profiles/rahul_sharma.jpg",
      "previousAverageScore": 58.0,
      "currentAverageScore": 82.0,
      "improvementPercentage": 24.0,
      "trend": "UPWARD"
    }
  ]
}
```

---

### Standard Error Schemas

#### 400 Bad Request
```json
{
  "timestamp": "2026-06-18T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid query parameters provided.",
  "path": "/api/v1/admin/dashboard/candidate-performance"
}
```

#### 401 Unauthorized
```json
{
  "timestamp": "2026-06-18T12:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication token is missing or expired.",
  "path": "/api/v1/admin/dashboard/candidate-performance"
}
```

## 5. Edge Cases (minimum 3)

### 5.4. Candidates with Single Interview Session (Most Improved Widget)
* **Case**: A candidate has only completed one interview session, meaning no historical score comparison can be performed.
* **Handling**: The progression engine excludes the candidate from the most-improved query, displaying them only after their second interview is evaluated.

### 5.5. Deleted Profile Images or Missing Photos (Performance Card)
* **Case**: A candidate does not have a profile photo uploaded or their photo fails to load from the cloud storage bucket.
* **Handling**: The front-end renders an SVG placeholder based on the candidate's initials (`JS` for John Smith) to prevent broken image layouts.

### 5.6. High-Frequency Real-Time Score Updates
* **Case**: Dozens of candidates finish interviews and trigger AI evaluations at the same time, causing flood refresh events on the active admin dashboard.
* **Handling**: The dashboard client debounces websocket refresh triggers, implementing a minimum 5-second throttling window between dashboard widget updates.

## 6. KPIs & Acceptance Criteria
* **Widget Query Latency**: Admin dashboard widget queries must execute and respond in under 1.5 seconds.
* **Live Refresh Sync**: Dashboard widgets must automatically refresh within 2.0 seconds of the backend publishing an AI evaluation completion event.
* **Accuracy of Progression Math**: Score improvement calculations must mathematically align to: `Current Average Score - Previous Average Score` (where Previous Average is the average of first N-1 sessions and Current Average is the average of the last session(s)).

## 7. Limitations
* **Comparison Requirements**: Improvement calculations require a history of at least two completed mock interview sessions.
* **Widget Capacity**: The most improved widget displays a maximum of 5 top improving candidates to optimize layout spaces.
* **Cache Expiry**: pre-aggregated candidate analytics are cached in Redis with a 10-second TTL to balance speed and consistency.

## 8. Data Privacy & Compliance (GDPR / CCPA)
* **Right to be Forgotten**: Upon account deletion, the candidate's records are purged from the performance card lists and most improved widget logs.
* **Pre-signed URL access**: Profile pictures are loaded via short-lived, secure pre-signed URLs to protect candidate identities from open exposure.
* **Role Enforcement**: Performance dashboard endpoints require either `SUPER_ADMIN` or `CONTENT_ADMIN` role authorization headers.

## 9. User Stories
* **US-004**: As a Super Admin, I want to view candidate performance metrics on a consolidated card in the admin dashboard, so that I can quickly review overall cohort engagement and identify top performers.
* **US-005**: As a Content Admin, I want to identify the most improved candidates via a dedicated progress widget, so that I can track candidate learning velocity and reward positive preparation trends.

## 10. Acceptance Criteria Matrix

| Feature | Acceptance Criteria |
| :--- | :--- |
| Candidate Performance Card (FT-28-01) | - Renders profile photo, full name, department, latest score, progress bar, attended count, and last active status.<br>- Supports query sorting by score or interview count.<br>- Supports query filtering by department/technology stack. |
| Most Improved Candidate (FT-28-02) | - Displays profile photo, full name, previous average, current average, positive delta, and progress trend icon.<br>- Excludes candidates with less than 2 completed mock sessions.<br>- Ranks results in descending order of improvement. |

## 11. Functional Requirements Matrix

| FR-ID | Module / Feature | Description |
| :--- | :--- | :--- |
| FR-005 | Dashboard Insights | The system must calculate and return candidate performance summaries including overall scores, counts, and active status, with support for filtering and sorting via API. |
| FR-006 | Progression Engine | The system must query historical candidate session records, calculate the score differential between the earliest and latest sessions, and sort candidates by positive delta. |
