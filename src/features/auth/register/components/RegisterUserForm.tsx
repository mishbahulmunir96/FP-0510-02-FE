"use client";

import { useState } from "react";
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
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function RegisterPageForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      role: "USER" as const,
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      setFormData({
        email: values.email,
        role: "USER",
      });
      setShowConfirmModal(true);
    },
  });

  const handleConfirmRegistration = async () => {
    try {
      await register(formData);
      setShowConfirmModal(false);
      formik.resetForm();
    } catch (error) {
      setShowConfirmModal(false);
      // Error handling is managed in useRegister
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
                    <p className="text-xs text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-sky-600"
                    disabled={isPending}
                  >
                    {isPending ? "Loading..." : "Continue Registration"}
                  </Button>

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

            {/* Right: Image */}
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
          <Link href="/terms-of-service" className="underline hover:text-blue-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-blue-500">
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