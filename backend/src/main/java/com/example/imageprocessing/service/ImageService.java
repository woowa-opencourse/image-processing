package com.example.imageprocessing.service;


import com.example.imageprocessing.domain.ImageValidator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ImageService {
    private final ImageValidator imageValidator;
    private final ImageProcessor grayscaleProcessor;
    private final ImageProcessor invertProcessor;
    private final BrightnessProcessor brightnessProcessor;
    private final ImageCropProcessor cropProcessor;

    public ImageService(ImageValidator imageValidator,
                        ImageProcessor grayscaleProcessor,
                        ImageProcessor invertProcessor,
                        BrightnessProcessor brightnessProcessor,
                        ImageCropProcessor cropProcessor) {
        this.imageValidator = imageValidator;
        this.grayscaleProcessor = grayscaleProcessor;
        this.invertProcessor = invertProcessor;
        this.brightnessProcessor = brightnessProcessor;
        this.cropProcessor = cropProcessor;
    }

    public byte[] processGrayscale(MultipartFile file) throws IOException {
        imageValidator.validate(file);

        // multipartfile을 buffredimage로 변환
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 흑백 처리 로직 실행(Processor에 위임)
        BufferedImage grayscaleImage = grayscaleProcessor.process(originalImage);

        // buffredimage를 byte array로 변환해 반환
        return convertToByteArray(grayscaleImage, getFileExtension(file.getOriginalFilename()));
    }

    public byte[] processInvert(MultipartFile file) throws IOException {
        imageValidator.validate(file);

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage invertedImage = invertProcessor.process(originalImage);

        return convertToByteArray(invertedImage, getFileExtension(file.getOriginalFilename()));
    }

    public byte[] processBrightness(MultipartFile file, int adjustment) throws IOException {
        imageValidator.validate(file);

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage brightnessImage = brightnessProcessor.process(originalImage, adjustment);

        return  convertToByteArray(brightnessImage, getFileExtension(file.getOriginalFilename()));
    }

    public byte[] processCrop(MultipartFile file, int x1, int y1, int x2, int y2) throws IOException {
        imageValidator.validate(file);

        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        BufferedImage cropped = cropProcessor.process(originalImage, x1, y1, x2, y2);

        return convertToByteArray(cropped, getFileExtension(file.getOriginalFilename()));
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
}