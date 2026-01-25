import BannerSection from "@/components/Banner";
import { ProductSection } from "@/sections/home";
import {
    Smartphone,
    Tablet,
    Headphones,
    Watch,
    Zap,
    Truck,
    CreditCard,
    ShieldCheck,
    Wrench,
} from "lucide-react";

const features = [
    {
        icon: <Zap className="h-8 w-8" />,
        title: "36 Months EMI",
        desc: "Flexible payment options",
    },
    {
        icon: <Truck className="h-8 w-8" />,
        title: "Fast Delivery",
        desc: "Quick home delivery",
    },
    {
        icon: <CreditCard className="h-8 w-8" />,
        title: "Best Prices",
        desc: "Competitive pricing",
    },
    {
        icon: <ShieldCheck className="h-8 w-8" />,
        title: "Warranty",
        desc: "Official warranty",
    },
    {
        icon: <Wrench className="h-8 w-8" />,
        title: "After Sales",
        desc: "Dedicated support",
    },
];

export default function Home() {
    // const featuredProducts = [
    //     {
    //         id: 1,
    //         name: "iPhone 15 Pro Max",
    //         price: 145000,
    //         originalPrice: 155000,
    //         rating: 4.8,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 2,
    //         name: "Samsung Galaxy S24 Ultra",
    //         price: 125000,
    //         originalPrice: 135000,
    //         rating: 4.7,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 3,
    //         name: "MacBook Air M3",
    //         price: 120000,
    //         originalPrice: null,
    //         rating: 4.9,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 4,
    //         name: "iPad Pro 12.9",
    //         price: 95000,
    //         originalPrice: 105000,
    //         rating: 4.8,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 5,
    //         name: "AirPods Pro 2",
    //         price: 28000,
    //         originalPrice: 32000,
    //         rating: 4.7,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 6,
    //         name: "Apple Watch Series 9",
    //         price: 45000,
    //         originalPrice: null,
    //         rating: 4.6,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 7,
    //         name: "Sony WH-1000XM5",
    //         price: 32000,
    //         originalPrice: 38000,
    //         rating: 4.9,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    //     {
    //         id: 8,
    //         name: "Samsung Galaxy Tab S9",
    //         price: 65000,
    //         originalPrice: 72000,
    //         rating: 4.5,
    //         images: ["https://picsum.photos/400/400"],
    //     },
    // ];

    // const newArrivals = [...featuredProducts];

    // const bestDeals = [...featuredProducts];

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setCurrentSlide((prev) => (prev + 1) % banners.length);
    //     }, 5000);
    //     return () => clearInterval(timer);
    // }, []);

    // const nextSlide = () =>
    //     setCurrentSlide((prev) => (prev + 1) % banners.length);
    // const prevSlide = () =>
    //     setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

    const categories = [
        {
            name: "Mobile Phones",
            icon: <Smartphone className="h-12 w-12" />,
            count: "500+",
        },
        {
            name: "Tablets",
            icon: <Tablet className="h-12 w-12" />,
            count: "150+",
        },
        {
            name: "Audio Devices",
            icon: <Headphones className="h-12 w-12" />,
            count: "300+",
        },
        {
            name: "Smart Watches",
            icon: <Watch className="h-12 w-12" />,
            count: "200+",
        },
    ];

    return (
        <>
            {/* Hero Banner Slider */}
            <BannerSection />

            {/* Features Section */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center max-md:last:col-span-2"
                        >
                            <div className="text-blue-600 flex justify-center mb-2">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                                {feature.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto py-12">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
                    Featured Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition cursor-pointer border border-gray-200"
                        >
                            <div className="text-blue-600 flex justify-center mb-4">
                                {category.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {category.count} Products
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products Section */}
            <ProductSection
                title="Featured Products"
                params={{ limit: "10", tag: "FEATURED" }}
            />

            {/* New Arrivals Section */}
            <ProductSection title="New Arrivals" params={{ limit: "10" }} />

            {/* Best Deals Section */}
            <ProductSection
                title="Best Deals"
                params={{ limit: "10", tag: "BEST_DEAL" }}
            />

            {/* About Section */}
            <div className="max-w-5xl mx-auto">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                    Bangladesh's Trusted Gadgets E-Commerce Store
                </h2>
                <div className="text-gray-600 leading-relaxed space-y-4">
                    <p>
                        Gadgets Area has emerged as a premier destination for
                        genuine electronics and accessories in Bangladesh. We
                        provide you with reliable brands all in one place, from
                        the newest smartphones and tablets to robust laptops and
                        wearables.
                    </p>
                    <p>
                        Our collection fits every lifestyle, whether you're a
                        student, tech enthusiast, or regular user. We always
                        strive to provide excellent service, prompt delivery,
                        and authentic products. Additionally, our customer care
                        representatives are available to help you with warranty
                        inquiries, product selections, and post-purchase
                        assistance.
                    </p>
                </div>
            </div>
        </>
    );
}
