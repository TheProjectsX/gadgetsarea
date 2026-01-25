import { X } from "lucide-react";

export const MultiImageUploader = ({
    images = [],
    setImages,
    className = "",
}) => {
    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImages([...images, ...previews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className={`w-full mx-auto space-y-4 ${className}`}>
            <label className="block">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
                <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-gray-600 hover:border-gray-400 w-full">
                    Click to upload images
                </div>
            </label>

            <div className="grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={typeof img === "string" ? img : img.url}
                            alt=""
                            className="h-24 w-full rounded object-cover"
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 hidden rounded bg-black/70 px-2 py-1 text-xs text-white group-hover:block cursor-pointer hover:text-black hover:bg-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SingleImageUploader = ({ image, setImage, className = "" }) => {
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage({
            file,
            url: URL.createObjectURL(file),
        });
    };

    const clearImage = () => {
        setImage(null);
    };

    return (
        <div className={`w-full max-w-xl mx-auto ${className}`}>
            <label className="block cursor-pointer">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />

                {!image ? (
                    <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400">
                        Click to upload image
                    </div>
                ) : (
                    <div className="relative w-full group">
                        <img
                            src={image.url}
                            alt=""
                            className="w-full rounded-lg object-cover"
                        />

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                clearImage();
                            }}
                            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-sm text-white opacity-0 transition group-hover:opacity-100 z-10 cursor-pointer hover:text-black hover:bg-white"
                        >
                            <X size={16} />
                        </button>

                        {/* Click overlay to reselect */}
                        <div className="absolute inset-0 rounded-lg bg-black/0 hover:bg-black/10" />
                    </div>
                )}
            </label>
        </div>
    );
};
