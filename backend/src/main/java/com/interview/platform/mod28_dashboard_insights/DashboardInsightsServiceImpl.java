package com.interview.platform.mod28_dashboard_insights;

import com.interview.platform.mod28_dashboard_insights.dto.CandidatePerformanceResponseDto;
import com.interview.platform.mod28_dashboard_insights.dto.MostImprovedResponseDto;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class DashboardInsightsServiceImpl implements DashboardInsightsService {

    @Override
    public CandidatePerformanceResponseDto getCandidatePerformance(String departmentId, String technologyId, String sortBy, int page, int limit) {
        return new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, page, limit, 0, false, false
        );
    }

    @Override
    public MostImprovedResponseDto getMostImprovedCandidates(int limit) {
        return new MostImprovedResponseDto(Collections.emptyList());
    }
}
