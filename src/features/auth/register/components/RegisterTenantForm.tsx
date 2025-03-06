"use client";

import ConfirmationModal from "@/components/modals/ConfirmationModal";
import SuccessModal from "@/components/modals/SuccessModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRegister from "@/hooks/api/auth/useRegister";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import {
  ArrowRight,
  Building,
  Camera,
  ChevronLeft,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

const tenantSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  bankName: Yup.string().required("Bank name is required"),
  bankNumber: Yup.string().required("Bank number is required"),
  imageUrl: Yup.string().nullable(),
});

const RegisterTenantForm = () => {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      bankName: "",
      bankNumber: "",
      imageUrl: null as File | null,
      role: "TENANT" as const,
    },
    validationSchema: tenantSchema,
    onSubmit: (values) => {
      setFormData({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        bankName: values.bankName,
        bankNumber: values.bankNumber,
        role: "TENANT",
        image: values.imageUrl ?? undefined,
      });
      setShowConfirmModal(true);
    },
  });

  const handleConfirmRegistration = async () => {
    try {
      await register(formData);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      formik.resetForm();
      setSelectedImage("");
    } catch (error) {
      setShowConfirmModal(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue("imageUrl", file);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="relative p-6 sm:p-8">
              <Link
                href="/register"
                className="absolute left-4 top-4 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to user registration
              </Link>

              <form onSubmit={formik.handleSubmit} className="mt-10 space-y-6">
                <div className="mb-6 flex flex-col items-center gap-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
                    <Building className="h-7 w-7 text-sky-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                      Become a Property Manager
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-gray-500">
                      Register your account to list and manage your properties
                      on our platform.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col items-center gap-3">
                    <Label
                      htmlFor="imageUrl"
                      className="self-start text-sm font-medium text-gray-700"
                    >
                      Profile Picture
                    </Label>
                    <div className="group relative">
                      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 shadow-sm">
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white shadow-md transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <Input
                        id="imageUrl"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload a professional profile image
                    </p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor="name"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <User size={16} className="text-gray-500" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        {...formik.getFieldProps("name")}
                        placeholder="Enter your full name"
                        className={cn(
                          "border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50",
                          formik.touched.name &&
                            formik.errors.name &&
                            "border-red-300 focus:border-red-500 focus:ring-red-100",
                        )}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-1 flex items-start gap-1 text-sm text-red-500">
                          <span className="mt-0.5 inline-block h-4 w-4 text-red-500">
                            ⚠️
                          </span>
                          {formik.errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Mail size={16} className="text-gray-500" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your-email@example.com"
                        {...formik.getFieldProps("email")}
                        className={cn(
                          "border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50",
                          formik.touched.email &&
                            formik.errors.email &&
                            "border-red-300 focus:border-red-500 focus:ring-red-100",
                        )}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 flex items-start gap-1 text-sm text-red-500">
                          <span className="mt-0.5 inline-block h-4 w-4 text-red-500">
                            ⚠️
                          </span>
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Phone size={16} className="text-gray-500" />
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        placeholder="Enter your phone number"
                        {...formik.getFieldProps("phoneNumber")}
                        className={cn(
                          "border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50",
                          formik.touched.phoneNumber &&
                            formik.errors.phoneNumber &&
                            "border-red-300 focus:border-red-500 focus:ring-red-100",
                        )}
                      />
                      {formik.touched.phoneNumber &&
                        formik.errors.phoneNumber && (
                          <p className="mt-1 flex items-start gap-1 text-sm text-red-500">
                            <span className="mt-0.5 inline-block h-4 w-4 text-red-500">
                              ⚠️
                            </span>
                            {formik.errors.phoneNumber}
                          </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bankName"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <Building size={16} className="text-gray-500" />
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        placeholder="Enter your bank name"
                        {...formik.getFieldProps("bankName")}
                        className={cn(
                          "border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50",
                          formik.touched.bankName &&
                            formik.errors.bankName &&
                            "border-red-300 focus:border-red-500 focus:ring-red-100",
                        )}
                      />
                      {formik.touched.bankName && formik.errors.bankName && (
                        <p className="mt-1 flex items-start gap-1 text-sm text-red-500">
                          <span className="mt-0.5 inline-block h-4 w-4 text-red-500">
                            ⚠️
                          </span>
                          {formik.errors.bankName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="bankNumber"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700"
                      >
                        <CreditCard size={16} className="text-gray-500" />
                        Account Number
                      </Label>
                      <Input
                        id="bankNumber"
                        placeholder="Enter your account number"
                        {...formik.getFieldProps("bankNumber")}
                        className={cn(
                          "border border-gray-200 bg-gray-50 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50",
                          formik.touched.bankNumber &&
                            formik.errors.bankNumber &&
                            "border-red-300 focus:border-red-500 focus:ring-red-100",
                        )}
                      />
                      {formik.touched.bankNumber &&
                        formik.errors.bankNumber && (
                          <p className="mt-1 flex items-start gap-1 text-sm text-red-500">
                            <span className="mt-0.5 inline-block h-4 w-4 text-red-500">
                              ⚠️
                            </span>
                            {formik.errors.bankNumber}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md bg-sky-600 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-sky-700"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue Registration
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="relative flex items-center justify-center">
                    <span className="absolute inset-x-0 h-px bg-gray-200"></span>
                    <span className="relative bg-white px-4 text-sm text-gray-500">
                      or
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="flex w-full items-center justify-center border-gray-300 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                    onClick={() => router.push("/register")}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Register as Regular User
                  </Button>
                </div>
              </form>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-600/20 to-indigo-600/30 mix-blend-multiply"></div>
              <Image
                src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
                alt="Property manager working at desk"
                fill
                sizes="50%"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-8">
                <div className="relative space-y-4 text-white">
                  <h2 className="text-2xl font-bold">
                    Property Manager Benefits
                  </h2>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      List multiple properties and manage them all in one place
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Receive booking requests and payments directly
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Access detailed analytics and performance reports
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Connect with potential customers from around the world
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mx-auto mt-6 max-w-md text-center text-xs text-gray-500">
          By continuing with the registration, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="text-sky-600 underline-offset-2 transition-colors hover:text-sky-800 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-sky-600 underline-offset-2 transition-colors hover:text-sky-800 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmRegistration}
        email={formData?.email || ""}
        isLoading={isPending}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        email={formData?.email || ""}
      />
    </main>
  );
};

export default RegisterTenantForm;
