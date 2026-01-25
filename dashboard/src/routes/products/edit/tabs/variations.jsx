import { Plus, Variable, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const VariationSection = ({ variation, onDelete, onUpdate }) => {
    const handleAddValue = (e) => {
        e.preventDefault();
        const value = e.target.value.value.trim();
        if (value === "") return;

        onUpdate({
            name: variation.name,
            values: [...variation.values, value],
        });
        e.target.reset();
    };

    const handleRemoveValue = (idx) => {
        onUpdate({
            ...variation,
            values: variation.values.filter((_, i) => i !== idx),
        });
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Variation header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                    {variation.name}
                </h3>
                <button
                    onClick={() => onDelete(variation)}
                    className="text-red-600 hover:text-red-700"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Add value input */}
            <form onSubmit={handleAddValue} className="flex gap-3 mb-3">
                <input
                    type="text"
                    name="value"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add value"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    Add
                </button>
            </form>

            {/* List values */}
            <div className="flex flex-wrap gap-2">
                {variation.values.map((value, idx) => (
                    <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                    >
                        {value}
                        <button
                            onClick={() => handleRemoveValue(idx)}
                            className="text-gray-500 hover:text-red-600"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

const VariationsTab = ({ variations = [], setVariations }) => {
    const handleAddVariation = (e) => {
        e.preventDefault();

        const trimmedName = e.target.variation.value.trim();
        if (!trimmedName) return;

        if (
            variations
                .map((item) => item.name.toLowerCase())
                .includes(trimmedName.toLowerCase())
        ) {
            toast.info("Variation already exists!");
            return;
        }

        setVariations((prev) => [...prev, { name: trimmedName, values: [] }]);
        e.target.reset();
    };

    const removeVariation = (variation) => {
        setVariations(
            variations.filter((item) => item.name !== variation.name),
        );
    };

    const updateVariation = (variation) => {
        setVariations((prev) =>
            prev.map((item) =>
                item.name === variation.name ? variation : item,
            ),
        );
    };

    return (
        <div className="space-y-6">
            {/* Add new variation */}
            <form onSubmit={handleAddVariation} className="flex gap-3">
                <input
                    type="text"
                    name="variation"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Variation name (e.g., Color, Size)"
                />
                <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <Plus size={20} /> Add Variation
                </button>
            </form>

            {/* List variations */}
            <div className="space-y-4">
                {variations.map((variation, idx) => (
                    <VariationSection
                        key={idx}
                        variation={variation}
                        onDelete={removeVariation}
                        onUpdate={updateVariation}
                    />
                ))}

                {variations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No variations added yet. Add your first variation above.
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariationsTab;
