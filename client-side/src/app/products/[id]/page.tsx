import { Truck, ShieldCheck, RefreshCw } from "lucide-react";
import Gallery from "./components/Gallery";
import Interactions from "./components/Interactions";
import TabContents from "./components/TabContents";
import { API_BASE_URL } from "@/store/app/baseApi/baseApiSlice";
import { notFound } from "next/navigation";
import { Metadata } from "next";

const enumToLabel = (value: string) => {
    return value
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getProduct = async (id: string) => {
    return await (await fetch(`${API_BASE_URL}/products/${id}`)).json();
};

export async function generateMetadata({
    params,
}: {
    params: Promise<Record<string, string>>;
}): Promise<Metadata> {
    const { id } = await params;

    const product = (await getProduct(id)).data

    return {
        title: product.name,
        description: product.description?.content,
    };
}

const ProductDetails = async ({
    params,
}: {
    params: Promise<Record<string, string>>;
}) => {
    const { id } = await params;
    let response: Record<string, any> | null = null;
    try {
        response = await getProduct(id);
    } catch (error) {
        console.error(error);
    }

    if (!response?.success) {
        return notFound();
    }
    const product = response.data;

    const discount = product.purchasePrice - product.price;
    return (
        <div className="">
            <div className="max-w-7xl mx-auto py-8">
                {/* Hero Contents Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Images */}
                    <Gallery images={product.images} />

                    {/* Right: Product Info */}
                    <div className="col-span-3">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            {/* Brand */}
                            {product.brand && (
                                <div className="mb-4">
                                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                                        {product.brand}
                                    </span>
                                </div>
                            )}

                            {/* Product Name */}
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-xl sm:text-4xl font-bold text-blue-600">
                                        ৳ {product.price.toLocaleString()}
                                    </span>
                                    {discount > 0 && (
                                        <>
                                            <span className="text-base sm:text-2xl text-gray-400 line-through">
                                                ৳{" "}
                                                {product.purchasePrice.toLocaleString()}
                                            </span>
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                                                ৳{discount} OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    (Cash Price)
                                </p>
                            </div>

                            {/* Availability */}
                            <div className="mb-6 flex items-center gap-2">
                                <span className="font-semibold text-gray-700">
                                    Availability:
                                </span>
                                <span className={`font-semibold`}>
                                    {enumToLabel(product.availability)}
                                </span>
                                <span className="text-gray-500">
                                    ({product.stock} items)
                                </span>
                            </div>

                            {/* User Interacted section (client) */}
                            <Interactions product={product} />

                            {/* Features */}
                            <div className="flex max-sm:flex-col justify-between gap-3 border-t pt-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    <span>Delivery: 3-5 Days</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    <span>Official Warranty</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <RefreshCw className="h-5 w-5 text-blue-600" />
                                    <span>7 Days Return Policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-8 bg-white rounded-lg border border-gray-200">
                    <TabContents
                        tabs={[
                            { label: "Specifications", value: "specs" },
                            { label: "Description", value: "description" },
                            { label: "Video", value: "video" },
                        ]}
                    >
                        <div data-key={"specs"}>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                                Specifications
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <tbody>
                                        {product.specs?.map(
                                            (
                                                spec: {
                                                    name: string;
                                                    value: string;
                                                },
                                                idx: number,
                                            ) => (
                                                <tr
                                                    key={idx}
                                                    className={
                                                        idx % 2 === 0
                                                            ? "bg-gray-50"
                                                            : "bg-white"
                                                    }
                                                >
                                                    <td className="py-3 px-4 max-sm:text-sm font-semibold text-gray-700 w-1/3">
                                                        {spec.name}
                                                    </td>
                                                    <td className="py-3 px-4 max-sm:text-sm text-gray-600">
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {product.description?.content && (
                            <div data-key={"description"}>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: product.description.content,
                                    }}
                                    className="text-gray-600"
                                ></div>
                            </div>
                        )}

                        {product.description?.video && (
                            <div data-key={"video"}>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                                    Product Video
                                </h2>
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <iframe
                                        src={product.description.video}
                                        className="w-full h-full rounded-lg"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </TabContents>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
