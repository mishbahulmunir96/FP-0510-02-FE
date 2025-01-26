"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { jumbotronItems } from "../const";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const Jumbotron = () => {
  return (
    <div className="mb-8 sm:mb-12 md:mb-20">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {jumbotronItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-0 sm:p-1">
                <Card className="overflow-hidden">
                  <CardContent className="relative h-[280px] w-full overflow-hidden rounded-lg sm:h-[320px] md:h-[400px] lg:h-[480px]">
                    {/* Background image */}
                    <Image
                      src={item.imageUrl}
                      alt={`jumbotron-${index}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
                      priority={index === 0}
                    />

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/40 p-4 text-white backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-auto sm:rounded-md">
                      <h3 className="mb-1 text-xl font-semibold sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigasi next / prev. Di-hide di layar kecil */}
        <CarouselPrevious className="hidden xl:flex" />
        <CarouselNext className="hidden xl:flex" />
      </Carousel>
    </div>
  );
};

export default Jumbotron;
