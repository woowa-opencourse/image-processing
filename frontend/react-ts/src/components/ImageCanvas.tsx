interface Props {
    image: string | null
}

export default function ImageCanvas({ image }: Props) {
    return (
        <div className="border-2 border-black flex justify-center items-center bg-gray-100 w-full max-w-[700px] aspect-[4/3]
    ">           {image ? (
                <img src={image} alt="preview" className="object-contain max-h-full" />
            ) : (
                <p className="text-lg text-gray-400">이미지를 불러오세요</p>
            )}
        </div>
    )
}