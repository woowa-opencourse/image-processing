# Image Processing

우아한 테크코스 프리코스 오픈 미션

배포 URL: https://image-processing-puce.vercel.app/

## 📖 목차
* [주요 기능](#-주요-기능)
* [구현 기능 목록](#-구현-기능-목록)
* [예외 처리](#-예외-처리-오류-검증)


## ✨ 주요 기능
### 기존 기능

1. 이미지 업로드 & 저장
2. 흑백 전환
3. 밝기 조절
4. 이미지 crop
5. 색 반전
6. 편집 한 내용 reset

<img src="https://github.com/woowa-opencourse/image-processing/blob/Heera/resources/default1.png?raw=true" width="300" height="200" />
<img src="https://github.com/woowa-opencourse/image-processing/blob/Heera/resources/default2.png?raw=true" width="300" height="200" />


### 추가 기능
1. Image Processing 내

    - 콜라주
    - 객체 추출
    - 글자 추출
    - 이미지 합성


2. Image Processing 외

    - 로그인 기능
    - DB 기능(기존의 이미지 저장 기능과 연결)
    - 이미지에 그림 그리기

## 📝 구현 기능 목록
### A. 프로젝트 구조 - frontend
| **패키지**      | **구성**            | **역할 및 확장 방향**         |
|--------------|-------------------|------------------------|
|              | main.tsx          | 프론트 실행 시작점             |
|              | App.tsx           | 이미지 편집 메인 컴포넌트         |
| `api`        | imageApi.ts       | 이미지 프로세싱 API 호출        |
| `assets`     | images            | 로컬 이미지 리소스             |
|              | styles/index.css  | Tailwind 초기 설정         |
| `components` | ImageEditor.tsx   | 이미지 편집 기능 메인 컨테이너      |
|              | ImageCanvas.tsx   | 편집 중인 이미지 표시 및 크롭 영역 처리 |
|              | EditorPanel.tsx   | 이미지 편집 기능 패널           |
|              | ControlPanel.tsx  | 이미지 업로드 및 저장 패널      |
|              | ImageFinder.tsx  | 온라인 이미지 검색 UI          |
| `hooks`      | useImageEditor.ts | 커스텀 훅                  |

### A. 프로젝트 구조 - backend
| **패키지**      | **구성**                      | **역할 및 확장 방향**          |
|--------------|-----------------------------|-------------------------|
| `conig`      | VisionConfig.java        | Google Vision API 인증 설정 |
| `controller` | GlobalExceptionHandler.java        | 전역 예외 처리                |
|              | ImageController.java | 이미지 필터 처리 요청 관리         |
|              | OcrController.java | 이미지에서 텍스트 (OCR) 추출 처리   |
|              | PixabayController.java | Pixabay 이미지 검색 API 호출   |
| `domain`     | GrayscaleWeights.java        | 흑백 변환 가중치 제공            |
|              | ImageValidator.java | 업로드 이미지 유효성 검사          |
|              | Pixel.java | 이미지 픽셀 RGB 연산 담당        |
| `service`    | BrightnessProcessor.java           | 이미지 밝기 조절 처리 로직         |
|              | CropProcessor.java         | 지정 영역 이미지 크롭 처리 로직      |
|              | FilterType.java             | 필터 종류 정의                |
|              | GrayscaleProcessor.java| 이미지 흑백 변환 처리 로직         |
|              | ImageProcessor.java         | 필터 처리 공통 인터페이스          |
|              | ImageService.java         | 이미지 편집 작업 통합 처리 서비스 로직  |
|              | InvertProcessor.java         | 이미지 색상 반전 처리 로직         |