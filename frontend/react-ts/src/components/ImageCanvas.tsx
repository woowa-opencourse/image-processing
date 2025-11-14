import { useEffect, useRef, useState } from "react";

interface Props {
    image: string | null;
    cropMode: boolean;
    onCropComplete: (coords: { x1: number; y1: number; x2: number; y2: number }) => void;
}

export default function ImageCanvas({ image, cropMode, onCropComplete }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

    // 이미지 로드 → 캔버스에 그리기
    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const img = new Image();
        img.src = image;
        imgRef.current = img;

        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d")!;

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
        };
    }, [image]);

    // 드래그 시작
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!cropMode) return;

        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setStartPos({ x, y });
        setCurrentPos({ x, y });
        setIsDragging(true);
    };

    // 드래그 중
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !cropMode) return;

        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCurrentPos({ x, y });
        drawCanvasWithSelection(startPos.x, startPos.y, x, y);
    };

    // 드래그 종료
    const handleMouseUp = () => {
        if (!isDragging || !cropMode) return;

        setIsDragging(false);

        const { x: x1, y: y1 } = startPos;
        const { x: x2, y: y2 } = currentPos;

        const finalCoords = {
            x1: Math.min(x1, x2),
            y1: Math.min(y1, y2),
            x2: Math.max(x1, x2),
            y2: Math.max(y1, y2),
        };

        onCropComplete(finalCoords);
    };

    const drawCanvasWithSelection = (x1: number, y1: number, x2: number, y2: number) => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;
        const img = imgRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const w = x2 - x1;
        const h = y2 - y1;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x1, y1, w, h);

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(x1, y1, w, h);
    };

    return (
        <div className="border-2 border-black flex justify-center items-center bg-gray-100 w-full max-w-[700px] aspect-[4/3]">
        {image ? (
                <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        cursor: cropMode ? "crosshair" : "default",
                    }}
                />
            ) : (
                <p className="text-lg text-gray-400">이미지를 불러오세요</p>
            )}
        </div>
    );
}