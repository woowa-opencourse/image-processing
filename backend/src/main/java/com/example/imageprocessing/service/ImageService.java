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

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage finalImage = applyAllFilters(
                originalImage,
                FilterType.GrayScale,
                filterHistoryJson,
                brightnessAdjustment
        );

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

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage cropImage = cropProcessor.process(originalImage, x1, y1, x2, y2);

        return convertToByteArray(cropImage, getFileExtension(file.getOriginalFilename()));
    }

    // Byte Array 변환 헬퍼
    private byte[] convertToByteArray(BufferedImage image, String formatName) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, formatName, baos);
        return baos.toByteArray();
    }

    // 파일 확장자 추출 헬퍼
    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "png";
    }

    // ContentType 설정 헬퍼 (Controller에서 사용)
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

        return objectMapper.readValue(json, new TypeReference<List<FilterType>>() {});
    }
}