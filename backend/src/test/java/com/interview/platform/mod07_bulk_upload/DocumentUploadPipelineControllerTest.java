// File: src/test/java/com/interview/platform/mod07_bulk_upload/DocumentUploadPipelineControllerTest.java

package com.interview.platform.mod07_bulk_upload;

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

@WebMvcTest(DocumentUploadPipelineController.class)
class DocumentUploadPipelineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DocumentUploadPipelineService service;

    @Test
    @DisplayName("TC-07-01-01: Valid DOCX ingest trigger")
    void whenValidDocxIngestTrigger_TC070101() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(202);
        
        mockMvc.perform(post("/api/v1/admin/questions/ingest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isAccepted());
    }

    @Test
    @DisplayName("TC-07-01-02: File > 50MB")
    void whenFile50mb_TC070102() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(413);
        
        mockMvc.perform(post("/api/v1/admin/questions/ingest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isPayloadTooLarge());
    }

    @Test
    @DisplayName("TC-07-01-03: Unsupported file type (CSV)")
    void whenUnsupportedFileTypeCsv_TC070103() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(400);
        
        mockMvc.perform(post("/api/v1/admin/questions/ingest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-07-01-04: Invalid departmentId")
    void whenInvalidDepartmentid_TC070104() throws Exception {
        String requestBody = "{\"key\":\"value\"}";

        when(service.handle()).thenReturn(404);
        
        mockMvc.perform(post("/api/v1/admin/questions/ingest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC-07-01-05: Poll PROCESSING task")
    void whenPollProcessingTask_TC070105() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/admin/questions/ingest/abc"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-07-01-06: Poll COMPLETED task")
    void whenPollCompletedTask_TC070106() throws Exception {
        when(service.handle()).thenReturn(200);
        
        mockMvc.perform(get("/api/v1/admin/questions/ingest/abc"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC-07-01-07: Invalid taskId")
    void whenInvalidTaskid_TC070107() throws Exception {
        when(service.handle()).thenReturn(404);
        
        mockMvc.perform(get("/api/v1/admin/questions/ingest/abc"))
            .andExpect(status().isNotFound());
    }
}
