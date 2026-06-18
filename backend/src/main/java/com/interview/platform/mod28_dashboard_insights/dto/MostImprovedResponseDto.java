package com.interview.platform.mod28_dashboard_insights.dto;

import java.util.List;

public record MostImprovedResponseDto(
    List<MostImprovedDto> improvedCandidates
) {}
