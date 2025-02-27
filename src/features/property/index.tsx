import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import useDebounce from "../../hooks/useDebounce";
import useGetProperties from "../../hooks/api/property/useGetProperties";
import PropertyCard from "../property/components/PropertyCard";
import PropertyNavigation from "../property/components/PropertyNavigation";
import { Property as ImportedProperty } from "@/types/property";

// Keep existing interfaces
interface PropertyImage {
  imageUrl?: string;
  id?: string;
  propertyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PropertyCategory {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Room {
  id?: string;
  propertyId?: string;
  name?: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

type Property = ImportedProperty;

interface ApiResponse {
  data: {
    data: Property[];
    meta?: {
      total?: number;
      lastPage?: number;
      currentPage?: number;
      perPage?: number;
      prev?: number | null;
      next?: number | null;
    };
  };
}

interface GetPropertiesParams {
  page: number;
  location?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  guest?: number;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function PropertyListPage() {
  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [guest, setGuest] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const debouncedSearch = useDebounce(search, 500);
  const formattedStartDate = checkIn ? formatDate(checkIn) : "";
  const formattedEndDate = checkOut ? formatDate(checkOut) : "";

  const { data, isLoading, isError } = useGetProperties({
    page,
    location,
    category,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    search: debouncedSearch,
    guest,
  });

  const propertyCards = useMemo(() => {
    return (
      data?.data?.data.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: "easeOut",
          }}
          className="transform-gpu"
        >
          <PropertyCard property={property} />
        </motion.div>
      )) ?? []
    );
  }, [data]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-[#CDF5FD]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"
        >
          <h1 className="text-3xl font-bold text-[#00A9FF]">Oops!</h1>
          <p className="mt-4 text-gray-600">
            Failed to load properties. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex h-64 flex-col items-center justify-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-[#00A9FF]" />
            <span className="mt-4 text-base font-medium text-gray-600">
              Loading amazing properties...
            </span>
          </motion.div>
        ) : !data?.data?.data?.length ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex h-64 flex-col items-center justify-center text-center"
          >
            <div className="rounded-full bg-[#A0E9FF]/20 p-4">
              <Search className="h-12 w-12 text-[#00A9FF]" />
            </div>
            <p className="mt-6 text-xl font-medium text-gray-800">
              No properties found
            </p>
            <p className="mt-2 text-gray-600">
              Try adjusting your search criteria
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {propertyCards}
          </motion.div>
        )}
      </main>
    </div>
  );
}
