interface Props {
    onFilter: (type: string) => void;
    cropMode: boolean;
}

const buttons = ["GrayScale", "Brightness", "Inversion", "Crop", "Reset"];

export default function EditorPanel({ onFilter, cropMode }: Props) {
    return (
        <div className="w-full flex flex-wrap justify-center gap-4 p-4">
            {buttons.map((button) => {
                const isCrop = button === "Crop";

                return (
                    <button
                        key={button}
                        onClick={() => onFilter(button)}
                        className={`
                            border-2 border-black px-4 py-1 font-semibold text-2xl 
                            flex-1 mx-4 rounded-md transition
                            ${isCrop
                            ? (cropMode
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300")
                            : "bg-gray-200 hover:bg-gray-100"
                        }
                        `}
                    >
                        {button}
                    </button>
                );
            })}
        </div>
    );
}