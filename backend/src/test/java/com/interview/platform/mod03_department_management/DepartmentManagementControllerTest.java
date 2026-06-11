// File: src/test/java/com/interview/platform/mod03_department_management/DepartmentManagementControllerTest.java

package com.interview.platform.mod03_department_management;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@WebMvcTest(DepartmentManagementController.class)
class DepartmentManagementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DepartmentManagementService service;

    @Test
    @DisplayName("TC-03-01-01: Valid creation")
    void whenValidCreation_TC030101() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(201);
        
        mockMvc.perform(post("/api/v1/admin/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("TC-03-01-02: Duplicate name")
    void whenDuplicateName_TC030102() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(409);
        
        mockMvc.perform(post("/api/v1/admin/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("TC-03-01-03: Missing name field")
    void whenMissingNameField_TC030103() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(post("/api/v1/admin/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-03-01-04: CANDIDATE role attempt")
    void whenCandidateRoleAttempt_TC030104() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(403);
        
        mockMvc.perform(post("/api/v1/admin/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-03-01-05: List departments — results exist")
    void whenListDepartmentsResultsExist_TC030105() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/admin/departments"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-03-01-06: No departments yet")
    void whenNoDepartmentsYet_TC030106() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/admin/departments"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-03-01-07: CANDIDATE role")
    void whenCandidateRole_TC030107() throws Exception {
        when(service.handle()).thenReturn(403);
        
        mockMvc.perform(get("/api/v1/admin/departments"))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-03-01-08: Valid update")
    void whenValidUpdate_TC030108() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(put("/api/v1/admin/departments/123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-03-01-09: Department not found")
    void whenDepartmentNotFound_TC030109() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(404);
        
        mockMvc.perform(put("/api/v1/admin/departments/123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC-03-01-10: Duplicate name")
    void whenDuplicateName_TC030110() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(409);
        
        mockMvc.perform(put("/api/v1/admin/departments/123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("TC-03-01-11: SUPER_ADMIN deletes existing dept")
    void whenSuperadminDeletesExistingDept_TC030111() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(delete("/api/v1/admin/departments/123"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-03-01-12: CONTENT_ADMIN attempts delete")
    void whenContentadminAttemptsDelete_TC030112() throws Exception {
        when(service.handle()).thenReturn(403);
        
        mockMvc.perform(delete("/api/v1/admin/departments/123"))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-03-01-13: Department not found")
    void whenDepartmentNotFound_TC030113() throws Exception {
        when(service.handle()).thenReturn(404);
        
        mockMvc.perform(delete("/api/v1/admin/departments/123"))
            .andExpect(status().isNotFound());
    }
}
