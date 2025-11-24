import ControlPanel from './ControlPanel'
import EditorPanel from './EditorPanel'
import ImageCanvas from './ImageCanvas'
import ImageFinder from "./ImageFinder.tsx"
import { useImageEditor } from '../hooks/useImageEditor';

export default function ImageEditor() {
    const {
        image,
        isCropMode,
        isBrightnessMode,
        brightnessAdjustment,
        ocrResult,
        handleOpenPhoto,
        handleFilter,
        handleBrightnessChange,
        handleCropAreaSelected,
        openSearchOnline,
        isSearchModalOpen,
        closeSearchOnline,
        handleOpenFromAPI
    } = useImageEditor();

    function handleSavePhoto() {
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
                ocrResult = {ocrResult}
            />
            <div className = "flex flex-col md:flex-row justify-center items-end gap-x-40 gap-y-10 p-8 w-full max-w-[1200px] mx-auto">
                <ImageCanvas
                    image = {image}
                    cropMode = {isCropMode}
                    onCropComplete = {handleCropAreaSelected}
                />
                <ControlPanel
                    onOpenPhoto = {handleOpenPhoto}
                    onOpenSearch={openSearchOnline}
                    onSave = {handleSavePhoto}
                />
            </div>
            {isSearchModalOpen && (
                <ImageFinder
                    isOpen={isSearchModalOpen}
                    onClose={closeSearchOnline}
                    onSelectImage={handleOpenFromAPI}
                />
            )}
        </div>
    )
}