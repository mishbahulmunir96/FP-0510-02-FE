"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FC } from "react";
import { GoStarFill } from "react-icons/go";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi";

interface PropertyCardProps {
  imageUrl?: string;
  title: string;
  rating?: number;
  id: number;
}

const PropertyTenantCard: FC<PropertyCardProps> = ({
  imageUrl,
  title,
  rating = 0,
  id,
}) => {
  return (
    <Link href={`/tenant/dashboard/property/management/${id}`}>
      <Card className="group relative transition-shadow duration-200 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-[225px] w-full overflow-hidden rounded-t-lg">
            <Image
              src={imageUrl || "/placeholder-property.jpg"}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority
            />
            {/* Overlay with Update button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="secondary" className="flex items-center gap-2">
                <FiEdit className="h-4 w-4" />
                Update
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
            <div className="flex items-center gap-1">
              <GoStarFill
                className={rating > 0 ? "text-[#fbae2c]" : "text-slate-200"}
              />
              <p className="text-sm font-medium">{rating}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyTenantCard;
