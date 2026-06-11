# Module Overview: MOD-21 — Notifications

## 1. Module Summary

### Purpose
Manages push notifications and in-app alerts delivered to candidates and admins for key lifecycle events — session completion, evaluation ready, ingestion success/failure, and system alerts.

### Responsibilities
- Dispatch push notifications (FCM for Android) on key events.
- Send admin email alerts on ingestion failures or system errors.
- Maintain notification delivery log and status tracking.
- Enforce notification delivery rate SLA (> 99%).

### Scope Boundaries
**In Scope:** Push notifications (Android FCM); admin email on critical failures; delivery logging.
**Out of Scope:** SMS notifications; in-app notification center UI (v1.1 scope).

---

## 2. Feature Index

| Feature ID | Feature Name | Owner | Priority | Status |
|------------|--------------|--------|----------|---------|
| FT-21-01 | Push Notification Dispatch | Backend Dev | P1 | Approved |

---

## 3. Module Dependencies

### Depends On
- MOD-10 Interview Session (session completion trigger)
- MOD-14 AI Evaluation (evaluation ready trigger)
- FCM (Firebase Cloud Messaging — External)
- Email provider (External)
- PostgreSQL (delivery log)

### Depended Upon By
- MOD-23 Admin Portal (system alert display)

---

## 4. Module-Level KPIs

| KPI-ID | KPI Name | Target | Telemetry Event |
|--------|-----------|--------|----------------|
| KPI-009 | Notification Delivery Rate | > 99% | `notification_delivery_success` |

---

## 5. Module-Level Error Codes

| Error Code | Meaning | HTTP Status |
|------------|---------|------------|
| NOTIF-001 | FCM token not registered | 400 |
| NOTIF-002 | Push delivery failed | 502 |
| NOTIF-003 | Email delivery failed | 502 |

---

## 6. Traceability Summary

| Feature | User Story | FR | API | TC | KPI |
|---------|------------|-----|------|------|------|
| Push Notifications | US-017 | FR-021 | API-21-01 | TC-21-01 | KPI-009 |
