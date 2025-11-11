package com.example.imageprocessing.service;

import com.example.imageprocessing.domain.Pixel;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.awt.image.BufferedImage;

@Component
public class BrightnessProcessor {

    public BufferedImage process(BufferedImage image, int adjustment) {
        BufferedImage brightenedImage = new BufferedImage(image.getWidth(), image.getHeight(), image.getType());

        for(int y = 0 ; y < image.getHeight() ; y++){
            for(int x = 0 ; x < image.getWidth() ; x++){
                Color color = new Color(image.getRGB(x, y));

                Pixel originalPixel = new Pixel(color.getRed(), color.getGreen(), color.getBlue());

                Pixel brightenedPixel = originalPixel.adjustBrightness(adjustment);

                brightenedImage.setRGB(x, y, brightenedPixel.toAwtColor().getRGB());
            }
        }

        return brightenedImage;
    }
}
