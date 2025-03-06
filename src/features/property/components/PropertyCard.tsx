import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { formatRupiah } from "@/utils/formatrupiah";

const LocationIcon = () => (
  <svg
    className="h-5 w-5 text-[#00A9FF]"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1114 0z"
    />
  </svg>
);

const PriceIcon = () => (
  <svg
    className="h-5 w-5 text-[#00A9FF]"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 10h10M7 14h10M9 6l-2 2m8-2l2 2m-2 10l2 2m-8-2l-2 2"
    />
  </svg>
);
interface PropertyCardProps {
  property: Property;
}

const PropertyCard: FC<PropertyCardProps> = ({ property }) => {
  const mainImage =
    property.propertyImage && property.propertyImage.length > 0
      ? property.propertyImage[0].imageUrl
      : "/placeholder.png";
  const lowestPrice =
    property.room && property.room.length > 0
      ? Math.min(...property.room.map((r) => r.price))
      : 0;
  const categoryName = property.propertyCategory?.name || "Uncategorized";

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group block transform transition-all duration-300 hover:-translate-y-2"
    >
      <Card className="h-full overflow-hidden rounded-2xl border-none bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        <CardHeader className="relative h-48 w-full overflow-hidden p-0 sm:h-56 lg:h-64">
          <Image
            src={mainImage ?? "/placeholder.png"}
            alt={property.title}
            fill
            className="transform object-cover transition-all duration-700 group-hover:scale-110"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-4 top-4 z-10">
            <Badge
              variant="default"
              className="rounded-full bg-white/95 px-4 py-1 text-xs font-medium text-[#00A9FF] shadow-sm backdrop-blur-sm"
            >
              {categoryName}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4 p-6">
          <div className="min-h-[80px]">
            <h2 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-[#00A9FF]">
              {property.title}
            </h2>
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
              {property.description}
            </p>
          </div>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <LocationIcon />
              <span className="line-clamp-1">
                {property.location || "Location unavailable"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <PriceIcon />
              <span className="font-medium text-[#00A9FF]">
                {lowestPrice > 0
                  ? formatRupiah(lowestPrice)
                  : "Price on request"}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              className="relative w-full overflow-hidden rounded-full bg-[#00A9FF] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0098e5]"
              type="button"
            >
              <span className="relative z-10">View Details</span>
              <div className="absolute inset-0 transform transition-transform duration-300 group-hover:scale-110" />
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
