import ControlPanel from './ControlPanel'
import EditorPanel from './EditorPanel'
import ImageCanvas from './ImageCanvas'
import { useState } from 'react'

export default function ImageEditor() {
    // 문자열 or null 둘 다 가능하게 타입 명시
    const [image, setImage] = useState<string | null>(null);

    // 파일 선택했을 때 실행
    function handleOpenPhoto(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImage(previewURL);
        }
    }

    // 이미지 파일 저장할 때 실행
    function handleSave() {
        if (!image) return;
        const link = document.createElement("a");
        link.href = image;
        link.download = "edited_image.png";
        link.click();
    }

    return (
        <div className="p-50 flex flex-col gap-y-8 md:gap-y-10 w-full max-w-[1200px] min-h-[80vh] mx-auto">   <EditorPanel />
            <div className="flex flex-col md:flex-row justify-center items-end gap-x-40 gap-y-10 p-8 w-full max-w-[1200px] mx-auto">
                <ImageCanvas image={image} />
                <ControlPanel onOpenPhoto={handleOpenPhoto} onSave={handleSave} />
            </div>
        </div>
    )
}