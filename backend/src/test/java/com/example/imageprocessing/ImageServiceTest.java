package com.example.imageprocessing;

import com.example.imageprocessing.service.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.awt.Color;
import java.awt.image.BufferedImage;
import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ImageService 단위 테스트")
class ImageServiceTest {

    private ImageService imageService;

    @BeforeEach
    void setUp() {
        imageService = new ImageService();
    }

    // 💡 테스트 헬퍼 메서드: 특정 색상의 1x1 BufferedImage를 생성
    private BufferedImage createSinglePixelImage(Color color) {
        BufferedImage image = new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB);
        image.setRGB(0, 0, color.getRGB());
        return image;
    }

    @Test
    @DisplayName("흑백 변환 시 표준 Luminosity 공식이 정확히 적용된다.")
    void convertToGrayscale_정확한_Luminosity_계산() {
        // given: 순수한 빨간색 픽셀 (255, 0, 0)
        Color red = new Color(255, 0, 0);
        BufferedImage originalImage = createSinglePixelImage(red);

        // 예상되는 흑백 값 Y = 0.2126 * 255 + 0.7152 * 0 + 0.0722 * 0 = 54.213 -> (int) 54
        int expectedY = 54;

        // when
        BufferedImage grayscaleImage = imageService.convertToGrayscale(originalImage);

        // then: 흑백 이미지의 픽셀이 예상된 흑백 값으로 변환되었는지 확인
        Color convertedColor = new Color(grayscaleImage.getRGB(0, 0));

        // 1. R, G, B 값이 모두 같아야 흑백임
        assertThat(convertedColor.getRed()).isEqualTo(convertedColor.getGreen());
        assertThat(convertedColor.getGreen()).isEqualTo(convertedColor.getBlue());

        // 2. 흑백 값이 예상되는 Luminosity 값과 일치해야 함
        assertThat(convertedColor.getRed()).isEqualTo(expectedY);
    }

    @Test
    @DisplayName("흰색 픽셀은 흰색으로, 검은색 픽셀은 검은색으로 유지된다.")
    void convertToGrayscale_경계값_유지() {
        // given
        BufferedImage whiteImage = createSinglePixelImage(Color.WHITE); // (255, 255, 255)
        BufferedImage blackImage = createSinglePixelImage(Color.BLACK); // (0, 0, 0)

        // when
        BufferedImage convertedWhite = imageService.convertToGrayscale(whiteImage);
        BufferedImage convertedBlack = imageService.convertToGrayscale(blackImage);

        // then
        // 흰색은 그대로 흰색(255)
        assertThat(new Color(convertedWhite.getRGB(0, 0)).getRed()).isEqualTo(255);
        // 검은색은 그대로 검은색(0)
        assertThat(new Color(convertedBlack.getRGB(0, 0)).getRed()).isEqualTo(0);
    }

}