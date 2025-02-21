import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";

const BestDeals = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  const imagePaths = [
    "/BestDeals1.svg",
    "/BestDeals2.svg",
    "/BestDeals3.svg",
    "/BestDeals4.svg",
    "/BestDeals5.svg",
  ];

  return (
    <div className="container mx-auto max-w-7xl">
      <h2 className="mb-9 text-center text-3xl font-semibold">
        Best deals for a price-less travel!
      </h2>
      <div>
        <Carousel plugins={[plugin.current]} className="mx-auto">
          <CarouselContent className="h-[300px]">
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/BestDeals1.svg"
                alt="BestDeals1"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/BestDeals2.svg"
                alt="BestDeals2"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/BestDeals3.svg"
                alt="BestDeals4"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/BestDeals4.svg"
                alt="BestDeals4"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/BestDeals5.svg"
                alt="BestDeals5"
                fill
                className="object-cover"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default BestDeals;
