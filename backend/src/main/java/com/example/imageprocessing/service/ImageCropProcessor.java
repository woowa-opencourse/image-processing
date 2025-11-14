package com.example.imageprocessing.service;

import java.awt.image.BufferedImage;

public interface ImageCropProcessor {
    BufferedImage process(BufferedImage image, int x1, int y1, int x2, int y2);
}