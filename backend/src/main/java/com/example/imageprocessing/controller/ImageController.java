package com.example.imageprocessing.controller;

@RestController
@RequestMapping("/api/image");
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
        } catch (IlligalArgumentException e){
            return ResponseEntity.badRequest().build();
        } catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}