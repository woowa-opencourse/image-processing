package com.example.imageprocessing.service;

import org.springframework.stereotype.Component;
import java.awt.image.BufferedImage;

@Component
public class CropProcessor {

    public BufferedImage process(BufferedImage image, int x1, int y1, int x2, int y2) {

        int width = x2 - x1;
        int height = y2 - y1;

        return image.getSubimage(x1, y1, width, height);
    }
}