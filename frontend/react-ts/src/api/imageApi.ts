import * as React from "react";

export async function callFilterAPI(
    currentFile: File,
    url: string,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
    extraData: Record<string, string> = {}
) {
    const formData = new FormData();
    formData.append("file", currentFile);

    Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try{
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`[ERROR] 서버 오류: ${response.status} - ${errorText}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        const processedFile = new File([blob], currentFile.name, {type: blob.type});
        setFile(processedFile);
        setImage(imageUrl);
    } catch(error){
        console.error("[ERROR] 이미지 처리 실패: ", error);
        alert("[ERROR] 이미지 처리 중 오류 발생");
        throw error;
    }
}