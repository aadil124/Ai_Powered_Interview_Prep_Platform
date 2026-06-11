# Module Overview: MOD-12 — Voice Recording

## 1. Module Summary

### Purpose
Handles the Android-side audio capture lifecycle during a mock interview session — microphone permission management, recording session start/stop, audio file encoding, and upload to S3 storage for downstream STT processing.

### Responsibilities
- Microphone permission request and validation.
- Audio recording session management (start, pause, stop).
- Audio file encoding (WAV/M4A format).
- Secure pre-signed S3 upload of recorded audio.
- Enforce 120-second maximum recording duration per question.

### Scope Boundaries
**In Scope:** Microphone capture; encoding; S3 upload; 120s limit enforcement.
**Out of Scope:** Real-time streaming to STT; background audio recording.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-12-01 | Audio Capture & Upload | Android Dev | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- Android MediaRecorder API
- MOD-24 File Storage (S3 pre-signed upload URL)
- MOD-01 Authentication (Candidate JWT for upload auth)

### Depended Upon By
- MOD-13 Speech-To-Text

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-005 | Whisper STT Conversion | < 3s | `whisper_stt_seconds` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| REC-001 | Microphone permission denied | 403 (local) |
| REC-002 | Recording exceeds 120 seconds | 400 |
| REC-003 | S3 audio upload failure | 500 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Audio Capture | US-002 | FR-003 | API-12-01 | TC-12-01 | KPI-005 |
