package com.example.imageprocessing.domain;

import java.awt.*;

public class Pixel {
    private final int red;
    private final int green;
    private final int blue;

    // AWT Color 객체를 받아서 domain 객체로 변환하는 팩토리 메소드
    public Pixel(int red, int green, int blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    // AWT Color로 변환하는 메소드
    public Color toAwtColor() {
        return new Color(red, green, blue);
    }

    public Pixel toGrayScale() {
        double rawY = GrayscaleWeights.RED_SENSITIVITY * red + GrayscaleWeights.GREEN_SENSITIVITY * green + GrayscaleWeights.BLUE_SENSITIVITY * blue;
        int Y = (int) Math.round(rawY);

        return new Pixel(Y, Y, Y);
    }
}
