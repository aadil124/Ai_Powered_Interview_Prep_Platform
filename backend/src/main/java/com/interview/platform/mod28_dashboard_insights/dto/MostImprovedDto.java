package com.interview.platform.mod28_dashboard_insights.dto;

public record MostImprovedDto(
    String candidateId,
    String fullName,
    String profilePhotoUrl,
    Double previousAverageScore,
    Double currentAverageScore,
    Double improvementPercentage,
    String trend
) {}
