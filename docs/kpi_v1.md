# KPIs - AI-Powered Interview Preparation and Assessment Platform (v1 Enhancement)

## 1. Document Control
- **Project Name:** AI-Powered Interview Preparation and Assessment Platform
- **Document Version:** 1.1.0
- **Date:** 2026-06-18

---

## 2. Purpose
This document establishes key telemetry metrics, Service Level Agreements (SLAs), and business indicators to align product requirements with software reliability engineering (SRE) thresholds for the newly introduced Admin Dashboard insights.
- **Product Managers** use this to track dashboard engagement, progression metrics accuracy, and cohort trend value.
- **Developers & QA** use the feature-wise KPI matrix to implement exact telemetry event trackers and ensure features satisfy performance thresholds prior to release.
- **SRE & Operations** configure Grafana alerts, Prometheus collectors, and Slack notification channels based on the specified event names and alerts.

---

## 3. KPI Framework
The KPI Framework is designed around Business alignment, Service reliability, and Feature-level monitoring. It ensures traceability from high-level objectives down to granular application telemetry.
- **Business KPIs**: Track user adoption and feature engagement.
- **SLA Metrics**: Define system availability and operational health.
- **Success Metrics**: Ensure that qualitative functionality meets acceptance standards.
- **Module KPIs**: Break down monitoring per functional subsystem.

---

## 4. KPI Categories
Metrics are divided into the following key categories:
1. **Adoption & Usage**: Active users, session counts.
2. **Performance**: Latency, throughput, execution times.
3. **Quality & Accuracy**: AI evaluation precision, WER (Word Error Rate), OCR/Parsing success rates.
4. **Reliability**: Uptime, error rates, system health.

---

## 5. Module KPI Matrix

### 5.13. Dashboard Insights & Progression Module
*(MOD-28 Dashboard Insights)*
| KPI ID | KPI Name & Description | Owner | Verification Method | Target Criteria | Telemetry Event / Log Source | Alert Route |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KPI-013 | Performance Card Aggregation Latency | Backend Dev | APM | < 1.5s | `dashboard_perf_card_latency` | Slack |
| KPI-014 | Most Improved Candidate Calculation Latency | Backend Dev | APM | < 1.5s | `dashboard_most_improved_latency` | Slack |
| KPI-015 | Dashboard Refresh Sync Delay | Frontend Dev | Trace logs | < 2s | `dashboard_refresh_sync_latency` | Slack |

---

## 6. Business KPIs

| KPI ID | KPI Name & Description | Owner | Verification Method | Target Criteria | Telemetry Event / Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BIZ-004 | Admin Dashboard Engagement | Product | Mixpanel | > 70% daily active admins | `admin_dashboard_widget_viewed` |

---

## 7. SLA Metrics

| Service | SLA Target | Measurement Method | Alert Threshold |
| :--- | :--- | :--- | :--- |
| Candidate Performance API | 99.9% Uptime | HTTP Health check | Down > 3m |
| Progression Calculation Engine | 99.9% Uptime | Synthetic requests | < 99.9% in 24hr |

---

## 8. Success Metrics

| Feature | Success Criteria | Measurement Method |
| :--- | :--- | :--- |
| Candidate Performance Card | 100% accurate rendering of candidate name, department, latest score, and progress bar for active sessions. | `perf_card_render_accuracy` |
| Most Improved Candidate | Exact match of computed improvement percentage with verification test script evaluations. | `improved_progression_calculation_accuracy` |

---

## 9. Traceability Matrix

| KPI ID | Traces To (PRD Module/Feature) | Traces To (Business/Product Goal) |
| :--- | :--- | :--- |
| KPI-013 | MOD-28 / FT-28-01 | Faster candidate review and improved dashboard usability |
| KPI-014 | MOD-28 / FT-28-02 | Identify top learning velocity candidates and growth trends |
| KPI-015 | MOD-28 / FT-28-01, FT-28-02 | Real-time administrative visibility into progression changes |
