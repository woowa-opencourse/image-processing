package com.example.imageprocessing.domain;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@Component
public class ImageValidator {
    private String wrapError(String msg) {
        return "[ERROR] " + msg;
    }

    public void validate(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(wrapError("파일이 존재하지 않습니다."));
        }

        // ImageIO.read는 유효하지 않은 포맷일 경우 null을 반환함
        BufferedImage image = ImageIO.read(file.getInputStream());

        if (image == null) {
            throw new IllegalArgumentException(wrapError("지원하지 않는 파일 형식 또는 유효하지 않은 이미지 파일입니다."));
        }
    }
}
