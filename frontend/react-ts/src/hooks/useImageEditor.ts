import {useState, useCallback} from "react";
import { callFilterAPI } from '../api/imageApi';

export type FilterType = 'GrayScale' | 'Inversion' | 'Brightness' | 'Crop' | 'Reset';
// 'BackgroundRemove', 'TextExtraction' 추가

const FILTER_URLS: { [key: string]: string } = {
    "GrayScale": "/api/image/grayscale",
    "Inversion": "/api/image/invert",
    "Brightness": "/api/image/brightness",
    "Crop": "/api/image/crop"
    //'BackgroundRemove', 'TextExtraction' 추가
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


    // 모든 상태를 초기화하는 함수
    const resetState = useCallback((resetFile: File | null) => {
        setIsCropMode(false);
        setIsBrightnessMode(false);
        setBrightnessAdjustment(0);
        setFilterHistory([]);
        setBaseFileForBrightness(null);

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

        const selectedFile = e.target.files?.[0];
        if(!selectedFile){
            return;
        }

        setOriginalFile(selectedFile);
        resetState(selectedFile);
    }, [resetState]);

    // 이미지 처리 요청
    const handleFilter = useCallback(async (type: FilterType) => {
        if(!file){
            alert("이미지를 먼저 선택하세요.");
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

        const newHistory = [...filterHistory, type];
        setFilterHistory(newHistory);

        const extraData: Record<string, string> = {
            "filterHistory": JSON.stringify(newHistory),
            "adjustment": String(brightnessAdjustment)
        };


        // callFilterAPI를 통해 파일 업데이트 및 이미지 url 설정
        await callFilterAPI(file!, url, setFile, setImage, extraData);
    }, [file, originalFile, resetState, setFile, setImage, filterHistory, brightnessAdjustment]);

    // brightness 슬라이더 변경 핸들러
    const handleBrightnessChange = useCallback(async (value: number) => {
        if (!baseFileForBrightness) {
            return;
        }
        setBrightnessAdjustment(value);

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
        handleOpenPhoto,
        handleFilter,
        handleBrightnessChange,
        handleCropAreaSelected,
    }
}