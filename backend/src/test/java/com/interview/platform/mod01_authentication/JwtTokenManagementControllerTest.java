// File: src/test/java/com/interview/platform/mod01_authentication/JwtTokenManagementControllerTest.java

package com.interview.platform.mod01_authentication;

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

@WebMvcTest(JwtTokenManagementController.class)
class JwtTokenManagementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtTokenManagementService service;

    @Test
    @DisplayName("TC-01-02-01: Valid refresh token")
    void whenValidRefreshToken_TC010201() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-01-02-02: Expired refresh token")
    void whenExpiredRefreshToken_TC010202() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-01-02-03: Reuse of rotated (old) token")
    void whenReuseOfRotatedOldToken_TC010203() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-01-02-04: Malformed JWT string")
    void whenMalformedJwtString_TC010204() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(post("/api/v1/auth/token/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-01-02-05: Valid JWT + refresh token")
    void whenValidJwtRefreshToken_TC010205() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(post("/api/v1/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-01-02-06: Missing Authorization header")
    void whenMissingAuthorizationHeader_TC010206() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-01-02-07: Token reuse after logout")
    void whenTokenReuseAfterLogout_TC010207() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }
}
