# Image Processing

우아한 테크코스 프리코스 오픈 미션


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
| **패키지**      | **구성**           | **역할 및 확장 방향** |
|--------------|------------------|----------------|
|              | main.tsx         |                |
|              | App.tsx          |                |
| `api`        |                  |                |
| `assets`     | images           |                |
|              | styles/index.css |                |
| `components` | ImageEditor.tsx  |                |
|              | ImageCanvas.tsx  |                |
|              | EditorPanel.tsx  |                |
|              | ControlPanel.tsx |                |

### A. 프로젝트 구조 - backend
| **패키지**      | **구성**            | **역할 및 확장 방향** |
|--------------|-------------------|----------------|
| `controller` | `ImageController` | 프로그램의 흐름 제어    |
| `service`    | `ImageService`    |                |
| `domain`     |                   |                |

## 🚨 예외 처리 (오류 검증)