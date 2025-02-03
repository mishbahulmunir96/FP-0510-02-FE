"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import useRegister from "@/hooks/api/auth/useRegister";

const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  imageUrl: yup.string().optional(),
});

export default function RegisterPageForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Ref untuk file input agar bisa dipicu lewat tombol "Choose File"
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      imageUrl: null as File | null,
      role: "USER" as const,
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      setFormData({
        name: values.name,
        email: values.email,
        role: "USER",
        image: values.imageUrl ?? undefined,
      });
      setShowConfirmModal(true);
    },
  });

  const handleConfirmRegistration = async () => {
    try {
      await register(formData);
      setShowConfirmModal(false);
      formik.resetForm();
      setSelectedImage("");
    } catch (error) {
      setShowConfirmModal(false);
      // Error handling is managed in useRegister
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
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Left: Registration Form */}
            <form onSubmit={formik.handleSubmit} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Create Account</h1>
                  <p className="text-sm text-muted-foreground">
                    Fill in your details to create your account
                  </p>
                </div>

                {/* Profile Picture */}
                <div className="grid gap-2">
                  <Label htmlFor="imageUrl">Profile Picture</Label>
                  <div className="flex flex-col items-center justify-center">
                    <label htmlFor="imageUrl" className="cursor-pointer">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sky-600 shadow-lg">
                        {selectedImage ? (
                          <img
                            src={selectedImage}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          // SVG icon sebagai placeholder (ikon avatar)
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7h4l2-3h6l2 3h4a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 11a3 3 0 100 6 3 3 0 000-6z"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                    {/* Tombol Choose File */}
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <Input
                    id="imageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>

                {/* Name Input */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-xs text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Tombol Register */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-sky-600"
                    disabled={isPending}
                  >
                    {isPending ? "Loading..." : "Continue Registration"}
                  </Button>

                  {/* Tombol tambahan untuk register sebagai tenant */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/register?role=TENANT")}
                  >
                    Register as Tenant
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline hover:text-blue-500">
                    Sign in
                  </Link>
                </div>
              </div>
            </form>

            {/* Right: Image (same as in login) */}
            <div className="relative hidden bg-muted md:block">
              <Image
                src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
                alt="Register Image"
                fill
                sizes="50%"
                priority
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          By clicking Continue Registration, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="underline hover:text-blue-500"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline hover:text-blue-500"
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
    </main>
  );
}
