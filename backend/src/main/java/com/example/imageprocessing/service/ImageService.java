package com.example.imageprocessing.service;


import com.example.imageprocessing.domain.ImageValidator;
import com.example.imageprocessing.domain.Pixel;
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

    public ImageService(ImageValidator imageValidator) {
        this.imageValidator = imageValidator;
    }

    public byte[] processGrayscale(MultipartFile file) throws IOException {
        imageValidator.validate(file);

        // multipartfile을 buffredimage로 변환
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 흑백 처리 로직 실행(기존 코드 사용)
        BufferedImage grayscaleImage = convertToGrayscale(originalImage);

        // buffredimage를 byte array로 변환해 반환
        return convertToByteArray(grayscaleImage, getFileExtension(file.getOriginalFilename()));
    }

    public BufferedImage convertToGrayscale(BufferedImage image) {
        BufferedImage grayscaleImage = new BufferedImage(image.getWidth(), image.getHeight(), image.getType());

        for(int y = 0 ; y < image.getHeight() ; y++){
            for(int x = 0 ; x < image.getWidth() ; x++){
                Color color = new Color(image.getRGB(x, y));

                Pixel originalPixel = new Pixel(color.getRed(), color.getGreen(), color.getBlue());

                Pixel grayscalePixel = originalPixel.toGrayScale();

                grayscaleImage.setRGB(x, y, grayscalePixel.toAwtColor().getRGB());
            }
        }

        return grayscaleImage;
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