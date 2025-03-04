import { Property as ImportedProperty } from "@/types/property";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import useGetProperties from "../../hooks/api/property/useGetProperties";
import useDebounce from "../../hooks/useDebounce";
import PropertyCard from "../property/components/PropertyCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function PropertyListPage() {
  const router = useRouter();
  const [location] = useState<string>("");
  const [category] = useState<string>("");
  const [checkIn] = useState<Date | undefined>(undefined);
  const [checkOut] = useState<Date | undefined>(undefined);
  const [search] = useState<string>("");
  const [guest] = useState<number | undefined>(undefined);
  const [page] = useState<number>(1);

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

  const handleExploreMore = () => {
    router.push("/property-catalog");
  };

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
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-48">
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {propertyCards}
            </motion.div>

            {/* Explore More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-12 flex justify-center"
            >
              <Button
                onClick={handleExploreMore}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#00A9FF] px-8 py-6 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#0090DB] hover:shadow-lg"
              >
                Explore More Properties
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute -bottom-20 left-0 right-0 h-40 bg-white/10 blur-xl transition-all duration-500 group-hover:bottom-0" />
              </Button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
