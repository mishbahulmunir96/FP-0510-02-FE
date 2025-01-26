import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const ImageContainer = () => {
  return (
    <div className="grid h-96 grid-cols-4 grid-rows-2 gap-2">
      <div className="relative col-span-2 row-span-2">
        <Image
          src="/images/room.avif"
          alt="Balcony view of Salalune apartments"
          fill
          className="rounded-l-xl object-cover"
        />
      </div>
      <div className="relative">
        <Image
          src="/images/room.avif"
          alt="Bedroom with green walls"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative">
        <Image
          src="/images/room.avif"
          alt="Living area with TV"
          fill
          className="rounded-tr-xl object-cover"
        />
      </div>
      <div className="relative">
        <Image
          src="/images/room.avif"
          alt="Another view of bedroom"
          fill
          className="object-cover"
        />
      </div>
      <div className="group relative">
        <Image
          src="/images/room.avif"
          alt="Additional room view"
          fill
          className="rounded-br-xl object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center rounded-br-xl bg-black/40 transition-colors hover:bg-black/50">
          <Button variant="secondary" className="gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Tampilkan semua foto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageContainer;
