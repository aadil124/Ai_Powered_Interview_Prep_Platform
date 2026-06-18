# Enhancement Request - Admin Dashboard Insights

## Overview

This enhancement introduces additional candidate analytics widgets for the Admin Dashboard of the AI-Powered Interview Preparation and Assessment Platform.

The goal is to provide administrators with quick visibility into candidate performance and progress directly from the dashboard without requiring navigation to detailed reports.

---

# Enhancement 1: Candidate Performance Card

## Objective

Provide administrators with a quick snapshot of individual candidate performance.

## Description

Display a candidate performance card containing key performance indicators and interview statistics.

### Information Displayed

- Candidate Profile Photo
- Candidate Full Name
- Department / Technology
- Overall Score Percentage
- Performance Progress Bar
- Total Interviews Attended
- Last Active Date

### Example

```text
┌────────────────────────────┐
│ 👤 John Smith             │
│ React Developer           │
│ Score: 87%               │
│ ████████████████░░ 87%    │
│ Attended: 12 Interviews  │
│ Last Active: Today       │
└────────────────────────────┘
```

### Functional Expectations

- Display latest candidate performance score.
- Display total interviews attended.
- Display candidate activity status.
- Support sorting by score.
- Support filtering by department or technology.
- Support dashboard refresh after new interview completion.

### Business Benefits

- Faster candidate review
- Improved dashboard usability
- Quick identification of top performers

---

# Enhancement 2: Most Improved Candidate

## Objective

Highlight candidates who have demonstrated the highest performance improvement over time.

## Description

The system should compare historical candidate scores with recent candidate scores and calculate improvement percentage.

Administrators should be able to identify candidates who are progressing significantly.

### Information Displayed

- Candidate Profile Photo
- Candidate Full Name
- Previous Average Score
- Current Average Score
- Improvement Percentage
- Improvement Trend Indicator

### Example

```text
┌────────────────────────────┐
│ 📈 Most Improved Candidate │
├────────────────────────────┤
│ 👤 Rahul Sharma            │
│ Previous Score: 58%        │
│ Current Score: 82%         │
│ Improvement: +24%          │
│ ████████████████░░         │
└────────────────────────────┘
```

### Functional Expectations

- Automatically calculate score improvement.
- Compare historical and recent performance.
- Display top improving candidates.
- Update data after interview evaluation completion.
- Support sorting by improvement percentage.

### Business Benefits

- Encourages continuous learning
- Highlights candidate growth
- Improves administrative visibility into progress trends

---

# Scope

Included Features:

1. Candidate Performance Card
2. Most Improved Candidate

Out of Scope:

- Recommendation Engine
- Skill Gap Analysis
- AI Insights
- Candidate Ranking System
- Gamification Features
- Additional Dashboard Widgets

This enhancement is limited only to the two dashboard features described above.
