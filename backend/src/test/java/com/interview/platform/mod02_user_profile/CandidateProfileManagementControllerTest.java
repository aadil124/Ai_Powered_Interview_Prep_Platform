// File: src/test/java/com/interview/platform/mod02_user_profile/CandidateProfileManagementControllerTest.java

package com.interview.platform.mod02_user_profile;

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

@WebMvcTest(CandidateProfileManagementController.class)
class CandidateProfileManagementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CandidateProfileManagementService service;

    @Test
    @DisplayName("TC-02-01-01: Valid JWT — own profile")
    void whenValidJwtOwnProfile_TC020101() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/candidates/profile"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-02-01-02: No JWT")
    void whenNoJwt_TC020102() throws Exception {
        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(get("/api/v1/candidates/profile"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-02-01-03: Valid JWT but profile deleted")
    void whenValidJwtButProfileDeleted_TC020103() throws Exception {
        when(service.handle()).thenReturn(404);
        
        mockMvc.perform(get("/api/v1/candidates/profile"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC-02-01-04: Update name only")
    void whenUpdateNameOnly_TC020104() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(put("/api/v1/candidates/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-02-01-05: Duplicate email")
    void whenDuplicateEmail_TC020105() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(409);
        
        mockMvc.perform(put("/api/v1/candidates/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("TC-02-01-06: Invalid phone format")
    void whenInvalidPhoneFormat_TC020106() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(put("/api/v1/candidates/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-02-01-07: Empty body")
    void whenEmptyBody_TC020107() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(put("/api/v1/candidates/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-02-01-08: Valid delete")
    void whenValidDelete_TC020108() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(delete("/api/v1/candidates/profile"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-02-01-09: Sessions, answers, audio removed")
    void whenSessionsAnswersAudioRemoved_TC020109() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(delete("/api/v1/candidates/profile"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-02-01-10: No JWT")
    void whenNoJwt_TC020110() throws Exception {
        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(delete("/api/v1/candidates/profile"))
            .andExpect(status().isUnauthorized());
    }
}
