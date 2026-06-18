package com.interview.platform.mod28_dashboard_insights;

import com.interview.platform.mod28_dashboard_insights.dto.CandidatePerformanceResponseDto;
import com.interview.platform.mod28_dashboard_insights.dto.MostImprovedResponseDto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;
import java.net.URI;
import java.time.Instant;
import org.springframework.http.ProblemDetail;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@Validated
public class DashboardInsightsController {

    private final DashboardInsightsService service;

    public DashboardInsightsController(DashboardInsightsService service) {
        this.service = service;
    }

    @GetMapping("/candidate-performance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> getPerformanceCards(
            @RequestParam(required = false) 
            @Pattern(regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$", message = "Invalid departmentId") 
            String departmentId,
            
            @RequestParam(required = false) 
            @Pattern(regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$", message = "Invalid technologyId") 
            String technologyId,
            
            @RequestParam(required = false, defaultValue = "score_desc") 
            @Pattern(regexp = "^(score_desc|score_asc|attended_desc)$", message = "Invalid sortBy") 
            String sortBy,
            
            @RequestParam(required = false, defaultValue = "1") 
            @Min(value = 1, message = "Page must be at least 1") 
            int page,
            
            @RequestParam(required = false, defaultValue = "10") 
            @Min(value = 1, message = "Limit must be at least 1") 
            @Max(value = 100, message = "Limit must not exceed 100") 
            int limit) {

        CandidatePerformanceResponseDto data = service.getCandidatePerformance(departmentId, technologyId, sortBy, page, limit);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", data);
        resp.put("error", null);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/most-improved")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<?> getMostImproved(
            @RequestParam(required = false, defaultValue = "5") 
            @Min(value = 1, message = "Limit must be at least 1") 
            @Max(value = 50, message = "Limit must not exceed 50") 
            int limit) {

        MostImprovedResponseDto data = service.getMostImprovedCandidates(limit);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", data);
        resp.put("error", null);
        return ResponseEntity.ok(resp);
    }

    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolationException(jakarta.validation.ConstraintViolationException ex, org.springframework.web.context.request.WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String fieldPath = violation.getPropertyPath().toString();
            String fieldName = fieldPath.substring(fieldPath.lastIndexOf('.') + 1);
            errors.put(fieldName, violation.getMessage());
        });

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation Error");
        pd.setTitle("Validation Error");
        pd.setInstance(URI.create(request.getDescription(false).replace("uri=", "")));
        pd.setProperty("timestamp", Instant.now().toString());
        pd.setProperty("errors", errors);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", false);
        resp.put("data", null);
        resp.put("error", pd);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
    }
}
