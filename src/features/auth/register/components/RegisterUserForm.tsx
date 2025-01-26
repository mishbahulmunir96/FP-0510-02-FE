"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import { Eye, EyeOff, Mail, User, Lock, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useRegister from "@/hooks/api/auth/useRegister";
import * as yup from "yup";

interface RegisterFormProps {
  role: "USER" | "TENANT";
}

const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  imageUrl: yup.string().optional(),
});

const RegisterForm = ({ role }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      imageUrl: "",
      role: role,
      bankName: "",
      bankNumber: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      register(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your details to create your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User size={16} />
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={cn(
              formik.touched.name && formik.errors.name && "border-red-500",
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
            name="email"
            type="email"
            placeholder="name@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={cn(
              formik.touched.email && formik.errors.email && "border-red-500",
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock size={16} />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={cn(
                formik.touched.password &&
                  formik.errors.password &&
                  "border-red-500",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-red-500">{formik.errors.password}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-sky-600 hover:bg-sky-700"
        disabled={isPending}
      >
        {isPending ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <div className="mt-8 space-y-4 border-t pt-6">
        <div className="space-y-2 text-center">
          <div className="grid gap-2">
            <Link href="/register?role=TENANT">
              <Button
                variant="outline"
                className="group w-full hover:border-primary/50"
              >
                <Calendar className="mr-2 h-4 w-4 transition-colors group-hover:text-primary" />
                Become a Tenant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
