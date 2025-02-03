"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { Mail, User, Phone, Building, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import useRegister from "@/hooks/api/auth/useRegister";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import SuccessModal from "@/components/modals/SuccessModal";

YupPassword(Yup);

const tenantSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
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

  // Ref untuk file input agar bisa dipicu lewat tombol "Choose"
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
      // Penanganan error sudah di-manage oleh useRegister hook
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
      <div className="w-full max-w-sm md:max-w-5xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Bagian Kiri: Form Registrasi Tenant */}
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-6 p-6 md:p-8"
            >
              <div className="flex flex-col items-center gap-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  Become a Tenant
                </h1>
                <p className="text-sm text-muted-foreground">
                  Register your property management account
                </p>
              </div>

              <div className="space-y-4">
                {/* Upload Profile dengan Avatar dan Tombol "Choose" */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Profile Picture</Label>
                  <div className="flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-sky-600 shadow-lg">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          className="h-10 w-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0l-3 3m3-3l3 3M17 16v-4m0 0l3 3m-3-3l-3 3"
                          />
                        </svg>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose
                    </Button>
                    <Input
                      id="imageUrl"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>

                {/* Informasi Dasar */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User size={16} />
                    Tenant Name
                  </Label>
                  <Input
                    id="name"
                    {...formik.getFieldProps("name")}
                    className={cn(
                      formik.touched.name &&
                        formik.errors.name &&
                        "border-red-500",
                    )}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-xs text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...formik.getFieldProps("email")}
                    className={cn(
                      formik.touched.email &&
                        formik.errors.email &&
                        "border-red-500",
                    )}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2"
                  >
                    <Phone size={16} />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    {...formik.getFieldProps("phoneNumber")}
                    className={cn(
                      formik.touched.phoneNumber &&
                        formik.errors.phoneNumber &&
                        "border-red-500",
                    )}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-xs text-red-500">
                      {formik.errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Detail Bank */}
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="flex items-center gap-2">
                    <Building size={16} />
                    Bank Name
                  </Label>
                  <Input
                    id="bankName"
                    {...formik.getFieldProps("bankName")}
                    className={cn(
                      formik.touched.bankName &&
                        formik.errors.bankName &&
                        "border-red-500",
                    )}
                  />
                  {formik.touched.bankName && formik.errors.bankName && (
                    <p className="text-xs text-red-500">
                      {formik.errors.bankName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bankNumber"
                    className="flex items-center gap-2"
                  >
                    <CreditCard size={16} />
                    Bank Account Number
                  </Label>
                  <Input
                    id="bankNumber"
                    {...formik.getFieldProps("bankNumber")}
                    className={cn(
                      formik.touched.bankNumber &&
                        formik.errors.bankNumber &&
                        "border-red-500",
                    )}
                  />
                  {formik.touched.bankNumber && formik.errors.bankNumber && (
                    <p className="text-xs text-red-500">
                      {formik.errors.bankNumber}
                    </p>
                  )}
                </div>
              </div>
              {/* Tombol submit untuk melanjutkan pendaftaran sebagai Tenant */}
              <Button
                type="submit"
                className="mt-2 w-full bg-sky-600"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Continue Registration"}
              </Button>
              {/* Tombol untuk beralih ke form user */}
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => router.push("/register")}
              >
                Register as User
              </Button>
            </form>

            {/* Bagian Kanan: Gambar (ditampilkan di layar md ke atas) */}
            <div className="relative hidden md:block">
              <Image
                src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
                alt="Register Image"
                fill
                sizes="50%"
                priority
                className="object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
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
