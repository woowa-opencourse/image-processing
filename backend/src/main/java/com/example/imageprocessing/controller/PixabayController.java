package com.example.imageprocessing.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/pixabay")
public class PixabayController {

    @Value("${PIXABAY_API_KEY}")
    private String pixabayKey;

    @GetMapping("/search")
    public ResponseEntity<?> searchImages(@RequestParam String q) {
        try {
            String url = "https://pixabay.com/api/?key=" + pixabayKey + "&q=" + q;

            RestTemplate rt = new RestTemplate();
            Map<String, Object> response = rt.getForObject(url, Map.class);

            return ResponseEntity.ok(response.get("hits"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("[ERROR] Pixabay 검색 실패");
        }
    }
}