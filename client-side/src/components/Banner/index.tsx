"use client";

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const BannerSection = () => {
    const banners = [
        "/assets/banner01.webp",
        "/assets/banner02.webp",
        "/assets/banner03.webp",
        "/assets/banner04.webp",
        "/assets/banner05.webp",
    ];
    return (
        <div className="relative overflow-hidden max-w-7xl mx-auto mb-12">
            <Carousel
                showArrows={true}
                showIndicators
                showStatus={false}
                showThumbs={false}
                autoPlay
                infiniteLoop
                // onChange={onChange}
                // onClickItem={onClickItem}
                // onClickThumb={onClickThumb}
            >
                {banners.map((banner) => (
                    <div className="h-96 md:h-125">
                        <img src={banner} alt="Banner Image" />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default BannerSection;
