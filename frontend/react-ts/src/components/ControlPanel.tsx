interface Props {
    onOpenPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void
    onOpenSearch: () => void;
    onSave: () => void
}

export default function ControlPanel({ onOpenPhoto, onSave, onOpenSearch }: Props) {
    return (
        <div className="flex flex-col gap-4 justify-end items-center md:items-end">
            <label className="border-2 border-black w-48 py-1 font-semibold text-2xl text-center cursor-pointer rounded-md">
                Open Photo
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onOpenPhoto}
                />
            </label>
            <button
                onClick={onOpenSearch}
                className="border-2 border-black w-48 py-1 font-semibold text-2xl rounded-md hover:bg-gray-100"
            >
                Search Online
            </button>
            <button
                onClick={onSave}
                className="border-2 border-black w-48 py-1 font-semibold text-2xl hover:bg-gray-100 rounded-md"
            >
                Save
            </button>
        </div>
    )
}