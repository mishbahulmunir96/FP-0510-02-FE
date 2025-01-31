"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useVerify } from "@/hooks/api/auth/useVerify";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const verifySchema = Yup.object().shape({
  token: Yup.string().required(),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function VerifyForm({ token }: { token: string }) {
  const { mutate: verify, isPending } = useVerify();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      token,
      password: "",
      confirmPassword: "",
    },
    validationSchema: verifySchema,
    onSubmit: (values) => {
      verify({ token: values.token, password: values.password });
    },
  });

  const passwordStrength = () => {
    const password = formik.values.password;
    if (
      password.length >= 12 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    ) {
      return 100;
    } else if (
      password.length >= 8 &&
      /[a-zA-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return 66;
    } else if (password.length >= 6) {
      return 33;
    }
    return 0;
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Verify Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {formik.errors.password}
            </motion.p>
          )}
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...formik.getFieldProps("confirmPassword")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {formik.errors.confirmPassword}
            </motion.p>
          )}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Password strength:</span>
              <span
                className={`font-semibold ${
                  passwordStrength() === 100
                    ? "text-green-500"
                    : passwordStrength() >= 66
                      ? "text-yellow-500"
                      : "text-red-500"
                }`}
              >
                {passwordStrength() === 100
                  ? "Strong"
                  : passwordStrength() >= 66
                    ? "Medium"
                    : "Weak"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className={`h-full ${
                  passwordStrength() === 100
                    ? "bg-green-500"
                    : passwordStrength() >= 66
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Password must contain:</p>
            <ul className="space-y-1 text-sm">
              {[
                {
                  condition: formik.values.password.length >= 8,
                  text: "At least 8 characters",
                },
                {
                  condition: /[a-z]/.test(formik.values.password),
                  text: "One lowercase letter",
                },
                {
                  condition: /[A-Z]/.test(formik.values.password),
                  text: "One uppercase letter",
                },
                {
                  condition: /[0-9]/.test(formik.values.password),
                  text: "One number",
                },
                {
                  condition: /[^a-zA-Z0-9]/.test(formik.values.password),
                  text: "One special character",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {item.condition ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !formik.isValid}
          onClick={() => formik.handleSubmit()}
        >
          {isPending ? (
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white" />
              Verifying...
            </motion.div>
          ) : (
            "Set Password & Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
