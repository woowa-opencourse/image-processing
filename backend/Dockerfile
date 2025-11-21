FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드
# --no-daemon 옵션은 CI/CD 환경에서 권장됨
RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon

# 2. 실행 단계 (경량 JRE 사용)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]