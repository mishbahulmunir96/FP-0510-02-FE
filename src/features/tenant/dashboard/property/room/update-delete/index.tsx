"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteRoom from "@/hooks/api/room/useDeleteRoom";
import useGetRoom from "@/hooks/api/room/useGetRoom";
import useUpdateRoom from "@/hooks/api/room/useUpdateRoom";
import { FormikErrors, useFormik } from "formik";
import Image from "next/image";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import { PlusCircle, Save, Trash2, X } from "lucide-react";
import validationSchema from "./schemas";

interface UpdateRoomPageProps {
  roomId: number;
}

interface Facility {
  id?: number;
  title: string;
  description: string;
  isDeleted?: boolean;
}

interface FormValues {
  type: string;
  name: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number | null;
  imageUrl: File | null;
  facilities: Facility[];
}

const UpdateRoomPage: FC<UpdateRoomPageProps> = ({ roomId }) => {
  const { mutateAsync: updateRoom, isPending = false } =
    useUpdateRoom(roomId) || {};
  const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const { data, isPending: dataIsPending } = useGetRoom(roomId);
  const [selectedImage, setSelectedImage] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      type: "Standard",
      name: "",
      stock: 0,
      price: 0,
      guest: 2,
      propertyId: null,
      imageUrl: null,
      facilities: [{ title: "", description: "" }],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateRoom({
          ...values,
          propertyId: values.propertyId ?? 0,
          type: values.type as "Standard" | "Deluxe" | "Suite",
          name: values.name,
          imageUrl: values.imageUrl ?? undefined,
          facilities: values.facilities,
        });
      } catch (error) {
        console.error("Failed to update room:", error);
      }
    },
    enableReinitialize: false,
  });

  useEffect(() => {
    if (data) {
      const facilities = data.roomFacility?.map((facility) => ({
        id: facility.id,
        title: facility.title,
        description: facility.description,
      })) || [{ title: "", description: "" }];

      formik.setValues({
        type: data.type,
        name: data.name || "",
        stock: data.stock,
        price: data.price,
        guest: data.guest,
        propertyId: data.propertyId,
        imageUrl: null,
        facilities: facilities,
      });
    }
  }, [data]);

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

  const addFacility = () => {
    const facilities = [...formik.values.facilities];
    facilities.push({ title: "", description: "" });
    formik.setFieldValue("facilities", facilities);
  };

  const removeFacility = (index: number) => {
    if (formik.values.facilities.length > 1) {
      const facilities = [...formik.values.facilities];

      if (facilities[index]?.id) {
        facilities[index] = {
          ...facilities[index],
          isDeleted: true,
        };
      } else {
        facilities.splice(index, 1);
      }

      formik.setFieldValue("facilities", facilities);
    }
  };

  const handleFacilityChange = (
    index: number,
    field: keyof Facility,
    value: string,
  ) => {
    const facilities = [...formik.values.facilities];

    if (facilities[index]) {
      facilities[index] = {
        ...facilities[index],
        [field]: value,
      };

      formik.setFieldValue("facilities", facilities);
    }
  };

  const getNestedError = (
    errors: FormikErrors<FormValues> | undefined,
    index: number,
    field: keyof Facility,
  ): string | undefined => {
    if (!errors || !errors.facilities) return undefined;

    if (typeof errors.facilities === "string") {
      return undefined;
    }

    const facilitiesArray = errors.facilities as FormikErrors<Facility>[];
    if (Array.isArray(facilitiesArray) && facilitiesArray[index]) {
      return facilitiesArray[index][field] as string | undefined;
    }

    return undefined;
  };

  const hasNestedError = (
    touched: any,
    errors: FormikErrors<FormValues> | undefined,
    index: number,
    field: keyof Facility,
  ): boolean => {
    if (!touched || !errors) return false;

    if (!touched.facilities || !Array.isArray(touched.facilities)) return false;

    if (!touched.facilities[index] || !touched.facilities[index][field]) {
      return false;
    }

    return !!getNestedError(errors, index, field);
  };

  if (dataIsPending) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 rounded-md" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/2 rounded-md" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Error: Room data not found
        </h2>
        <p className="mt-2 text-gray-600">
          The requested room information could not be retrieved.
        </p>
      </div>
    );
  }

  const activeFacilities = formik.values.facilities.filter(
    (facility) => !facility.isDeleted,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-900">
                Update Room
              </h1>
              <p className="text-sm text-gray-500">
                Manage room details and facilities
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  className="flex items-center gap-2 self-start md:self-auto"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete Room"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the room and all associated data.
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

      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <form
            onSubmit={formik.handleSubmit}
            className="divide-y divide-gray-100"
          >
            <div className="space-y-4 p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Room Image
              </h2>

              <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-2/3">
                  {selectedImage ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={selectedImage}
                        alt="Room Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : data.roomImage?.[0]?.imageUrl ? (
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={data.roomImage[0].imageUrl}
                        alt="Room Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                      <p className="text-gray-400">No image available</p>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-4 md:w-1/3">
                  <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                    <Label className="text-sm font-medium">
                      Upload New Image
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={onChangeImage}
                        ref={imageRef}
                        className="text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
                      />
                    </div>
                    {selectedImage && (
                      <Button
                        onClick={removeSelectedImage}
                        variant="outline"
                        size="sm"
                        className="flex w-full items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X size={14} />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Room Details
              </h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select
                    value={formik.values.type}
                    onValueChange={(value) =>
                      formik.setFieldValue("type", value)
                    }
                  >
                    <SelectTrigger className="w-full">
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
                  placeholder="Enter room name"
                  value={formik.values.name}
                  isError={!!formik.touched.name && !!formik.errors.name}
                  error={formik.errors.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <FormInput
                  name="stock"
                  label="Available Units"
                  placeholder="Number of available units"
                  type="number"
                  value={formik.values.stock}
                  isError={!!formik.touched.stock && !!formik.errors.stock}
                  error={formik.errors.stock}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <FormInput
                  name="price"
                  label="Price per Night"
                  type="number"
                  placeholder="Price in IDR"
                  value={formik.values.price}
                  isError={!!formik.touched.price && !!formik.errors.price}
                  error={formik.errors.price}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                <FormInput
                  name="guest"
                  label="Guest Capacity"
                  type="number"
                  placeholder="Max number of guests"
                  value={formik.values.guest}
                  isError={!!formik.touched.guest && !!formik.errors.guest}
                  error={formik.errors.guest}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Room Facilities
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFacility}
                  className="flex items-center gap-2 self-start sm:self-auto"
                >
                  <PlusCircle size={16} />
                  Add New Facility
                </Button>
              </div>

              <div className="space-y-6">
                {activeFacilities.map((facility, index) => {
                  const formikIndex = formik.values.facilities.findIndex(
                    (f) => f === facility,
                  );

                  return (
                    <div
                      key={facility.id || index}
                      className="rounded-lg border border-gray-200 bg-white p-5 transition-all hover:shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h4 className="text-md flex items-center font-medium text-gray-700">
                          {facility.id ? (
                            <span className="flex items-center">
                              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                                {facility.id}
                              </span>
                              Existing Facility
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-800">
                                {index + 1}
                              </span>
                              New Facility
                            </span>
                          )}
                        </h4>
                        {activeFacilities.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFacility(formikIndex)}
                            className="h-8 w-8 p-0 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <FormInput
                          name={`facilities.${formikIndex}.title`}
                          label="Facility Name"
                          type="text"
                          placeholder="e.g., Free Wi-Fi, Mini Bar, etc."
                          value={facility.title}
                          isError={hasNestedError(
                            formik.touched,
                            formik.errors,
                            formikIndex,
                            "title",
                          )}
                          error={getNestedError(
                            formik.errors,
                            formikIndex,
                            "title",
                          )}
                          onBlur={formik.handleBlur}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleFacilityChange(
                              formikIndex,
                              "title",
                              e.target.value,
                            )
                          }
                        />

                        <FormTextarea
                          name={`facilities.${formikIndex}.description`}
                          label="Facility Description"
                          placeholder="Provide details about this facility..."
                          value={facility.description}
                          isError={hasNestedError(
                            formik.touched,
                            formik.errors,
                            formikIndex,
                            "description",
                          )}
                          error={getNestedError(
                            formik.errors,
                            formikIndex,
                            "description",
                          )}
                          onBlur={formik.handleBlur}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>,
                          ) =>
                            handleFacilityChange(
                              formikIndex,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}

                {typeof formik.errors.facilities === "string" && (
                  <p className="rounded bg-red-50 p-2 text-sm text-red-500">
                    {formik.errors.facilities}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end bg-gray-50 p-6">
              <Button
                type="submit"
                disabled={isPending || !formik.isValid}
                className="flex items-center gap-2 px-6"
              >
                <Save size={16} />
                {isPending ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoomPage;
