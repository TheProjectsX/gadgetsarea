const DescriptionTab = ({ descriptions = {}, setDescriptions }) => {
    return (
        <div className="space-y-6">
            {/* <SingleImageUploader
                image={descriptions?.banner}
                setImage={(value) => {
                    console.log(value);
                    setDescriptions((prev) => ({ ...prev, banner: value }));
                }}
            /> */}
            {/* Let's skip for now */}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                </label>
                <input
                    type="text"
                    value={descriptions.video}
                    onChange={(e) =>
                        setDescriptions((prev) => ({
                            ...prev,
                            video: e.target.value,
                        }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/video.mp4"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={descriptions.content}
                    onChange={(e) =>
                        setDescriptions((prev) => ({
                            ...prev,
                            content: e.target.value,
                        }))
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder='{"content": "Product description here"}'
                />
            </div>
        </div>
    );
};

export default DescriptionTab;
