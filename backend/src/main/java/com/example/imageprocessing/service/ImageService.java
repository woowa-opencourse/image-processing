package com.example.imageprocessing.service;

import com.example.imageprocessing.domain.ImageValidator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {
    private final ImageValidator imageValidator;
    private final ImageProcessor grayscaleProcessor;
    private final ImageProcessor invertProcessor;
    private final BrightnessProcessor brightnessProcessor;
    private final CropProcessor cropProcessor;
    private final ObjectMapper objectMapper;

    public ImageService(ImageValidator imageValidator,
                        ImageProcessor grayscaleProcessor,
                        ImageProcessor invertProcessor,
                        BrightnessProcessor brightnessProcessor,
                        CropProcessor cropProcessor) {
        this.imageValidator = imageValidator;
        this.grayscaleProcessor = grayscaleProcessor;
        this.invertProcessor = invertProcessor;
        this.brightnessProcessor = brightnessProcessor;
        this.cropProcessor = cropProcessor;
        this.objectMapper = new ObjectMapper();
    }

    public byte[] processGrayscale(MultipartFile file, String filterHistoryJson, int brightnessAdjustment) throws IOException {
        imageValidator.validate(file);

        // multipartfile을 buffredimage로 변환
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 흑백 처리 로직 실행(Processor에 위임)
        BufferedImage finalImage = applyAllFilters(
                originalImage,
                FilterType.GrayScale,
                filterHistoryJson,
                brightnessAdjustment
        );

        // buffredimage를 byte array로 변환해 반환
        return convertToByteArray(finalImage, getFileExtension(file.getOriginalFilename()));
    }

    public byte[] processInvert(MultipartFile file, String filterHistoryJson, int brightnessAdjustment) throws IOException {
        imageValidator.validate(file);

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage finalImage = applyAllFilters(
                originalImage,
                FilterType.Inversion,
                filterHistoryJson,
                brightnessAdjustment
        );

        return convertToByteArray(finalImage, getFileExtension(file.getOriginalFilename()));
    }

    public byte[] processBrightness(MultipartFile file, String filterHistoryJson, int adjustment) throws IOException {
        imageValidator.validate(file);

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage finalImage = applyAllFilters(
                originalImage,
                FilterType.Brightness,
                filterHistoryJson,
                adjustment
        );

        return  convertToByteArray(finalImage, getFileExtension(file.getOriginalFilename()));
    }

    public byte[] processCrop(MultipartFile file, int x1, int y1, int x2, int y2, String filterHistoryJson, int brightnessAdjustment) throws IOException {
        imageValidator.validate(file);

        // 크롭은 히스토리와 밝기 조절의 영향을 받지 않는다고 가정하고 기존 로직 유지
        // 만약 크롭 후에도 밝기/필터가 적용되길 원한다면, 크롭 결과물을 다시 원본처럼 처리해야 함
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        BufferedImage cropImage = cropProcessor.process(originalImage, x1, y1, x2, y2);

        return convertToByteArray(cropImage, getFileExtension(file.getOriginalFilename()));
    }

    // 💡 Byte Array 변환 헬퍼
    private byte[] convertToByteArray(BufferedImage image, String formatName) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, formatName, baos);
        return baos.toByteArray();
    }

    // 💡 파일 확장자 추출 헬퍼
    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "png"; // default
    }

    // 💡 ContentType 설정 헬퍼 (Controller에서 사용)
    public static MediaType getMediaType(String contentType) {
        // e.g., "image/jpeg" -> MediaType.IMAGE_JPEG
        if (contentType == null) {
            return MediaType.IMAGE_PNG;
        }
        return MediaType.parseMediaType(contentType);
    }

    private BufferedImage applyAllFilters(
            BufferedImage originalImage,
            FilterType currentFilterType,
            String filterHistoryJson,
            int brightnessAdjustment )  throws IOException {

        BufferedImage currentImage = originalImage;

        List<FilterType> history = parseFilterHistory(filterHistoryJson);

        //crop은 로직이 복잡해서 일단 grayscale & inversion만 처리
        if(currentFilterType != FilterType.Brightness && currentFilterType != FilterType.Crop) {
            history.add(currentFilterType);
        }

        for (FilterType type : history) {
            switch (type) {
                case GrayScale:
                    currentImage = grayscaleProcessor.process(currentImage);
                    break;
                case Inversion:
                    currentImage = invertProcessor.process(currentImage);
                    break;
                // Crop: 여기에서 크롭을 처리하려면, 크롭 좌표도 history에 저장돼야 함.
                default:
                    break;
            }
        }

        if (brightnessAdjustment != 0 || currentFilterType == FilterType.Brightness) {
            currentImage = brightnessProcessor.process(currentImage, brightnessAdjustment);
        }

        return currentImage;
    }

    private List<FilterType> parseFilterHistory(String json) throws IOException {
        if (json == null || json.isEmpty() || json.equals("[]")) {
            return new ArrayList<>();
        }
        // String -> List<FilterType>으로 변환
        return objectMapper.readValue(json, new TypeReference<List<FilterType>>() {});
    }
}