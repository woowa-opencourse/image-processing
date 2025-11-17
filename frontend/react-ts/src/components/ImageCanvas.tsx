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

    const drawImageToCanvas = (img: HTMLImageElement) => {
        const canvas = canvasRef.current!;
        const container = canvas.parentElement!;
        const ctx = canvas.getContext("2d")!;

        const containerW = container.clientWidth;
        const containerH = container.clientHeight;

        const imgRatio = img.width / img.height;
        const containerRatio = containerW / containerH;

        if (imgRatio > containerRatio) {
            canvas.style.width = "100%";
            canvas.style.height = "auto";
        } else {
            canvas.style.width = "auto";
            canvas.style.height = "100%";
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };

    const drawSelection = (x1: number, y1: number, x2: number, y2: number) => {
        const canvas = canvasRef.current!;
        const img = imgRef.current!;
        const ctx = canvas.getContext("2d")!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    };

    const getCanvasCoords = (e: React.MouseEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    useEffect(() => {
        if (!image || !canvasRef.current) return;

        const img = new Image();
        img.src = image;

        img.onload = () => {
            imgRef.current = img;
            drawImageToCanvas(img);
        };

        img.onerror = () => console.error("이미지 로딩 실패!");
    }, [image]);

    useEffect(() => {
        const resizeHandler = () => {
            if (imgRef.current) drawImageToCanvas(imgRef.current);
        };
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!cropMode) return;

        const { x, y } = getCanvasCoords(e);

        setStartPos({ x, y });
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !cropMode) return;

        const { x, y } = getCanvasCoords(e);

        drawSelection(startPos.x, startPos.y, x, y);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging || !cropMode) return;
        setIsDragging(false);

        // ← mouseup 시점의 위치로 확정하는 것이 더 정확함
        const { x, y } = getCanvasCoords(e);

        const x1 = Math.min(startPos.x, x);
        const y1 = Math.min(startPos.y, y);
        const x2 = Math.max(startPos.x, x);
        const y2 = Math.max(startPos.y, y);

        onCropComplete({ x1, y1, x2, y2 });
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
                        cursor: cropMode ? "crosshair" : "default",
                    }}
                />
            ) : (
                <p className="text-lg text-gray-400">이미지를 불러오세요</p>
            )}
        </div>
    );
}