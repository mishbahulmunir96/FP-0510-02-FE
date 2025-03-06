import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import Jumbotron from "./components/Jumbotron";
import PropertyList from "../property/index";
import { FilterSchema } from "./schemas/FilterSchema";
import { useGetPropertiesByQuery } from "@/hooks/api/search-property/useGetPropertiesByQuery";
import BestDeals from "@/components/BestDeals";

const HomePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    guest: 2,
  });

  const {
    data: dataSearch,
    isPending: pendingSearch,
    refetch: refetchPropertiesByQuery,
  } = useGetPropertiesByQuery({
    page,
    take: 10,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    guest: searchParams.guest,
    title: searchParams.title,
  });

  const formik = useFormik({
    initialValues: searchParams,
    validationSchema: FilterSchema,
    onSubmit: async (values) => {
      const newValues = {
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        guest: Number(values.guest),
      };

      setSearchParams(newValues);

      const query = new URLSearchParams({
        startDate: newValues.startDate.toUTCString(),
        endDate: newValues.endDate.toUTCString(),
        guest: String(newValues.guest),
        title: newValues.title,
      }).toString();

      router.push(`/property/search?${query}`);
    },
  });

  useEffect(() => {
    refetchPropertiesByQuery();
  }, [searchParams, page]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Jumbotron />
      <div className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid items-center gap-2 rounded-xl border-2 border-[#89CFF3] bg-white p-2 shadow-lg transition-all duration-300 hover:shadow-xl md:grid-cols-3">
          <div className="rounded-xl p-1">
            <p className="mb-1 text-center font-semibold text-[#00A9FF]">
              Property
            </p>
            <Input
              name="title"
              type="text"
              placeholder="Search Property Name"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-[#89CFF3] transition-all duration-200 placeholder:text-gray-400 focus:border-[#00A9FF] focus:ring-2 focus:ring-[#A0E9FF]"
            />
            {!!formik.touched.title && !!formik.errors.title && (
              <p className="text-xs text-red-500">{formik.errors.title}</p>
            )}
          </div>
          <DatePickerWithRange setFieldValue={formik.setFieldValue} />
          <div className="rounded-xl p-1">
            <p className="mb-1 text-center font-semibold text-[#00A9FF]">Who</p>
            <Input
              name="guest"
              type="number"
              placeholder="Number of guests"
              value={formik.values.guest}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-[#89CFF3] transition-all duration-200 placeholder:text-gray-400 focus:border-[#00A9FF] focus:ring-2 focus:ring-[#A0E9FF]"
            />
            {!!formik.touched.guest && !!formik.errors.guest && (
              <p className="text-xs text-red-500">{formik.errors.guest}</p>
            )}
          </div>
        </div>

        <div className="container mx-auto mt-3 max-w-7xl text-center">
          <Button
            className="w-full bg-[#00A9FF] font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#0098e5] hover:shadow disabled:bg-[#89CFF3]"
            disabled={pendingSearch}
            onClick={() => formik.handleSubmit()}
          >
            {pendingSearch ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
      <div className="mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-800 transition-colors duration-300 hover:text-[#00A9FF]">
            Discover Amazing Properties
          </h2>

          <p className="mx-auto max-w-2xl text-gray-600">
            Browse through our curated selection of premium properties for your
            next perfect stay
          </p>
        </div>
        <PropertyList />
      </div>
      <div className="py-8 md:py-12">
        <BestDeals />
      </div>
    </main>
  );
};

export default HomePage;
