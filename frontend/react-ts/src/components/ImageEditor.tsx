import ControlPanel from './ControlPanel'
import EditorPanel from './EditorPanel'
import ImageCanvas from './ImageCanvas'
import { useState } from 'react'

const FILTER_URLS: { [key: string]: string } = {
    "GrayScale": "http://localhost:8080/api/image/grayscale",
    "Inversion": "http://localhost:8080/api/image/invert",
    // "Brightness": "http://localhost:8080/api/image/brightness",
    // "Crop": "http://localhost:8080/api/image/crop",
    // "Reset": "http://localhost:8080/api/image/reset",
};

export default function ImageEditor() {
    // 문자열 or null 둘 다 가능하게 타입 명시
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // 파일 선택했을 때 실행
    const handleOpenPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        }
    };

    // 이미지 프로세싱 처리 요청
    const handleFilter = async (type: string) => {
        if (!file) {
            alert("이미지를 먼저 선택하세요");
            return;
        }

        // 매핑 객체에서 URL 조회
        const url = FILTER_URLS[type];

        if(!url){
            console.warn(`[WARN] 지원하지 않는 형식입니다: ${type}`);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                mode: "cors"
            });

            if(!response.ok){
                throw new Error("[ERROR] 서버 오류");
            }

            const blob = await response.blob(); // 이미지 blob으로 받기

            if(image) {
                URL.revokeObjectURL(image);
            }
            const imageURL = URL.createObjectURL(blob);

            const processedFile = new File([blob], file.name, {type: blob.type});
            setFile(processedFile);
            setImage(imageURL);
        } catch (error) {
            console.error(`[ERROR] ${type} 변환 실패:`, error);
            alert("[ERROR] 이미지 처리 중 오류 발생");
        }
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
        <div className="p-50 flex flex-col gap-y-8 md:gap-y-10 w-full max-w-[1200px] min-h-[80vh] mx-auto">
            <EditorPanel onFilter={handleFilter} />
            <div className="flex flex-col md:flex-row justify-center items-end gap-x-40 gap-y-10 p-8 w-full max-w-[1200px] mx-auto">
                <ImageCanvas image={image} />
                <ControlPanel onOpenPhoto={handleOpenPhoto} onSave={handleSave} />
            </div>
        </div>
    )
}