"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateRoom from "@/hooks/api/room/useCreateRoom";
import { useFormik } from "formik";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { PropertyIdSelect } from "./components/PropertyIdSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Room name is required"),
  type: Yup.string()
    .oneOf(["Standard", "Deluxe", "Suite"], "Invalid room type")
    .required("Room type is required"),
  stock: Yup.number()
    .required("Stock is required")
    .min(1, "Stock must be at least 1"),
  price: Yup.number()
    .required("Price is required")
    .min(1000, "Price must be at least 1000"),
  guest: Yup.number()
    .required("Guest capacity is required")
    .min(1, "Guest capacity must be at least 1"),
  propertyId: Yup.number().required("Property is required"),
  title: Yup.string().required("Facility name is required"),
  description: Yup.string().required("Facility description is required"),
});

const CreateRoomPage = () => {
  const { mutateAsync: createRoom, isPending } = useCreateRoom();

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "Standard",
      stock: 0,
      price: 0,
      guest: 2,
      propertyId: null,
      imageUrl: null,
      title: "",
      description: "",
      room_facilities: [{ title: "", description: "" }],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createRoom({
          ...values,
          type: values.type as "Standard" | "Deluxe" | "Suite",
          propertyId: Number(values.propertyId),
          facilityTitle: values.title, // Add this line
          facilityDescription: values.description, // Add this line
        });
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    },
  });

  const [selectedImage, setSelectedImage] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

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

  return (
    <div>
      <section className="container mx-auto max-w-7xl p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Image Upload Section */}
          <div className="space-y-5">
            {selectedImage ? (
              <>
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedImage}
                    alt="Room Image"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button onClick={removeSelectedImage} variant="destructive">
                  Remove Image
                </Button>
              </>
            ) : null}
            <div className="mx-auto max-w-xs">
              <Label>Room Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={onChangeImage}
                ref={imageRef}
              />
              {formik.touched.imageUrl && formik.errors.imageUrl && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.imageUrl}
                </p>
              )}
            </div>
          </div>

          {/* Room Details */}
          <div className="grid w-full items-end gap-7 md:grid-cols-6">
            <div className="space-y-2">
              <Label>Room Type</Label>
              <Select
                value={formik.values.type}
                onValueChange={(value) => formik.setFieldValue("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-xs text-red-500">{formik.errors.type}</p>
              )}
            </div>

            <FormInput
              name="name"
              label="Room Name"
              type="text"
              placeholder="Room Name"
              value={formik.values.name}
              isError={!!formik.touched.name && !!formik.errors.name}
              error={formik.errors.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormInput
              name="stock"
              label="Stock"
              placeholder="Stock room available"
              type="number"
              value={formik.values.stock}
              isError={!!formik.touched.stock && !!formik.errors.stock}
              error={formik.errors.stock}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormInput
              name="price"
              label="Price"
              type="number"
              placeholder="price"
              value={formik.values.price}
              isError={!!formik.touched.price && !!formik.errors.price}
              error={formik.errors.price}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormInput
              name="guest"
              label="Guest"
              type="number"
              placeholder="guest"
              value={formik.values.guest}
              isError={!!formik.touched.guest && !!formik.errors.guest}
              error={formik.errors.guest}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <PropertyIdSelect setFieldValue={formik.setFieldValue} />
          </div>

          {/* Room Facilities */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold">Room Facilities</h3>
            <FormInput
              name="title"
              label="Facility Name"
              type="text"
              placeholder="Room Facility Name"
              value={formik.values.title}
              isError={!!formik.touched.title && !!formik.errors.title}
              error={formik.errors.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            <FormTextarea
              name="description"
              label="Description of Room Facility"
              placeholder="Description of Room Facility"
              value={formik.values.description}
              isError={
                !!formik.touched.description && !!formik.errors.description
              }
              error={formik.errors.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !formik.isValid}>
              {isPending ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateRoomPage;
