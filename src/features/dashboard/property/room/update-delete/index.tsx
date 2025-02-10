"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useUpdateRoom from "@/hooks/api/room/useUpdateRoom";
import useDeleteRoom from "@/hooks/api/room/useDeleteRoom";
import useGetRoom from "@/hooks/api/room/useGetRoom";
import { useFormik } from "formik";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as Yup from "yup";

interface UpdateRoomPageProps {
  roomId: number;
}

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
  facilityTitle: Yup.string().required("Facility name is required"),
  facilityDescription: Yup.string().required(
    "Facility description is required",
  ),
});

const UpdateRoomPage: FC<UpdateRoomPageProps> = ({ roomId }) => {
  const { mutateAsync: updateRoom, isPending = false } =
    useUpdateRoom(roomId) || {};
  const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { data, isPending: dataIsPending } = useGetRoom(roomId);
  const [selectedImage, setSelectedImage] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      type: data?.type || "Standard",
      stock: data?.stock || 0,
      price: data?.price || 0,
      guest: data?.guest || 2,
      propertyId: data?.propertyId || null,
      imageUrl: null,
      facilityTitle: data?.roomFacility?.[0]?.title || "",
      facilityDescription: data?.roomFacility?.[0]?.description || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateRoom({
          ...values,
          propertyId: values.propertyId ?? 0,
          type: values.type as "Standard" | "Deluxe" | "Suite",
          imageUrl: values.imageUrl ?? undefined,
        });
      } catch (error) {
        console.error("Failed to update room:", error);
      }
    },
    enableReinitialize: true,
  });

  const handleDelete = async () => {
    try {
      await deleteRoom(roomId);
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
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

  if (dataIsPending) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        <Skeleton className="h-[300px] w-full overflow-hidden rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        Error: Room data not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Update Room</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update room information and facilities
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Room"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the room and remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl p-6">
        <div className="rounded-lg bg-white p-8 shadow">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Image Section */}
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
              ) : data.roomImage?.[0]?.imageUrl ? (
                <div className="relative h-[350px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={data.roomImage[0].imageUrl}
                    alt="Room Image"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div className="mx-auto max-w-xs">
                <Label>Room Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={onChangeImage}
                  ref={imageRef}
                />
              </div>
            </div>

            <div className="grid w-full items-end gap-7 md:grid-cols-5">
              {/* Room Type Select */}
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
            </div>

            {/* Room Facility */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">Room Facility</h3>
              <FormInput
                name="facilityTitle"
                label="Facility Name"
                type="text"
                placeholder="Facility Name"
                value={formik.values.facilityTitle}
                isError={
                  !!formik.touched.facilityTitle &&
                  !!formik.errors.facilityTitle
                }
                error={formik.errors.facilityTitle}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <FormTextarea
                name="facilityDescription"
                label="Facility Description"
                placeholder="Describe the facility"
                value={formik.values.facilityDescription}
                isError={
                  !!formik.touched.facilityDescription &&
                  !!formik.errors.facilityDescription
                }
                error={formik.errors.facilityDescription}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isPending || !formik.isValid}>
                {isPending ? "Updating..." : "Update Room"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UpdateRoomPage;
