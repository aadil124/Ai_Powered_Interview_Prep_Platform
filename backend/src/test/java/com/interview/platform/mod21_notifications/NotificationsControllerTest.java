// File: src/test/java/com/interview/platform/mod21_notifications/NotificationsControllerTest.java

package com.interview.platform.mod21_notifications;

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

@WebMvcTest(NotificationsController.class)
class NotificationsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationsService service;

    @Test
    @DisplayName("TC-MOD21-001: Default GET test")
    void whenDefaultGetTest_TCMOD21001() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/placeholder"))
            .andExpect(status().isOk());
    }
}
