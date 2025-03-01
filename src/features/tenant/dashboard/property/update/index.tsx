"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteProperty from "@/hooks/api/property/useDeleteProperty";
import useGetPropertyTenant from "@/hooks/api/property/useGetPropertyTenant";
import useUpdateProperty from "@/hooks/api/property/useUpdateProperty";
import { useFormik } from "formik";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState, useEffect } from "react";
import { EditPropertyCategorySelect } from "../management/components/EditPropertyCategorySelect";
import dynamic from "next/dynamic";
import axios from "axios";

const DynamicMapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

interface PropertyDetailPageProps {
  propertyId: number;
}

const UpdatePropertyPage: FC<PropertyDetailPageProps> = ({ propertyId }) => {
  const { mutateAsync: updateProperty, isPending } =
    useUpdateProperty(propertyId);
  const { mutateAsync: deleteProperty, isPending: deletePending } =
    useDeleteProperty();
  const { data, isPending: dataIsPending } = useGetPropertyTenant(propertyId);
  const [selectedImage, setSelectedImage] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const [selectedPosition, setSelectedPosition] = useState<[string, string]>([
    "0",
    "0",
  ]);

  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      slug: data?.slug || "",
      description: data?.description || "",
      latitude: data?.latitude || "",
      longitude: data?.longitude || "",
      location: data?.location || "",
      imageUrl: null,
      propertyCategoryId: data?.propertyCategory?.id || null,
    },
    onSubmit: async (values) => {
      await updateProperty({
        ...values,
        propertyCategoryId: Number(values.propertyCategoryId),
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (data) {
      setSelectedPosition([data.latitude, data.longitude]);
    }
  }, [data]);

  const fetchAddress = async (lat: string, lng: string) => {
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY!}&language=id&pretty=1`,
      );
      const results = data.results[0]?.components || {};

      const location = [
        results.suburb,
        results.city_district,
        results.city,
        results.state,
      ]
        .filter(Boolean)
        .join(", ");

      formik.setValues((prevValues) => ({
        ...prevValues,
        location: location,
      }));
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handlePositionChange = (lat: string, lng: string) => {
    setSelectedPosition([lat, lng]);
    formik.setValues((prevValues) => ({
      ...prevValues,
      latitude: lat,
      longitude: lng,
    }));
    fetchAddress(lat, lng);
  };

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue("imageUrl", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removeSelectedImage = () => {
    formik.setFieldValue("imageUrl", null);
    setSelectedImage("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    formik.setFieldValue("title", title);
    formik.setFieldValue("slug", slug);
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "") // Hanya izinkan huruf, angka, dan strip
      .replace(/--+/g, "-"); // Ganti multiple strip dengan single strip
    formik.setFieldValue("slug", value);
  };

  if (dataIsPending) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        <Skeleton className="h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200" />
        <Skeleton className="h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        Error: Property data not found
      </div>
    );
  }

  return (
    <div>
      <section className="container mx-auto max-w-7xl p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Image Section */}
          <div className="space-y-5">
            {selectedImage ? (
              <>
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedImage}
                    alt="Property Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button onClick={removeSelectedImage} variant="destructive">
                  Remove Image
                </Button>
              </>
            ) : data.propertyImage?.[0]?.imageUrl ? (
              <div className="relative h-[350px] w-full overflow-hidden rounded-lg">
                <Image
                  src={data.propertyImage[0].imageUrl}
                  alt="Property Image"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="mx-auto max-w-xs">
              <Label>Property Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                ref={imageRef}
              />
            </div>
          </div>

          {/* Basic Info */}
          <FormInput
            name="title"
            label="Property Name"
            type="text"
            placeholder="Property Name"
            value={formik.values.title}
            isError={!!formik.touched.title && !!formik.errors.title}
            error={formik.errors.title}
            onBlur={formik.handleBlur}
            onChange={handleTitleChange}
          />
          <FormInput
            name="slug"
            label="Slug"
            type="text"
            placeholder="custom-url-slug"
            value={formik.values.slug}
            isError={!!formik.touched.slug && !!formik.errors.slug}
            error={formik.errors.slug}
            onBlur={formik.handleBlur}
            onChange={handleSlugChange}
          />
          <EditPropertyCategorySelect
            setFieldValue={formik.setFieldValue}
            initialValue={data.propertyCategory?.id}
          />
          <FormTextarea
            name="description"
            label="Description"
            placeholder="Description"
            value={formik.values.description}
            isError={
              !!formik.touched.description && !!formik.errors.description
            }
            error={formik.errors.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          {/* Map Section */}
          <div className="overflow-hidden rounded-md border-[1px]">
            <div className="h-[500px] w-full rounded-md">
              <DynamicMapComponent
                selectedPosition={selectedPosition}
                onPositionChange={handlePositionChange}
              />
            </div>
          </div>

          {/* Location Info */}
          <div className="grid w-full grid-cols-3 items-end gap-7">
            <FormInput
              name="latitude"
              label="Latitude"
              type="text"
              value={formik.values.latitude}
              isError={!!formik.touched.latitude && !!formik.errors.latitude}
              error={formik.errors.latitude}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
            <FormInput
              name="longitude"
              label="Longitude"
              type="text"
              value={formik.values.longitude}
              isError={!!formik.touched.longitude && !!formik.errors.longitude}
              error={formik.errors.longitude}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
            <FormInput
              name="location"
              label="Location"
              type="text"
              value={formik.values.location}
              isError={!!formik.touched.location && !!formik.errors.location}
              error={formik.errors.location}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this property?",
                  )
                ) {
                  await deleteProperty(propertyId);
                }
              }}
              disabled={deletePending}
            >
              {deletePending ? "Deleting..." : "Delete"}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdatePropertyPage;
