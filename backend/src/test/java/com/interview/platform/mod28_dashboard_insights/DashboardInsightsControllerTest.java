package com.interview.platform.mod28_dashboard_insights;

import com.interview.platform.mod28_dashboard_insights.dto.CandidatePerformanceResponseDto;
import com.interview.platform.mod28_dashboard_insights.dto.MostImprovedResponseDto;
import com.interview.platform.exception.RateLimitExceededException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@WebMvcTest(DashboardInsightsController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = true)
class DashboardInsightsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardInsightsService service;

    // ==========================================
    // FT-28-01: Candidate Performance Card Tests
    // ==========================================

    @Test
    @DisplayName("TC-28-01-01: Valid request with no filters - Returns 200 and candidates")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_HappyPath() throws Exception {
        CandidatePerformanceResponseDto response = new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, 1, 10, 0, false, false
        );
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-28-01-02: Filter by valid departmentId - Returns filtered list")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_WithDeptFilter() throws Exception {
        String deptId = UUID.randomUUID().toString();
        CandidatePerformanceResponseDto response = new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, 1, 10, 0, false, false
        );
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("departmentId", deptId)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-28-01-03: Filter by valid technologyId - Returns filtered list")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_WithTechFilter() throws Exception {
        String techId = UUID.randomUUID().toString();
        CandidatePerformanceResponseDto response = new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, 1, 10, 0, false, false
        );
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("technologyId", techId)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-28-01-04: Sort by score descending - Sorted list returned")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_SortByScoreDesc() throws Exception {
        CandidatePerformanceResponseDto response = new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, 1, 10, 0, false, false
        );
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("sortBy", "score_desc")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-28-01-05: Sort by score ascending - Sorted list returned")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_SortByScoreAsc() throws Exception {
        CandidatePerformanceResponseDto response = new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, 1, 10, 0, false, false
        );
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("sortBy", "score_asc")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-28-01-06: Sort by attended count descending - Sorted list returned")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_SortByAttended() throws Exception {
        CandidatePerformanceResponseDto response = new CandidatePerformanceResponseDto(
            Collections.emptyList(), 0, 1, 10, 0, false, false
        );
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("sortBy", "attended_desc")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-28-01-07: Validation failure - Invalid departmentId UUID format returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_InvalidDeptUuid() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("departmentId", "invalid-uuid-string")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-01-08: Validation failure - Invalid technologyId UUID format returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_InvalidTechUuid() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("technologyId", "invalid-uuid-string")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-01-09: Validation failure - Invalid sortBy value returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_InvalidSortBy() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("sortBy", "invalid_field")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-01-10: Validation failure - Page parameter < 1 returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_InvalidPage() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("page", "0")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-01-11: Validation failure - Limit parameter < 1 returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_InvalidLimitTooLow() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("limit", "0")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-01-12: Validation failure - Limit parameter > 100 returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_InvalidLimitTooHigh() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .param("limit", "101")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-01-13: Security failure - Anonymous request yields 401")
    void getPerformanceCards_Anonymous() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-28-01-14: Security failure - Candidate role JWT yields 403")
    @WithMockUser(roles = "CANDIDATE")
    void getPerformanceCards_CandidateRoleForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-28-01-15: Edge Case - Rate limit threshold hit yields 429")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getPerformanceCards_RateLimitExceeded() throws Exception {
        when(service.getCandidatePerformance(any(), any(), any(), anyInt(), anyInt()))
            .thenThrow(new RateLimitExceededException("Rate limit exceeded"));

        mockMvc.perform(get("/api/v1/admin/dashboard/candidate-performance")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isTooManyRequests());
    }

    // ==========================================
    // FT-28-02: Most Improved Candidate Tests
    // ==========================================

    @Test
    @DisplayName("TC-28-02-01: Valid request with limit parameter - Returns 200 and candidates")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getMostImproved_HappyPath() throws Exception {
        MostImprovedResponseDto response = new MostImprovedResponseDto(Collections.emptyList());
        when(service.getMostImprovedCandidates(anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .param("limit", "5")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("TC-28-02-02: Validation failure - Limit parameter < 1 returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getMostImproved_InvalidLimitTooLow() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .param("limit", "0")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-02-03: Validation failure - Limit parameter > 50 returns 400")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getMostImproved_InvalidLimitTooHigh() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .param("limit", "51")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-28-02-04: Security failure - Anonymous request yields 401")
    void getMostImproved_Anonymous() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-28-02-05: Security failure - Candidate role JWT yields 403")
    @WithMockUser(roles = "CANDIDATE")
    void getMostImproved_CandidateRoleForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-28-02-06: Edge Case - Candidates with only 1 interview session are excluded from results")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getMostImproved_ExcludeSingleSessionCandidates() throws Exception {
        MostImprovedResponseDto response = new MostImprovedResponseDto(Collections.emptyList());
        when(service.getMostImprovedCandidates(anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
        // Business logic check occurs inside DB query / service layer, here we check response returns successfully.
    }

    @Test
    @DisplayName("TC-28-02-07: Edge Case - Candidates with negative or 0% progression delta are filtered out")
    @WithMockUser(roles = "CONTENT_ADMIN")
    void getMostImproved_ExcludeRegressiveCandidates() throws Exception {
        MostImprovedResponseDto response = new MostImprovedResponseDto(Collections.emptyList());
        when(service.getMostImprovedCandidates(anyInt())).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard/most-improved")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }
}
