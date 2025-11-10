package com.example.imageprocessing.controller;

import com.example.imageprocessing.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/image")
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService){
        this.imageService = imageService;
    }

    // POST 요청 받아서 이미지를 흑백처리 하고, 결과를 반환하는 엔드포인트
    @PostMapping("/grayscale")
    public ResponseEntity<byte[]> processGrayscale(@RequestParam("file") MultipartFile file){
        try{
            // Service layer로 MultipartFile과 흑백 처리 위임
            byte[] processedImageBytes = imageService.processGrayscale(file);

            // 처리된 이미지 바이트 배열을 HTTP 응답으로 변환
            return ResponseEntity.ok()
                    .contentType(ImageService.getMediaType(file.getContentType()))
                    .body(processedImageBytes);
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        } catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/invert")
    public ResponseEntity<byte[]> processInvert(@RequestParam("file") MultipartFile file){
        try{
            byte[] processedImageBytes = imageService.processInvert(file);

            return ResponseEntity.ok()
                    .contentType(ImageService.getMediaType(file.getContentType()))
                    .body(processedImageBytes);
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().build();
        } catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}