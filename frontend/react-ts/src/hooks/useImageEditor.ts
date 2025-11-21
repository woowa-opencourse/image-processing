import {useState, useCallback} from "react";
import {callFilterAPI, callOcrAPI} from '../api/imageApi';

export type FilterType = 'GrayScale' | 'Inversion' | 'Brightness' | 'Crop' | 'Reset' | 'OCR';

const FILTER_URLS: { [key: string]: string } = {
    "GrayScale": "/api/image/grayscale",
    "Inversion": "/api/image/invert",
    "Brightness": "/api/image/brightness",
    "Crop": "/api/image/crop",
    "OCR": "/api/image/ocr"
}

export function useImageEditor() {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [isBrightnessMode, setIsBrightnessMode] = useState(false);
    const [brightnessAdjustment, setBrightnessAdjustment] = useState(0);
    const [isCropMode, setIsCropMode] = useState(false);
    const [filterHistory, setFilterHistory] = useState<FilterType[]>([]);
    const [baseFileForBrightness, setBaseFileForBrightness] = useState<File | null>(null);
    const [ocrResult, setOcrResult] = useState<string | null>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const openSearchOnline = () => setIsSearchModalOpen(true);
    const closeSearchOnline = () => setIsSearchModalOpen(false);

    // 모든 상태를 초기화하는 함수
    const resetState = useCallback((resetFile: File | null) => {
        setIsCropMode(false);
        setIsBrightnessMode(false);
        setBrightnessAdjustment(0);
        setFilterHistory([]);
        setBaseFileForBrightness(null);
        setOcrResult(null);

        if(resetFile){
            setFile(resetFile);
            const resetUrl = URL.createObjectURL(resetFile);
            setImage(resetUrl);
        }
    }, []);

    // 파일 선택 핸들러
    const handleOpenPhoto = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(null);
        setImage(null);
        setFilterHistory([]);
        setBrightnessAdjustment(0);
        setIsCropMode(false);
        setIsBrightnessMode(false);
        setOcrResult(null);

        const selectedFile = e.target.files?.[0];
        if(!selectedFile){
            return;
        }

        setOriginalFile(selectedFile);
        resetState(selectedFile);
    }, [resetState]);

    // Pixabay 이미지 받아서 File로 변환 후 로드하는 기능
    async function handleOpenFromAPI(url: string) {
        const blob = await fetch(url).then((r) => r.blob());
        const file = new File([blob], "pixabay_image.jpg", { type: blob.type });

        setOriginalFile(file);
        setFile(file);

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    }

    // 이미지 처리 요청
    const handleFilter = useCallback(async (type: FilterType) => {
        if(!file){
            alert("이미지를 먼저 선택하세요.");
            return;
        }

        if (type === "OCR") {
            setOcrResult("텍스트 인식 중...");
            const url = FILTER_URLS[type];

            try {
                const resultText = await callOcrAPI(file, url);
                setOcrResult(resultText);
            } catch (error) {
                console.error("OCR 처리 중 오류 발생:", error);
                setOcrResult("OCR 인식 실패: " + (error instanceof Error ? error.message : "알 수 없는 오류"));
            }
            return;
        }

        if(type == "Reset"){
            if(!originalFile){
                alert("되돌릴 원본 이미지가 없습니다.");
                return;
            }

            resetState(originalFile);
            return;
        }

        if(type == "Brightness"){
            if (!isBrightnessMode) {
                setBaseFileForBrightness(file);
            }

            setIsBrightnessMode(prev => !prev);
            setIsCropMode(false);
            return;
        }

        if(type == "Crop"){
            setIsCropMode(true);
            setIsBrightnessMode(false);
            return;
        }

        const url = FILTER_URLS[type];
        if(!url){
            return;
        }

        setIsCropMode(false);
        setIsBrightnessMode(false);
        setBaseFileForBrightness(null);
        setOcrResult(null);

        const newHistory = [...filterHistory, type];
        setFilterHistory(newHistory);

        const extraData: Record<string, string> = {
            "filterHistory": JSON.stringify(newHistory),
            "adjustment": String(brightnessAdjustment)
        };

        try {
            // callFilterAPI를 통해 파일 업데이트 및 이미지 url 설정
            await callFilterAPI(file!, url, setFile, setImage, extraData);
            setFilterHistory(newHistory); // 성공 시에만 히스토리 업데이트
        } catch (error) {
            console.error("필터 처리 중 오류 발생:", error);
        }
    }, [file, originalFile, resetState, setFile, setImage, filterHistory, brightnessAdjustment]);

    // brightness 슬라이더 변경 핸들러
    const handleBrightnessChange = useCallback(async (value: number) => {
        if (!baseFileForBrightness) {
            return;
        }
        setBrightnessAdjustment(value);
        setOcrResult(null);

        await callFilterAPI(baseFileForBrightness, FILTER_URLS["Brightness"], setFile, setImage, {
            "filterHistory": JSON.stringify(filterHistory),
            "brightnessAdjustment": String(value)
        });
    }, [baseFileForBrightness, filterHistory]);

    // Crop 완료 핸들러
    const handleCropAreaSelected = useCallback(async (coords: { x1: number; y1: number; x2: number; y2: number }) => {
        if (!file || !coords) return;

        setIsCropMode(false);
        setIsBrightnessMode(false);
        setBaseFileForBrightness(null);
        setOcrResult(null);

        await callFilterAPI(file, FILTER_URLS["Crop"], setFile, setImage, {
            "x1": String(Math.round(coords.x1)),
            "y1": String(Math.round(coords.y1)),
            "x2": String(Math.round(coords.x2)),
            "y2": String(Math.round(coords.y2)),
        });
    }, [file]);

    // ImageEditor.tsx 컴포넌트로 반환할 모든 상태와 함수
    return {
        image,
        isCropMode,
        isBrightnessMode,
        brightnessAdjustment,
        ocrResult,
        handleOpenPhoto,
        handleFilter,
        handleBrightnessChange,
        handleCropAreaSelected,
        isSearchModalOpen,
        openSearchOnline,
        closeSearchOnline,
        handleOpenFromAPI,
    }
}