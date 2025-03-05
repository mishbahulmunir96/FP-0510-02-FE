"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateRoom from "@/hooks/api/room/useCreateRoom";
import { useFormik, FormikErrors } from "formik";
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
import { PlusCircle, X, ImagePlus, Save } from "lucide-react";

// Define a type for facility
interface Facility {
  title: string;
  description: string;
}

// Define the form values interface
interface FormValues {
  name: string;
  type: string;
  stock: number;
  price: number;
  guest: number;
  propertyId: number | null;
  imageUrl: File | null;
  facilities: Facility[];
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
  propertyId: Yup.number().required("Property is required"),
  facilities: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Facility name is required"),
        description: Yup.string().required("Facility description is required"),
      }),
    )
    .min(1, "At least one facility is required"),
});

const CreateRoomPage = () => {
  const { mutateAsync: createRoom, isPending } = useCreateRoom();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      type: "Standard",
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
        await createRoom({
          ...values,
          type: values.type as "Standard" | "Deluxe" | "Suite",
          propertyId: Number(values.propertyId),
          facilities: values.facilities,
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

  const addFacility = () => {
    const facilities = [...formik.values.facilities];
    facilities.push({ title: "", description: "" });
    formik.setFieldValue("facilities", facilities);
  };

  const removeFacility = (index: number) => {
    if (formik.values.facilities.length > 1) {
      const facilities = [...formik.values.facilities];
      facilities.splice(index, 1);
      formik.setFieldValue("facilities", facilities);
    }
  };

  const handleFacilityChange = (
    index: number,
    field: keyof Facility,
    value: string,
  ) => {
    const facilities = [...formik.values.facilities];

    // Check if the facility at this index exists
    if (facilities[index]) {
      // Create a new object with the updated field
      facilities[index] = {
        ...facilities[index],
        [field]: value,
      };

      formik.setFieldValue("facilities", facilities);
    }
  };

  // Helper function to get nested error with proper typings
  const getNestedError = (
    errors: FormikErrors<FormValues> | undefined,
    index: number,
    field: keyof Facility,
  ): string | undefined => {
    if (!errors || !errors.facilities) return undefined;

    if (typeof errors.facilities === "string") {
      return undefined;
    }

    // If facilities is an array in the errors object
    const facilitiesArray = errors.facilities as FormikErrors<Facility>[];
    if (Array.isArray(facilitiesArray) && facilitiesArray[index]) {
      return facilitiesArray[index][field] as string | undefined;
    }

    return undefined;
  };

  // Helper function to check if a field has an error
  const hasNestedError = (
    touched: any,
    errors: FormikErrors<FormValues> | undefined,
    index: number,
    field: keyof Facility,
  ): boolean => {
    if (!touched || !errors) return false;

    // Check if facilities is touched and is an array
    if (!touched.facilities || !Array.isArray(touched.facilities)) return false;

    // Check if the specific field is touched
    if (!touched.facilities[index] || !touched.facilities[index][field]) {
      return false;
    }

    // Check if there's an error for this field
    return !!getNestedError(errors, index, field);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Create New Room
            </h1>
            <p className="text-sm text-gray-500">
              Add a new room with details and facilities
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <form
            onSubmit={formik.handleSubmit}
            className="divide-y divide-gray-100"
          >
            {/* Image Upload Section */}
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
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-100">
                      <div className="p-6 text-center">
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">
                          Upload an image of the room
                        </p>
                        <p className="text-xs text-gray-400">
                          Recommended size: 1280 x 720px
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-4 md:w-1/3">
                  <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                    <Label className="text-sm font-medium">Upload Image</Label>
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

            {/* Room Details */}
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

                <div className="space-y-2">
                  <Label>Property</Label>
                  <PropertyIdSelect setFieldValue={formik.setFieldValue} />
                  {formik.touched.propertyId && formik.errors.propertyId && (
                    <p className="text-xs text-red-500">
                      {formik.errors.propertyId as string}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Room Facilities */}
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
                  Add Facility
                </Button>
              </div>

              <div className="space-y-6">
                {formik.values.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-5 transition-all hover:shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <h4 className="text-md flex items-center font-medium text-gray-700">
                        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-800">
                          {index + 1}
                        </span>
                        Facility
                      </h4>
                      {formik.values.facilities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFacility(index)}
                          className="h-8 w-8 p-0 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <FormInput
                        name={`facilities.${index}.title`}
                        label="Facility Name"
                        type="text"
                        placeholder="e.g., Free Wi-Fi, Mini Bar, etc."
                        value={facility.title}
                        isError={hasNestedError(
                          formik.touched,
                          formik.errors,
                          index,
                          "title",
                        )}
                        error={getNestedError(formik.errors, index, "title")}
                        onBlur={formik.handleBlur}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFacilityChange(index, "title", e.target.value)
                        }
                      />

                      <FormTextarea
                        name={`facilities.${index}.description`}
                        label="Facility Description"
                        placeholder="Provide details about this facility..."
                        value={facility.description}
                        isError={hasNestedError(
                          formik.touched,
                          formik.errors,
                          index,
                          "description",
                        )}
                        error={getNestedError(
                          formik.errors,
                          index,
                          "description",
                        )}
                        onBlur={formik.handleBlur}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleFacilityChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

                {typeof formik.errors.facilities === "string" && (
                  <p className="rounded bg-red-50 p-2 text-sm text-red-500">
                    {formik.errors.facilities}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end bg-gray-50 p-6">
              <Button
                type="submit"
                disabled={isPending || !formik.isValid}
                className="flex items-center gap-2 px-6"
              >
                <Save size={16} />
                {isPending ? "Creating Room..." : "Create Room"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPage;
