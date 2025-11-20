import { useCallback } from 'react';
import type {FilterType} from "../hooks/useImageEditor.ts";

interface Props {
    onFilter: (type: FilterType) => void;
    cropMode: boolean;
    isBrightnessMode: boolean;
    brightnessAdjustment: number;
    onBrightnessChange: (value: number) => void;
    ocrResult: string | null;
}

const buttons: FilterType[] = ["GrayScale", "Brightness", "Inversion", "Crop", "Reset", "OCR"];

export default function EditorPanel({
    onFilter,
    cropMode,
    isBrightnessMode,
    brightnessAdjustment,
    onBrightnessChange,
    ocrResult
}: Props) {
    const isOcrLoading = ocrResult === "텍스트 인식 중...";
    const isOcrError = ocrResult && ocrResult.includes("OCR 인식 실패");

    // 이벤트 객체를 받아 값만 넘김
    const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onBrightnessChange(Number(e.target.value));
    }, [onBrightnessChange]);

    const renderOcrResult = () => {
        if (!ocrResult || ocrResult === "") {
            return null;
        }

        if (isOcrLoading) {
            // 로딩 상태 (Tailwind CSS 스피너 예시)
            return (
                <div className="flex flex-col items-center justify-center p-6 text-blue-600 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 border-4 border-blue-200 border-l-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-2 text-lg font-semibold">텍스트 인식 중...</p>
                </div>
            );
        }

        // 결과 또는 에러 표시
        return (
            <div className="w-full flex flex-col gap-2 p-4 border border-gray-300 rounded-md bg-white">
                <h4 className="text-xl font-bold">OCR 추출 결과</h4>
                <textarea
                    readOnly
                    className={`
                        w-full min-h-[150px] p-3 text-sm rounded-lg border resize-y 
                        ${isOcrError ? 'border-red-500 bg-red-50 text-red-800' : 'border-gray-300 bg-gray-100 text-gray-800'}
                    `}
                    value={ocrResult}
                    placeholder={isOcrError ? "OCR 처리 중 오류가 발생했습니다." : "추출된 텍스트입니다."}
                    rows={8}
                />
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <div className="w-full flex flex-wrap justify-center gap-4 p-4">
                {buttons.map((button) => {
                    const isCrop = button === "Crop";
                    const isBrightness = button === "Brightness"
                    const isOcr = button === "OCR";

                    const ocrClass = isOcr
                        ? (isOcrLoading ? "bg-yellow-500 text-white cursor-not-allowed opacity-70" : "bg-green-500 text-white hover:bg-green-600")
                        : null;

                    const buttonContent = isOcr && isOcrLoading ? "인식 중..." : button;

                    return (
                        <button
                            key={button}
                            onClick={() => onFilter(button)}
                            disabled={isOcr && isOcrLoading}
                            className={`
                                border-2 border-black px-4 py-1 font-semibold text-2xl 
                                flex-1 mx-4 rounded-md transition
                                ${isCrop
                                ? (cropMode ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300")
                                : isBrightness
                                    ? (isBrightnessMode ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300")
                                    : isOcr
                                        ? ocrClass
                                        : "bg-gray-200 hover:bg-gray-100"
                            }
                            `}
                        >
                            {buttonContent}
                        </button>
                    );
                })}
            </div>
            {isBrightnessMode && (
                <div className="flex flex-col items-center gap-2 p-2 border border-gray-300 rounded-md bg-white">
                    <span className="text-lg front-medium">
                        밝기 조절: {brightnessAdjustment}
                    </span>
                    <input
                        type = "range"
                        min = "-100"
                        max = "100"
                        step = "1" // 1단계씩 조절
                        value = {brightnessAdjustment}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                    />
                </div>
            )}

            {renderOcrResult()}
        </div>
    );
}