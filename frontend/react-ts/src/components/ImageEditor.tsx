import ControlPanel from './ControlPanel'
import EditorPanel from './EditorPanel'
import ImageCanvas from './ImageCanvas'
import { useState, useCallback } from 'react'

const FILTER_URLS: { [key: string]: string } = {
    "GrayScale": "http://localhost:8080/api/image/grayscale",
    "Inversion": "http://localhost:8080/api/image/invert",
    "Brightness": "http://localhost:8080/api/image/brightness",
    "Crop": "http://localhost:8080/api/image/crop"
};

export default function ImageEditor() {
    // 문자열 or null 둘 다 가능하게 타입 명시
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const [originalFile, setOriginalFile] = useState<File | null>(null);

    //Brightness 관련 변수
    const [isBrightnessMode, setIsBrightnessMode] = useState(false);
    const [brightnessAdjustment, setBrightnessAdjustment] = useState(0); // 슬라이더 변수

    // Crop 모드 여부
    const [isCropMode, setIsCropMode] = useState(false);

    const callFilterAPI = useCallback(async (currentFile: File, url: string, extraData: Record<string, string> = {}) => {
        const formData = new FormData();
        formData.append("file", currentFile);

        Object.entries(extraData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try{
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                mode: "cors"
            });

            if(!response.ok){
                throw new Error("[ERROR] 서버 오류")
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // 처리된 파일을 새 file 객체로 업데이트
            const processedFile = new File([blob], currentFile.name, { type: blob.type});
            setFile(processedFile);
            setImage(imageUrl);
        } catch (error){
            console.error("[ERROR] 이미지 처리 실패: ", error);
            alert("[ERROR] 이미지 처리 중 오류 발생");
        }
    }, [setFile, setImage]); // 의존성 배열

    // 파일 선택했을 때 실행
    const handleOpenPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const url = URL.createObjectURL(selectedFile);

        setFile(selectedFile);
        setImage(url);
        setOriginalFile(selectedFile);

        setIsCropMode(false);
        setIsBrightnessMode(false);
        setBrightnessAdjustment(0);
    };

    // 이미지 프로세싱 처리 요청
    const handleFilter = async (type: string) => {
        if (!file) {
            alert("이미지를 먼저 선택하세요");
            return;
        }

        if (type === "Reset") {
            if (!originalFile) {
                alert("되돌릴 원본 이미지가 없습니다.");
                return;
            }

            const resetUrl = URL.createObjectURL(originalFile);

            setImage(resetUrl);
            setFile(originalFile);

            setIsCropMode(false);
            setIsBrightnessMode(false);
            setBrightnessAdjustment(0);
            return;
        }

        // Brightness 버튼 - 슬라이더 토글
        if(type == "Brightness"){
            const newState = !isBrightnessMode;
            setIsBrightnessMode(newState);
            setIsCropMode(false);
        }

        // Crop 모드면 handleCropFilter로 넘김
        if (type === "Crop") {
            setIsCropMode(true);
            setIsBrightnessMode(false);
            setBrightnessAdjustment(0);
            return;
        }

        // 매핑 객체에서 URL 조회
        const url = FILTER_URLS[type];
        if(!url){
            console.warn(`[WARN] 지원하지 않는 형식입니다: ${type}`);
            return;
        }

        setIsCropMode(false);
        setIsBrightnessMode(false);
        setBrightnessAdjustment(0);

        // API 호출
        await callFilterAPI(file, url);
    };

    // Brightness 슬라이더 값 변경 핸들러
    const handleBrightnessChange = async (value: number) => {
        if(!originalFile){
            return;
        }

        // 슬라이더 값 업데이트
        setBrightnessAdjustment(value);

        // 실시간 조절은 항상 원본 파일을 기준으로 API 호출
        const url = FILTER_URLS["Brightness"];

        await callFilterAPI(originalFile, url, {
            "adjustment": String(value)
        });
    }

    // crop 좌표를 캔버스에서 받아 실행
    const handleCropAreaSelected = async (coords: { x1: number; y1: number; x2: number; y2: number }) => {
        if (!file || !coords) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("x1", String(Math.round(coords.x1)));
        formData.append("y1", String(Math.round(coords.y1)));
        formData.append("x2", String(Math.round(coords.x2)));
        formData.append("y2", String(Math.round(coords.y2)));

        const response = await fetch("http://localhost:8080/api/image/crop", {
            method: "POST",
            body: formData,
        });

        if(!response.ok){
            alert("크롭 실패");
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImage(url);
        setIsCropMode(false);
    };

    // 이미지 파일 저장할 때 실행
    function handleSave() {
        if (!image) return;
        const link = document.createElement("a");
        link.href = image;
        link.download = "edited_image.png";
        link.click();
    }

    return (
        <div className = "p-50 flex flex-col gap-y-8 md:gap-y-10 w-full max-w-[1200px] min-h-[80vh] mx-auto">
            <EditorPanel
                onFilter = {handleFilter}
                cropMode = {isCropMode}
                isBrightnessMode = {isBrightnessMode}
                brightnessAdjustment = {brightnessAdjustment}
                onBrightnessChange = {handleBrightnessChange}
            />
            <div className = "flex flex-col md:flex-row justify-center items-end gap-x-40 gap-y-10 p-8 w-full max-w-[1200px] mx-auto">
                <ImageCanvas
                    image = {image}
                    cropMode = {isCropMode}
                    onCropComplete = {handleCropAreaSelected}
                />
                <ControlPanel
                    onOpenPhoto = {handleOpenPhoto}
                    onSave = {handleSave} />
            </div>
        </div>
    )
}