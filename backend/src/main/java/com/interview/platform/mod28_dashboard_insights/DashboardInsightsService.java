package com.interview.platform.mod28_dashboard_insights;

import com.interview.platform.mod28_dashboard_insights.dto.CandidatePerformanceResponseDto;
import com.interview.platform.mod28_dashboard_insights.dto.MostImprovedResponseDto;

public interface DashboardInsightsService {
    CandidatePerformanceResponseDto getCandidatePerformance(String departmentId, String technologyId, String sortBy, int page, int limit);
    MostImprovedResponseDto getMostImprovedCandidates(int limit);
}
