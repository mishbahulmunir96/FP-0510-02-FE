"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Phone,
  Building,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useRegister from "@/hooks/api/auth/useRegister";
import * as Yup from "yup";
import YupPassword from "yup-password";

YupPassword(Yup);

const tenantSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  bankName: Yup.string().required("Bank name is required"),
  bankNumber: Yup.string().required("Bank number is required"),
  imageUrl: Yup.string().nullable(),
});

const TenantForm = () => {
  const { mutate: register, isPending } = useRegister();
  const [selectedImage, setSelectedImage] = useState<string>("");

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
      register({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        bankName: values.bankName,
        bankNumber: values.bankNumber,
        role: "TENANT",
        image: values.imageUrl ?? undefined,
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue("imageUrl", file);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Become a Tenant</h1>
        <p className="text-sm text-muted-foreground">
          Register your property management account
        </p>
      </div>

      <div className="space-y-4">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Profile Picture</Label>
          <Input
            id="imageUrl"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="mx-auto h-32 w-32 rounded-full object-cover"
            />
          )}
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User size={16} />
            Tenant Name
          </Label>
          <Input
            id="name"
            {...formik.getFieldProps("name")}
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
            type="email"
            {...formik.getFieldProps("email")}
            className={cn(
              formik.touched.email && formik.errors.email && "border-red-500",
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
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
            <p className="text-xs text-red-500">{formik.errors.phoneNumber}</p>
          )}
        </div>

        {/* Bank Details */}
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
            <p className="text-xs text-red-500">{formik.errors.bankName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankNumber" className="flex items-center gap-2">
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
            <p className="text-xs text-red-500">{formik.errors.bankNumber}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full bg-sky-600" disabled={isPending}>
        {isPending ? "Creating account..." : "Register as Tenant"}
      </Button>
    </form>
  );
};

export default TenantForm;
