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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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
      imageUrl: [],
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
      const fileArray = Array.from(files);
      formik.setFieldValue("imageUrl", fileArray);
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setSelectedImages(imageUrls);
    }
  };

  const removeSelectedImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newFiles = [...formik.values.imageUrl];
    newFiles.splice(index, 1);
    formik.setFieldValue("imageUrl", newFiles);
  };

  const removeAllImages = () => {
    formik.setFieldValue("imageUrl", []);
    setSelectedImages([]);
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
      .replace(/[^a-zA-Z0-9-]/g, "")
      .replace(/--+/g, "-");
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
          <div className="space-y-5">
            {selectedImages.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-[200px] overflow-hidden rounded-lg"
                    >
                      <Image
                        src={image}
                        alt={`Property Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        onClick={() => removeSelectedImage(index)}
                        variant="destructive"
                        className="absolute right-2 top-2 h-8 w-8 p-0"
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={removeAllImages} variant="destructive">
                  Remove All Images
                </Button>
              </div>
            ) : data.propertyImage && data.propertyImage.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.propertyImage.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-[200px] overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image.imageUrl || "/placeholder-image.jpg"}
                      alt={`Property Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mx-auto max-w-xs">
              <Label>Property Images</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                ref={imageRef}
                multiple
              />
            </div>
          </div>

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

          <div className="overflow-hidden rounded-md border-[1px]">
            <div className="h-[500px] w-full rounded-md">
              <DynamicMapComponent
                selectedPosition={selectedPosition}
                onPositionChange={handlePositionChange}
              />
            </div>
          </div>

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
