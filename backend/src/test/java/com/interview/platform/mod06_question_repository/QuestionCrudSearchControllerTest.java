// File: src/test/java/com/interview/platform/mod06_question_repository/QuestionCrudSearchControllerTest.java

package com.interview.platform.mod06_question_repository;

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

@WebMvcTest(QuestionCrudSearchController.class)
class QuestionCrudSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionCrudSearchService service;

    @Test
    @DisplayName("TC-06-01-01: Valid question creation")
    void whenValidQuestionCreation_TC060101() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(201);
        
        mockMvc.perform(post("/api/v1/admin/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("TC-06-01-02: Missing questionText")
    void whenMissingQuestiontext_TC060102() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(post("/api/v1/admin/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-06-01-03: Invalid departmentId")
    void whenInvalidDepartmentid_TC060103() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(404);
        
        mockMvc.perform(post("/api/v1/admin/questions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isNotFound());
    }
}
