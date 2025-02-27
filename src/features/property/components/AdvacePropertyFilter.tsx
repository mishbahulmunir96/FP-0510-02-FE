import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Star,
  DollarSign,
  Hotel,
  Home,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/formatrupiah";

interface FilterProps {
  onFilterChange: (filters: PropertyFilters) => void;
  className?: string;
}

export interface PropertyFilters {
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  rating: number | null;
}

const defaultPriceRange: [number, number] = [200000, 5000000]; // Rupiah
const defaultPropertyTypes: string[] = [];
const defaultAmenities: string[] = [];

const propertyTypeOptions = [
  { id: "hotel", label: "Hotel", icon: <Hotel className="h-4 w-4" /> },
  { id: "villa", label: "Villa", icon: <Home className="h-4 w-4" /> },
  {
    id: "apartment",
    label: "Apartment",
    icon: <Building className="h-4 w-4" />,
  },
];

const amenityOptions = [
  { id: "wifi", label: "WiFi" },
  { id: "pool", label: "Swimming Pool" },
  { id: "parking", label: "Free Parking" },
  { id: "ac", label: "Air Conditioning" },
  { id: "breakfast", label: "Breakfast Included" },
  { id: "gym", label: "Fitness Center" },
];

const AdvancedPropertyFilter: React.FC<FilterProps> = ({
  onFilterChange,
  className,
}) => {
  const [priceRange, setPriceRange] =
    useState<[number, number]>(defaultPriceRange);
  const [propertyTypes, setPropertyTypes] =
    useState<string[]>(defaultPropertyTypes);
  const [amenities, setAmenities] = useState<string[]>(defaultAmenities);
  const [rating, setRating] = useState<number | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  // Effect untuk menghitung jumlah filter aktif
  useEffect(() => {
    let count = 0;

    // Hitung filter harga jika berbeda dari default
    if (
      priceRange[0] !== defaultPriceRange[0] ||
      priceRange[1] !== defaultPriceRange[1]
    ) {
      count += 1;
    }

    // Tambahkan jumlah tipe properti yang dipilih
    count += propertyTypes.length;

    // Tambahkan jumlah amenitas yang dipilih
    count += amenities.length;

    // Tambahkan 1 jika rating diset
    if (rating !== null) {
      count += 1;
    }

    setActiveFiltersCount(count);
  }, [priceRange, propertyTypes, amenities, rating]);

  // Effect untuk mengirim perubahan filter ke parent component
  useEffect(() => {
    onFilterChange({
      priceRange,
      propertyTypes,
      amenities,
      rating,
    });
  }, [priceRange, propertyTypes, amenities, rating, onFilterChange]);

  // Handler untuk mengubah tipe properti
  const handlePropertyTypeChange = (id: string, checked: boolean) => {
    if (checked) {
      setPropertyTypes([...propertyTypes, id]);
    } else {
      setPropertyTypes(propertyTypes.filter((type) => type !== id));
    }
  };

  // Handler untuk mengubah amenitas
  const handleAmenityChange = (id: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, id]);
    } else {
      setAmenities(amenities.filter((amenity) => amenity !== id));
    }
  };

  // Handler untuk mereset semua filter
  const handleResetFilters = () => {
    setPriceRange(defaultPriceRange);
    setPropertyTypes(defaultPropertyTypes);
    setAmenities(defaultAmenities);
    setRating(null);
  };

  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Filter Pencarian
          </h3>
          {activeFiltersCount > 0 && (
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-blue-700"
            >
              {activeFiltersCount} aktif
            </Badge>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["price", "property-type"]}>
        {/* Filter Harga */}
        <AccordionItem value="price">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span>Rentang Harga</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-6">
              <div className="pt-2">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={100000}
                  max={10000000}
                  step={100000}
                  onValueChange={(values: number[]) =>
                    setPriceRange([values[0], values[1]])
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {formatRupiah(priceRange[0])}
                </div>
                <div className="text-sm font-medium">
                  {formatRupiah(priceRange[1])}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filter Tipe Properti */}
        <AccordionItem value="property-type">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Tipe Properti</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-3">
              {propertyTypeOptions.map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={propertyTypes.includes(type.id)}
                    onCheckedChange={(checked: boolean) =>
                      handlePropertyTypeChange(type.id, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`type-${type.id}`}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    {type.icon}
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filter Fasilitas */}
        <AccordionItem value="amenities">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-blue-600" />
              <span>Fasilitas</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              {amenityOptions.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={amenities.includes(amenity.id)}
                    onCheckedChange={(checked: boolean) =>
                      handleAmenityChange(amenity.id, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`amenity-${amenity.id}`}
                    className="cursor-pointer text-sm"
                  >
                    {amenity.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Filter Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              <span>Rating Minimum</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  variant={rating === value ? "default" : "outline"}
                  size="sm"
                  className={`h-10 w-10 rounded-full p-0 ${
                    rating === value
                      ? "bg-blue-600 text-white"
                      : "border-gray-300 text-gray-600"
                  }`}
                  onClick={() => setRating(rating === value ? null : value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tombol Reset */}
      {activeFiltersCount > 0 && (
        <div className="border-t border-gray-100 p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResetFilters}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedPropertyFilter;
