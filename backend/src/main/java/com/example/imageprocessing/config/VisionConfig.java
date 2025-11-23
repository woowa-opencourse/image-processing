package com.example.imageprocessing.config;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.cloud.vision.v1.ImageAnnotatorSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@Configuration
public class VisionConfig {

    @Bean
    public ImageAnnotatorClient imageAnnotatorClient() throws IOException {

        String jsonCredentials = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");

        if (jsonCredentials == null) {
            throw new IllegalStateException(
                    "환경 변수 GOOGLE_CREDENTIALS_JSON 이 설정되지 않았습니다!"
            );
        }

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ByteArrayInputStream(jsonCredentials.getBytes(StandardCharsets.UTF_8)))
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        return ImageAnnotatorClient.create(settings);
    }
}
