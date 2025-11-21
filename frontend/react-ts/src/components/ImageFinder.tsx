import { useState } from "react";
import { callPixabayAPI } from "../api/imageApi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (url: string) => void;
}

export default function ImageFinder({ isOpen, onClose, onSelectImage }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSearch() {
        setLoading(true);
        const images = await callPixabayAPI(query);
        setResults(images);
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-[600px]">
                <h2 className="text-2xl font-bold mb-4">Search Online Images</h2>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className="border p-2 w-full mb-4"
                />
                <button
                    onClick={handleSearch}
                    className="border-2 border-black font-semibold p-2 w-full bg-gray-200 mb-4 rounded-md"
                >
                    Search
                </button>
                {loading && <p>Loading...</p>}
                <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-auto">
                    {results.map((img) => (
                        <img
                            key={img.id}
                            src={img.previewURL}
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => {
                                onSelectImage(img.largeImageURL);
                                onClose();
                            }}
                        />
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 border-2 border-black font-semibold w-full p-2 bg-gray-100 rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
}