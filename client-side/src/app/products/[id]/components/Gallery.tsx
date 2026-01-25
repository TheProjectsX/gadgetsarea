"use client";

const Gallery = ({ images }: { images: string[] }) => {
    return (
        <div className="col-span-2 gallery">
            {/* Main Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
                <div className="aspect-square flex items-center justify-center text-9xl">
                    <img
                        src={images[0]}
                        alt="Product Image"
                        className="gallery-image"
                    />
                </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        onClick={(e) => {
                            const target = (e.target ??
                                e.currentTarget) as HTMLImageElement;

                            const image = target
                                .closest(".gallery")
                                ?.querySelector(
                                    ".gallery-image",
                                ) as HTMLImageElement | null;

                            if (image) {
                                image.src = img;
                            }
                            target.parentNode
                                ?.querySelectorAll("img")
                                .forEach((img) =>
                                    img.classList.remove("active"),
                                );
                            target.classList.add("active");
                        }}
                        className={`shrink-0 w-20 h-20 rounded border-2 transition border-gray-200 active [&.active]:border-blue-600! bg-white flex items-center justify-center text-3xl`}
                    />
                ))}
            </div>
        </div>
    );
};
export default Gallery;
