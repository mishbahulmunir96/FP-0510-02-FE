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

const LoginPage = () => {
  const { mutateAsync: login, isPending } = useLogin();

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

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Bagian Kiri: Form Login Biasa */}
              <form onSubmit={formik.handleSubmit} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your account
                    </p>
                  </div>

                  {/* Input Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!formik.touched.email && !!formik.errors.email ? (
                      <p className="text-xs text-red-500">
                        {formik.errors.email}
                      </p>
                    ) : null}
                  </div>

                  {/* Input Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:text-blue-500 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!formik.touched.password && !!formik.errors.password ? (
                      <p className="text-xs text-red-500">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>

                  {/* Tombol Login */}
                  <Button
                    type="submit"
                    className="w-full bg-sky-600"
                    disabled={isPending}
                  >
                    {isPending ? "Loading..." : "Login"}
                  </Button>

                  {/* Pemisah */}
                  <div className="relative flex items-center justify-center">
                    <span className="mx-2 text-sm text-muted-foreground">
                      or
                    </span>
                  </div>

                  {/* Tombol Login dengan Google */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
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

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="underline underline-offset-4 hover:text-blue-500"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>

              {/* Bagian Kanan: Gambar */}
              <div className="relative hidden bg-muted md:block">
                <Image
                  src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
                  alt="Image"
                  fill
                  sizes="50%"
                  priority
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking Login, you agree to our{" "}
            <Link href="/terms-of-service">Terms of Service</Link> and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
