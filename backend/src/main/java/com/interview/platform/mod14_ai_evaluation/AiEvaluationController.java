package com.interview.platform.mod14_ai_evaluation;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;

@RestController
public class AiEvaluationController {

    private final AiEvaluationService service;

    public AiEvaluationController(AiEvaluationService service) {
        this.service = service;
    }

    @RequestMapping(value = "/**", method = {
        org.springframework.web.bind.annotation.RequestMethod.GET, 
        org.springframework.web.bind.annotation.RequestMethod.POST, 
        org.springframework.web.bind.annotation.RequestMethod.PUT, 
        org.springframework.web.bind.annotation.RequestMethod.DELETE, 
        org.springframework.web.bind.annotation.RequestMethod.PATCH})
    public ResponseEntity<?> handleAll() {
        return ResponseEntity.status(service.handle()).build();
    }
}
