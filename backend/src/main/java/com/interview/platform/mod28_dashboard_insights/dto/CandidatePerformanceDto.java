package com.interview.platform.mod28_dashboard_insights.dto;

public record CandidatePerformanceDto(
    String candidateId,
    String fullName,
    String profilePhotoUrl,
    String departmentName,
    String technologyName,
    Double overallScorePercentage,
    Integer totalInterviewsAttended,
    String lastActiveDate
) {}
