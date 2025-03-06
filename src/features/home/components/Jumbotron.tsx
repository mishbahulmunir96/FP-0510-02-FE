"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { jumbotronItems } from "../const";

const Jumbotron = () => {
  return (
    <div className="mb-8 sm:mb-12 md:mb-14">
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
              <div className="p-2 sm:p-4">
                <Card className="overflow-hidden rounded-b-3xl">
                  <CardContent className="relative h-[280px] w-full overflow-hidden rounded-b-3xl sm:h-[320px] md:h-[400px] lg:h-[580px]">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={`jumbotron-${index}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
                      priority={index === 0}
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
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
      </Carousel>
    </div>
  );
};

export default Jumbotron;
