# Module Overview: MOD-13 — Speech-To-Text

## 1. Module Summary

### Purpose
Integrates with the OpenAI Whisper API to convert candidate audio recordings into editable transcribed text, with graceful fallback to manual text entry on transcription failure.

### Responsibilities
- Receive audio file URL from MOD-12 Voice Recording.
- Invoke Whisper API with audio stream for transcription.
- Return transcribed text for candidate review/edit.
- Enforce < 3 second conversion SLA for 30-second clips.
- Fallback to manual input on Whisper failure.

### Scope Boundaries
**In Scope:** Whisper API call; response parsing; fallback handling; WER logging.
**Out of Scope:** Real-time streaming transcription; speaker identification.

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-13-01 | Whisper STT Integration | Backend Dev / AI Lead | P0 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-12 Voice Recording (audio URL input)
- Whisper API (External)
- MOD-24 File Storage (audio file retrieval)

### Depended Upon By
- MOD-10 Interview Session (transcribed text → answer record)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-005 | Whisper STT Conversion | < 3s | `whisper_stt_seconds` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| STT-001 | Whisper API timeout | 503 |
| STT-002 | Audio format unsupported by Whisper | 400 |
| STT-003 | Transcription confidence below threshold | 422 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| STT Integration | US-002 | FR-003 | API-13-01 | TC-13-01 | KPI-005 |
