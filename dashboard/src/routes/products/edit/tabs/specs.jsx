import { Plus, X } from "lucide-react";
import React, { useState } from "react";

const SpecsTab = ({ specs = [], setSpecs }) => {
    const [newSpecName, setNewSpecName] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");

    const addSpec = () => {
        if (newSpecName.trim() && newSpecValue.trim()) {
            setSpecs([...specs, { name: newSpecName, value: newSpecValue }]);
            setNewSpecName("");
            setNewSpecValue("");
        }
    };

    const removeSpec = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const updateSpec = (index, field, value) => {
        const updated = [...specs];
        updated[index][field] = value;
        setSpecs(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specification name"
                />
                <input
                    type="text"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specification value"
                />
                <button
                    onClick={addSpec}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add
                </button>
            </div>

            <div className="space-y-3">
                {specs.map((spec, index) => (
                    <div
                        key={index}
                        className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                        <input
                            type="text"
                            value={spec.name}
                            onChange={(e) =>
                                updateSpec(index, "name", e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={spec.value}
                            onChange={(e) =>
                                updateSpec(index, "value", e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => removeSpec(index)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}

                {specs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No specifications added yet. Add your first
                        specification above.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecsTab;
