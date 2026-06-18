package com.interview.platform.mod28_dashboard_insights.dto;

import java.util.List;

public record CandidatePerformanceResponseDto(
    List<CandidatePerformanceDto> candidates,
    long total,
    int page,
    int limit,
    int totalPages,
    boolean hasNext,
    boolean hasPrevious
) {}
