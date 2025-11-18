package com.example.imageprocessing.controller;

import com.example.imageprocessing.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/image")
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService){
        this.imageService = imageService;
    }

    @PostMapping("/grayscale")
    public ResponseEntity<byte[]> processGrayscale(@RequestParam("file") MultipartFile file,
                                                   @RequestParam(value = "filterHistory", required = false) String filterHistoryJson,
                                                   @RequestParam(value = "brightnessAdjustment", required = false) Integer brightnessAdjustment) throws IOException {

        int adjustment = (brightnessAdjustment != null) ? brightnessAdjustment : 0;

        // Service layer로 MultipartFile과 흑백 처리 위임
        byte[] processedImageBytes = imageService.processGrayscale(file, filterHistoryJson, adjustment);

        // 처리된 이미지 바이트 배열을 HTTP 응답으로 변환
        return ResponseEntity.ok(processedImageBytes);
    }

    @PostMapping("/invert")
    public ResponseEntity<byte[]> processInvert(@RequestParam("file") MultipartFile file,
                                                @RequestParam(value = "filterHistory", required = false) String filterHistoryJson,
                                                @RequestParam(value = "brightnessAdjustment", required = false) Integer brightnessAdjustment) throws IOException {
        int adjustment = (brightnessAdjustment != null) ? brightnessAdjustment : 0;

        byte[] processedImageBytes = imageService.processInvert(file, filterHistoryJson, adjustment);

        return ResponseEntity.ok(processedImageBytes);
    }

    @PostMapping("/brightness")
    public ResponseEntity<byte[]> processBrightness(@RequestParam("file") MultipartFile file,
                                                    @RequestParam(value = "filtergHistory", required = false) String filterHistoryJson,
                                                    @RequestParam("adjustment") int adjustment) throws IOException {
        byte[] processedImageBytes = imageService.processBrightness(file,filterHistoryJson, adjustment);

        return ResponseEntity.ok(processedImageBytes);
    }

    @PostMapping("/crop")
    public ResponseEntity<byte[]> cropImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("x1") int x1,
            @RequestParam("y1") int y1,
            @RequestParam("x2") int x2,
            @RequestParam("y2") int y2,
            @RequestParam(value = "filterHistory", required = false) String filterHistoryJson,
            @RequestParam(value = "brightnessAdjustment", required = false) Integer brightnessAdjustment
    ) throws IOException {
        int adjustment = (brightnessAdjustment != null) ? brightnessAdjustment : 0;

        byte[] processedImageBytes = imageService.processCrop(file, x1, y1, x2, y2, filterHistoryJson, adjustment);

        return ResponseEntity.ok(processedImageBytes);
    }
}