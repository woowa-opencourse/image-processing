package com.example.imageprocessing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private String wrapError(String msg) {
        return "[ERROR] " + msg;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity
                .badRequest()
                .body(wrapError(e.getMessage()));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleIO(IOException e) {
        return ResponseEntity
                .status(500)
                .body(wrapError("이미지 처리 중 오류가 발생했습니다."));
    }
}
