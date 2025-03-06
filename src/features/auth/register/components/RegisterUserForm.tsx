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
import {
  Mail,
  Loader2,
  UserPlus,
  ArrowRight,
  Building,
  ChevronLeft,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),
});

export default function RegisterPageForm() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="relative p-6 sm:p-8 md:p-10">
              <Link
                href="/login"
                className="absolute left-4 top-4 inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to login
              </Link>

              <form onSubmit={formik.handleSubmit} className="mt-8 md:mt-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                      <UserPlus className="h-6 w-6 text-sky-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                      Create Your Account
                    </h1>
                    <p className="max-w-xs text-gray-500">
                      Join our community today and unlock a world of
                      possibilities.
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <Separator className="absolute w-full" />
                    <span className="relative bg-white px-4 text-sm text-gray-500">
                      or use email
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`border bg-gray-50 py-2 pl-10 ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-300 ring-red-100"
                            : "border-gray-200 focus:border-sky-500"
                        } rounded-md focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50`}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 flex items-center text-sm text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

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
                        Continue with Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative flex w-full items-center justify-center border-gray-300 bg-white py-6 text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                    >
                      {googleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="google"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 488 512"
                        >
                          <path
                            fill="currentColor"
                            d="M488 261.8c0 141.4-114.6 256-256 256C114.6 517.8 0 403.2 0 261.8S114.6 6 232 6c62.7 0 112.5 23.3 150.8 61.8l-61 58.8C307 102.7 273.8 90 232 90 142.6 90 70.9 160.7 70.9 261.8s71.7 171.8 161.1 171.8c103 0 141.7-74 147.7-112.6h-147.7v-74.2H488v38.8z"
                          ></path>
                        </svg>
                      )}
                      <span className="text-base font-medium">
                        {googleLoading
                          ? "Connecting..."
                          : "Continue with Google"}
                      </span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                    <p className="text-center text-sm text-gray-500">
                      Are you a property owner?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex w-full items-center justify-center border-gray-300 text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                      onClick={() => router.push("/register?role=TENANT")}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Register as Property Owner
                    </Button>
                  </div>

                  <div className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-sky-600 transition-colors hover:text-sky-800 hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-500/30 to-indigo-600/30 mix-blend-multiply"></div>
              <Image
                src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
                alt="A welcoming workspace environment"
                fill
                sizes="50%"
                priority
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-8">
                <div className="relative text-white">
                  <h2 className="mb-2 text-2xl font-bold">
                    Benefits of joining
                  </h2>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Quick, secure registration with Google
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Access to premium property listings
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Save your favorite homes
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-sky-300">✓</span>
                      Receive personalized recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mx-auto mt-6 max-w-md text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
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
    </main>
  );
}
