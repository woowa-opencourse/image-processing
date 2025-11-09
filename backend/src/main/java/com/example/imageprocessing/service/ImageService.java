package com.example.imageprocessing.service;

public ImageService(){
    private static final float RED_SENSITIVITY = 0.2126;
    private static final float GREEN_SENSITIVITY = 0.7152;
    private static final float BLUE_SENSITIVITY = 0.0722;

    public byte[] processGrayscale(MultipartFile file) throws IOException {
        // multipartfile을 buffredimage로 변환
        BufferedImage originalImage = ImageIO.read(file.getInputStream())
        if(originalImage == null){
            throw new IlligalArgumentException("[ERROR] 유효한 이미지 파일이 아닙니다.");
        }

        // 흑백 처리 로직 실행(기존 코드 사용)
        BufferedImage grayscaleImage = convertToGrayscale(originalImage);

        // buffredimage를 byte array로 변환해 반환
        return convertToByteArray(grayscaleImage, getFileExtension(file.getOriginalFilename()));
    }

    private BufferedImage convertToGrayscale(BufferedImage image) {
        BufferedImage grayscaleImage = new BufferedImage(image.getWidth(), image.getHeight(), image.getType());

        for(int y = 0 ; y < image.getHeight() ; y++){
            for(int x = 0 ; x < image.getWidth() ; x++){
                Color color = new Color(image.getRGB(x, y));

                int Y = weightedAvgCalculation(color.getRed(), color.getGreen(), color.getBlue());

                grayscaleImage.setRGB(x, y, new Color(Y, Y, Y).getRGB());
            }
        }

        return grayscaleImage;
    }

    private int weightedAvgCalculation(int r, int g, int b){
        return (int) (RED_SENSITIVITY * r + GREEN_SENSITIVITY * g + BLUE_SENSITIVITY * b);
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
        if (contentType == null) return MediaType.IMAGE_PNG;
        return MediaType.parseMediaType(contentType);
    }
}