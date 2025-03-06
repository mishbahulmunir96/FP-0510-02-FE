"use client";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateProperty from "@/hooks/api/property/useCreateProperty";
import { useFormik } from "formik";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PropertyCategorySelect } from "./components/PropertyCategorySelect";
import dynamic from "next/dynamic";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import axios from "axios";

const DynamicMapComponent = dynamic(
  () => import("../../../../../components/Map"),
  { ssr: false },
);

const CreatePropertyPage = () => {
  const { mutateAsync: createProperty, isPending } = useCreateProperty();
  const { currentLat, currentLng, error } = useCurrentLocation();
  const [selectedPosition, setSelectedPosition] = useState<[string, string]>([
    "0",
    "0",
  ]);

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      description: "",
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
      imageUrl: [],
      propertyCategoryId: null,
      location: "",
    },
    onSubmit: async (values) => {
      await createProperty({
        ...values,
        propertyCategoryId: Number(values.propertyCategoryId),
      });
    },
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const imageRef = useRef<HTMLInputElement>(null);
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
        address: data.results[0].formatted,
        city: results.county || results.city,
        district:
          results.city_district || results.municipality || results.suburb,
      }));
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  useEffect(() => {
    if (currentLat && currentLng) {
      setSelectedPosition([currentLat, currentLng]);
      formik.setValues((prevValues) => ({
        ...prevValues,
        latitude: currentLat,
        longitude: currentLng,
      }));
      fetchAddress(currentLat, currentLng);
    }
  }, [currentLat, currentLng]);

  const handlePositionChange = (lat: string, lng: string) => {
    setSelectedPosition([lat, lng]);
    formik.setValues((prevValues) => ({
      ...prevValues,
      latitude: lat,
      longitude: lng,
    }));
    fetchAddress(lat, lng);
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

  return (
    <div>
      <section className="container mx-auto max-w-7xl p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-5">
            {selectedImages.length > 0 && (
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
            )}
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
            placeholder="custom-url-slug"
            type="text"
            value={formik.values.slug}
            isError={!!formik.touched.slug && !!formik.errors.slug}
            error={formik.errors.slug}
            onBlur={formik.handleBlur}
            onChange={handleSlugChange}
          />
          <PropertyCategorySelect setFieldValue={formik.setFieldValue} />
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
              placeholder="latitude"
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
              placeholder="longitude"
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
              placeholder="Location"
              value={formik.values.location}
              isError={!!formik.touched.location && !!formik.errors.location}
              error={formik.errors.location}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              readOnly
            />
          </div>
          <div className="flex justify-end">
            <Button disabled={isPending}>
              {isPending ? "Loading..." : "Create"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreatePropertyPage;
