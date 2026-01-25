import { useState } from "react";
import { ArrowLeft, Plus, X, Save, Loader } from "lucide-react";
import BasicTab from "./tabs/basic";
import VariationsTab from "./tabs/variations";
import SpecsTab from "./tabs/specs";
import DescriptionTab from "./tabs/description";
import { generatePath, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useCreateProductMutation,
    useInsertProductDescriptionMutation,
    useInsertProductSpecsMutation,
    useInsertProductVariationsMutation,
    useUpdateProductMutation,
} from "../../../store/features/products/productsApiSlice";

const tabs = [
    { id: "basic", label: "Basic Information" },
    { id: "variations", label: "Variations" },
    { id: "specs", label: "Specifications" },
    { id: "description", label: "Description" },
];

const isSameArray = (a, b) => {
    if ((!a || a.length === 0) && (!b || b.length === 0)) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;

    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
};

const isSameObject = (a, b) => {
    if (
        (!a || Object.keys(a).length === 0) &&
        (!b || Object.keys(b).length === 0)
    )
        return true;
    if (!a || !b) return false;

    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return (
        ka.length === kb.length &&
        ka.every((key) => key in b && a[key] === b[key])
    );
};

const genFormData = (basic) => {
    const { images = [], ...rest } = basic;

    const formData = new FormData();
    const imagesArray = [];

    // loop once
    images.forEach((item) => {
        // case 1: already a string (existing image)
        if (typeof item === "string") {
            imagesArray.push(item);
            return;
        }

        // case 2: object with File inside
        if (item?.file instanceof File) {
            formData.append("images", item.file);
            return;
        }
    });

    // attach string images to JSON
    formData.append(
        "data",
        JSON.stringify({
            ...rest,
            images: imagesArray,
        }),
    );

    return formData;
};

export default function EditProductPage() {
    const navigate = useNavigate();
    const response = useLoaderData();

    if (response && !response.data) {
        toast.error("Product not Found!");
        navigate("/products", { replace: true });
        return null;
    }
    const product = response?.data;

    const [activeTab, setActiveTab] = useState("basic");
    const [message, setMessage] = useState(null);

    // Mutations
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [insertVariations] = useInsertProductVariationsMutation();
    const [insertSpecs] = useInsertProductSpecsMutation();
    const [insertDescription] = useInsertProductDescriptionMutation();

    // Data States
    const [basic, setBasic] = useState({
        ...product,
        variations: undefined,
        specs: undefined,
        description: undefined,
    });
    const [variations, setVariations] = useState(product?.variations ?? []);
    const [specs, setSpecs] = useState(product?.specs ?? []);
    const [description, setDescription] = useState(product?.description ?? {});

    const createProductItems = async () => {
        // Check if all data is valid
        if (specs.length < 1)
            throw new Error("Minimum 1 Specification required");
        if (description.description === "")
            throw new Error("Description content required");

        setMessage({ text: "Operation started", type: "success" });

        const formData = genFormData(basic);
        const { data } = await createProduct({ body: formData }).unwrap();
        const productId = data?.id;
        if (!productId)
            throw new Error(
                data.data?.message ?? "Failed to insert basic data",
            );

        setBasic((prev) => ({ ...prev, id: productId }));
        setMessage({ text: "Basic Data inserted", type: "success" });

        await insertVariations({
            body: { data: variations, productId },
        }).unwrap();
        setMessage({ text: "Variations inserted", type: "success" });

        await insertSpecs({ body: { data: specs, productId } }).unwrap();
        setMessage({ text: "Specs inserted", type: "success" });

        await insertDescription({
            body: { ...description, productId },
        }).unwrap();
        setMessage({ text: "Description inserted", type: "success" });
    };
    const updateProductItems = async () => {
        setMessage({ text: "Operation started", type: "success" });

        if (
            !isSameObject(
                {
                    ...product,
                    variations: undefined,
                    specs: undefined,
                    description: undefined,
                },
                basic,
            )
        ) {
            const formData = genFormData({ ...basic, id: undefined });
            await updateProduct({ id: basic.id, body: formData }).unwrap();
            setMessage({ text: "Basic data updated", type: "success" });
        }

        if (!isSameArray(variations, product.variations)) {
            await insertVariations({
                body: { productId: product.id, data: variations },
            }).unwrap();
            setMessage({ text: "Variations updated", type: "success" });
        }

        if (!isSameArray(specs, product.specs)) {
            await insertSpecs({
                body: { productId: product.id, data: specs },
            }).unwrap();
            setMessage({ text: "Specs updated", type: "success" });
        }

        if (!isSameObject(description, product.description)) {
            console.log(
                description,
                product.description,
                isSameArray(description, product.description),
            );

            await insertDescription({
                body: {
                    productId: product.id,
                    banner: description.banner ?? undefined,
                    content: description.content ?? undefined,
                    video: description.video ?? undefined,
                },
            }).unwrap();
            setMessage({ text: "Description updated", type: "success" });
        }
    };

    const handleSave = async () => {
        const update = basic.id;

        try {
            if (update) {
                await updateProductItems();
                toast.success("Product Updated successfully!");
            } else {
                await createProductItems();
                toast.success("Product Created successfully!");
            }

            setMessage({ text: "Operation complete", type: "success" });
            setTimeout(() => {
                setMessage(null);
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error(
                error?.data?.message ??
                    error?.message ??
                    "Failed to Create Product!",
            );
            setMessage(null);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {product && (
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {product ? "Edit" : "Create"} Product
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {product
                                ? "Update product details and inventory"
                                : "Add a new product to your inventory"}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="mt-4 flex items-center gap-2">
                    {message && (
                        <>
                            <p
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    message.type === "error"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {message.text || message}
                            </p>
                            {message.type === "success" && (
                                <Loader
                                    className="animate-spin text-gray-600"
                                    size={24}
                                />
                            )}
                        </>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                    <Save size={20} />
                    Save {product?.id && "Changes"}
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Basic Information Tab */}
                    {activeTab === "basic" && (
                        <BasicTab basic={basic} setBasic={setBasic} />
                    )}

                    {/* Variations Tab */}
                    {activeTab === "variations" && (
                        <VariationsTab
                            variations={variations}
                            setVariations={setVariations}
                        />
                    )}

                    {/* Specifications Tab */}
                    {activeTab === "specs" && (
                        <SpecsTab specs={specs} setSpecs={setSpecs} />
                    )}

                    {/* Description Tab */}
                    {activeTab === "description" && (
                        <DescriptionTab
                            descriptions={description}
                            setDescriptions={setDescription}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
