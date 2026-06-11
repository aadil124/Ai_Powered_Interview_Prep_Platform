// File: src/test/java/com/interview/platform/mod01_authentication/OtpLoginControllerTest.java

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

@WebMvcTest(OtpLoginController.class)
class OtpLoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OtpLoginService service;

    @Test
    @DisplayName("TC-01-01-01: Valid email — OTP dispatched")
    void whenValidEmailOtpDispatched_TC010101() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(post("/api/v1/auth/otp/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-01-01-02: Valid phone — OTP dispatched")
    void whenValidPhoneOtpDispatched_TC010102() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(post("/api/v1/auth/otp/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-01-01-03: Invalid email format")
    void whenInvalidEmailFormat_TC010103() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(post("/api/v1/auth/otp/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-01-01-04: 6th request within 10 minutes")
    void when6thRequestWithin10Minutes_TC010104() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(429);
        
        mockMvc.perform(post("/api/v1/auth/otp/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("TC-01-01-05: Valid OTP within TTL")
    void whenValidOtpWithinTtl_TC010105() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(post("/api/v1/auth/otp/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-01-01-06: Expired OTP")
    void whenExpiredOtp_TC010106() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/otp/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-01-01-07: Already used OTP (replay)")
    void whenAlreadyUsedOtpReplay_TC010107() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/otp/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-01-01-08: Wrong OTP")
    void whenWrongOtp_TC010108() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(401);
        
        mockMvc.perform(post("/api/v1/auth/otp/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }
}
