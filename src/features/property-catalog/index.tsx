// src/pages/PropertyListPage.tsx
"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { format } from "date-fns";
import useGetProperties from "../../hooks/api/property/useGetProperties";
import PropertyCard from "../property/components/PropertyCard";
import PropertyNavigation from "../property/components/PropertyNavigation";
import PaginationSection from "../../components/PaginationSection";

export default function PropertyCatalogPage() {
  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [guest, setGuest] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 500);
  const formattedStartDate = checkIn ? format(checkIn, "yyyy-MM-dd") : "";
  const formattedEndDate = checkOut ? format(checkOut, "yyyy-MM-dd") : "";
  const { data, isLoading, isError } = useGetProperties({
    page,
    location,
    category,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    search: debouncedSearch,
    guest: guest,
  });

  const handleLocation = (loc: string) => {
    setLocation(loc);
    setPage(1);
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleCheckIn = (date: Date) => {
    setCheckIn(date);
    setPage(1);
  };

  const handleCheckOut = (date: Date) => {
    setCheckOut(date);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleGuest = (guests: number) => {
    setGuest(guests);
    setPage(1);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    // Optionally scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const propertyCards = useMemo(() => {
    return (
      data?.data?.data.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          }}
          className="overflow-hidden rounded-lg bg-white shadow-md"
        >
          <PropertyCard property={property} />
        </motion.div>
      )) ?? []
    );
  }, [data]);

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mx-4 max-w-md rounded-lg bg-white p-8 text-center shadow-lg"
        >
          <h1 className="text-3xl font-bold text-red-600">Ups!</h1>
          <p className="mt-4 text-gray-700">
            Failed to load property. Please try again later.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-sky-100">
      <PropertyNavigation
        onLocation={handleLocation}
        onCategory={handleCategory}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onGuest={handleGuest}
      />
      <div className="relative mx-4 mt-6 w-full max-w-md sm:mx-6 sm:max-w-lg md:mx-12 lg:mx-24 lg:max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 sm:h-6 sm:w-6" />
        <Input
          className="w-full rounded-full border-2 border-gray-300 px-12 py-2 pl-12 pr-4 text-sm text-gray-800 placeholder-gray-500 transition-all duration-300 ease-in-out focus:border-blue-500 focus:shadow-lg focus:ring-2 focus:ring-blue-200 sm:py-3 sm:text-base"
          placeholder="Search property..."
          onChange={(e) => handleSearchChange(e.target.value)}
          value={search}
          aria-label="Search property"
        />
      </div>

      <main className="container px-4 sm:px-6 lg:px-24">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto mb-6 max-w-xl"
        ></motion.div>

        {isLoading ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-64 flex-col items-center justify-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-sky-500 sm:h-10 sm:w-10" />
            <span className="mt-4 text-base font-medium text-sky-600 sm:text-lg">
              Memuat property...
            </span>
          </motion.div>
        ) : !data?.data?.data?.length ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-64 flex-col items-center justify-center text-center"
          >
            <CalendarIcon className="mb-4 h-12 w-12 text-sky-500 sm:h-14 sm:w-14" />
            <p className="text-xl font-medium text-sky-600 sm:text-2xl">
              Property not found
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
            >
              {propertyCards}
            </motion.div>

            {data?.data?.meta && (
              <PaginationSection
                page={data.data.meta.page}
                take={data.data.meta.take}
                total={data.data.meta.total}
                onChangePage={handleChangePage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
