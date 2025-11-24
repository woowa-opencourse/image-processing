package com.example.imageprocessing.domain;

import java.awt.*;

public class Pixel {
    private final int red;
    private final int green;
    private final int blue;

    private final int max = 255;
    private final int min = 0;

    // AWT Color 객체를 받아서 domain 객체로 변환
    public Pixel(int red, int green, int blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    // AWT Color로 변환
    public Color toAwtColor() {
        return new Color(red, green, blue);
    }

    public Pixel toGrayScale() {
        double rawY = GrayscaleWeights.RED_SENSITIVITY * red + GrayscaleWeights.GREEN_SENSITIVITY * green + GrayscaleWeights.BLUE_SENSITIVITY * blue;
        int Y = (int) Math.round(rawY);

        return new Pixel(Y, Y, Y);
    }

    public Pixel toInvert() {
        int invertedR = max - red;
        int invertedG = max - green;
        int invertedB = max - blue;

        return new Pixel(invertedR, invertedG, invertedB);
    }

    public Pixel adjustBrightness(int adjustment) {
        int newR = clamp(red + adjustment);
        int newG = clamp(green + adjustment);
        int newB = clamp(blue + adjustment);

        return new Pixel(newR, newG, newB);
    }

    private int clamp(int value) {
        return Math.max(min, Math.min(max, value));
    }
}
