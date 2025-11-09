interface Props {
    onFilter: (type: string) => void
}

const buttons = ['GrayScale', 'Brightness', 'Inversion', 'Crop', 'Reset']

export default function EditorPanel({ onFilter }: Props) {
    return (
        <div
            className="w-full flex flex-wrap justify-center gap-4 p-4"
        >
            {buttons.map((button) => (
                <button
                    key={button}
                    onClick={() => onFilter(button)}
                    className="border-2 border-black px-4 py-1 font-semibold text-2xl hover:bg-gray-100 flex-1 mx-4 rounded-md"
                >
                    {button}
                </button>
            ))}
        </div>
    )
}