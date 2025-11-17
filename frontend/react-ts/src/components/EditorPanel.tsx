import { useCallback } from 'react';

interface Props {
    onFilter: (type: string) => void;
    cropMode: boolean;
    isBrightnessMode: boolean;
    brightnessAdjustment: number;
    onBrightnessChange: (value: number) => void;
}

const buttons = ["GrayScale", "Brightness", "Inversion", "Crop", "Reset"];

export default function EditorPanel({
    onFilter,
    cropMode,
    isBrightnessMode,
    brightnessAdjustment,
    onBrightnessChange
}: Props) {
    // 이벤트 객체를 받아 값만 넘김
    const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onBrightnessChange(Number(e.target.value));
    }, [onBrightnessChange]);

    return (
        <div className="w-full flex flex-col gap-4 p-4">
            <div className="w-full flex flex-wrap justify-center gap-4 p-4">
                {buttons.map((button) => {
                    const isCrop = button === "Crop";
                    const isBrightness = button === "Brightness"

                    return (
                        <button
                            key={button}
                            onClick={() => onFilter(button)}
                            className={`
                                border-2 border-black px-4 py-1 font-semibold text-2xl 
                                flex-1 mx-4 rounded-md transition
                                ${isCrop
                                ? (cropMode ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300")
                                : isBrightness // 💡 Brightness 모드일 때 배경색 변경
                                    ? (isBrightnessMode ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300")
                                    : "bg-gray-200 hover:bg-gray-100"
                            }
                            `}
                        >
                            {button}
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
        </div>
    );
}