// File: src/test/java/com/interview/platform/mod11_question_delivery/QuestionDeliveryControllerTest.java

package com.interview.platform.mod11_question_delivery;

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

@WebMvcTest(QuestionDeliveryController.class)
class QuestionDeliveryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionDeliveryService service;

    @Test
    @DisplayName("TC-MOD11-001: Default GET test")
    void whenDefaultGetTest_TCMOD11001() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/placeholder"))
            .andExpect(status().isOk());
    }
}
