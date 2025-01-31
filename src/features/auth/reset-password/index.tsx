"use client";

import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useResetPassword from "@/hooks/api/auth/useResetPassword";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { KeyRound, Loader2 } from "lucide-react";
import { FC } from "react";
import { ResetPasswordSchema } from "./schemas";

interface ResetPasswordComponentProps {
  token: string;
}

const ResetPasswordComponent: FC<ResetPasswordComponentProps> = ({ token }) => {
  const { mutateAsync: resetPassword, isPending } = useResetPassword(token);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      await resetPassword(values);
    },
  });

  return (
    <main className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md transform shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <KeyRound className="h-5 w-5" />
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your new password to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <PasswordInput
              label="New Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              showPasswordStrength
            />
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
            />
            <Button
              type="submit"
              className={cn(
                "w-full transition-all duration-200",
                "hover:translate-y-[-1px] active:translate-y-[1px]",
                isPending && "cursor-not-allowed opacity-50",
              )}
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPasswordComponent;
