"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useForgotPassword from "@/hooks/api/auth/useForgotPassword";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { Loader2, Mail } from "lucide-react";
import { ForgotPasswordSchema } from "./schemas";

const ForgotPasswordComponent = () => {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      await forgotPassword(values);
    },
  });

  return (
    <main className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md transform shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Mail className="h-5 w-5" />
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your email and we'll send you password reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium transition-colors group-focus-within:text-primary"
              >
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "transition-all duration-200",
                    "border-muted-foreground/20",
                    "focus:border-primary focus:ring-primary",
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "",
                  )}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>
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
                  Sending...
                </span>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgotPasswordComponent;
