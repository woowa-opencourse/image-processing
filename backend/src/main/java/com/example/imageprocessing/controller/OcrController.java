package com.example.imageprocessing.controller;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class OcrController {
    private final ImageAnnotatorClient client;

    public OcrController(ImageAnnotatorClient client) {
        this.client = client;
    }

    @PostMapping("/ocr")
    public ResponseEntity<?> extractText(@RequestParam("file") MultipartFile file) throws Exception{
        ByteString imgBytes = ByteString.copyFrom(file.getBytes());
        Image image = Image.newBuilder().setContent(imgBytes).build();

        Feature feature = Feature.newBuilder()
                .setType(Feature.Type.TEXT_DETECTION)
                .build();

        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feature)
                .setImage(image)
                .build();

        BatchAnnotateImagesResponse response = client.batchAnnotateImages(List.of(request));
        AnnotateImageResponse res = response.getResponses(0);

        if(res.hasError()){
            return ResponseEntity.badRequest().body(Map.of("error",  res.getError().getMessage()));
        }

        String detectedText = res.getFullTextAnnotation().getText();

        return ResponseEntity.ok(Map.of("text", detectedText));
    }
}
