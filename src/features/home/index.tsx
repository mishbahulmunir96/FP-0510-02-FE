"use client";
import BestDeals from "@/components/BestDeals";
import { DatePickerWithRange } from "@/components/DateRangePicker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyList from "../property/index";
import { FilterSchema } from "./schemas/FilterSchema";

import Jumbotron from "./components/Jumbotron";
import { useGetPropertiesByQuery } from "@/hooks/api/search-property/useGetPropertiesByQuery";

interface SearchPropertyOption {
  label: string;
  value: string;
}

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

  const onPageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <main>
      <Jumbotron />
      <div className="mx-auto mt-20 grid max-w-7xl items-center gap-2 rounded-xl border-2 bg-slate-100 p-2 md:grid-cols-3">
        <div className="rounded-xl bg-slate-100 p-1">
          <p className="mb-1 text-center font-semibold text-[#294791]">
            Property
          </p>
          <Input
            name="title"
            type="text"
            placeholder="Search Property Name"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.title && !!formik.errors.title ? (
            <p className="text-xs text-red-500">{formik.errors.title}</p>
          ) : null}
        </div>
        <DatePickerWithRange setFieldValue={formik.setFieldValue} />
        <div className="rounded-xl bg-slate-100 p-1">
          <p className="mb-1 text-center font-semibold text-[#294791]">Who</p>
          <Input
            name="guest"
            type="number"
            placeholder="guest"
            value={formik.values.guest}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {!!formik.touched.guest && !!formik.errors.guest ? (
            <p className="text-xs text-red-500">{formik.errors.guest}</p>
          ) : null}
        </div>
      </div>
      <div className="container mx-auto mt-3 max-w-7xl text-center">
        <Button
          className="w-full"
          disabled={pendingSearch}
          onClick={() => formik.handleSubmit()}
        >
          {pendingSearch ? "Loading..." : "Search"}
        </Button>
      </div>
      {/* Property Listings Section */}
      <div className="mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Discover Amazing Properties
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Browse through our curated selection of premium properties for your
            next perfect stay
          </p>
        </div>

        <PropertyList />
      </div>
      {/* <div className="mt-20 pb-20">
        <BestDeals />
      </div> */}
    </main>
  );
};

export default HomePage;
