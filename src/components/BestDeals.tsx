import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const BestDeals = () => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // External image URLs
  const imageUrls = [
    "https://res.cloudinary.com/andikalp/image/upload/v1741069132/id-id_idjnu1.png",
    "https://res.cloudinary.com/andikalp/image/upload/v1741070759/id-id_pjz26n.png",
    "https://res.cloudinary.com/andikalp/image/upload/v1741070861/id-id_xexihd.png",
    "https://res.cloudinary.com/andikalp/image/upload/v1741071012/id-id_dyydo7.png",
    "https://res.cloudinary.com/andikalp/image/upload/v1741071100/id-id_nice83.png",
  ];

  return (
    <section className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800 transition-colors duration-300 hover:text-[#00A9FF] sm:text-3xl lg:text-4xl">
          Best deals for a price-less travel!
        </h2>

        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <Carousel
            plugins={[plugin.current]}
            className="mx-auto"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px]">
              {imageUrls.map((url, index) => (
                <CarouselItem
                  key={index}
                  className="relative w-full overflow-hidden rounded-lg"
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />
                  <Image
                    src={url}
                    alt={`BestDeals${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                    priority={index === 0}
                  />
                  <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6">
                    <span className="inline-block rounded-full bg-[#00A9FF]/90 px-3 py-1 text-xs font-medium text-white sm:text-sm">
                      Special Offer #{index + 1}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 h-8 w-8 border-none bg-white/80 text-gray-800 shadow-md hover:bg-white sm:left-4 sm:h-10 sm:w-10" />
            <CarouselNext className="right-2 h-8 w-8 border-none bg-white/80 text-gray-800 shadow-md hover:bg-white sm:right-4 sm:h-10 sm:w-10" />

            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  className="h-2 w-2 rounded-full bg-white/50 hover:bg-white/90 sm:h-3 sm:w-3"
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>

        <div className="mt-6 text-center"></div>
      </div>
    </section>
  );
};

export default BestDeals;
