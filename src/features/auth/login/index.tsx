"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { LoginSchema } from "./schemas";
import useLogin from "@/hooks/api/auth/useLogin";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Left Section: Login Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="p-6 md:p-8 lg:p-10"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center space-y-1.5 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                      Welcome back
                    </h1>
                    <p className="text-balance text-gray-500">
                      We're excited to see you again! Log in to your account to
                      continue your journey.
                    </p>
                  </div>

                  {/* Email Input with Icon */}
                  <div className="grid gap-2.5">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="your-email@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`border bg-gray-50 pl-10 ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-300 ring-red-100"
                            : "border-gray-200 focus:border-sky-500"
                        } rounded-md focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50`}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email ? (
                      <p className="mt-1 text-xs text-red-500">
                        {formik.errors.email}
                      </p>
                    ) : null}
                  </div>

                  {/* Password Input with Toggle Visibility */}
                  <div className="grid gap-2.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-sky-600 transition-colors hover:text-sky-800 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`border bg-gray-50 pl-10 pr-10 ${
                          formik.touched.password && formik.errors.password
                            ? "border-red-300 ring-red-100"
                            : "border-gray-200 focus:border-sky-500"
                        } rounded-md focus:ring-4 focus:ring-sky-100 focus:ring-opacity-50`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <p className="mt-1 text-xs text-red-500">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-sky-600 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-sky-700"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inset-x-0 h-px bg-gray-200"></span>
                    <span className="relative bg-white px-4 text-sm text-gray-500">
                      or continue with
                    </span>
                  </div>

                  {/* Google Sign In Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
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
                    Sign in with Google
                  </Button>

                  {/* Sign Up Link */}
                  <div className="text-center text-sm text-gray-600">
                    New to our platform?{" "}
                    <Link
                      href="/register"
                      className="font-medium text-sky-600 transition-colors hover:text-sky-800 hover:underline"
                    >
                      Create an account
                    </Link>
                  </div>
                </div>
              </form>

              {/* Right Section: Image */}
              <div className="relative hidden md:block">
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-500/20 to-indigo-500/30 mix-blend-multiply"></div>
                <Image
                  src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
                  alt="Welcoming workspace environment"
                  fill
                  sizes="50%"
                  priority
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent p-8">
                  <div className="relative text-white">
                    <h2 className="mb-2 text-2xl font-bold">
                      Start your journey
                    </h2>
                    <p className="max-w-xs text-sm text-white/90">
                      Access your personalized dashboard and explore all our
                      features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Service and Privacy Policy Notice */}
          <div className="text-balance px-4 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
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
      </div>
    </main>
  );
};

export default LoginPage;
