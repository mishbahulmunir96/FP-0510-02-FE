"use client";

import { FormikHandlers } from "formik";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FC } from "react";

interface FormInputProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: any;
  isError: boolean;
  error: string | undefined;
  onChange: FormikHandlers["handleChange"];
  onBlur: FormikHandlers["handleBlur"];
  readOnly?: boolean;
}

const FormInput: FC<FormInputProps> = ({
  name,
  label,
  error,
  isError,
  onBlur,
  onChange,
  placeholder,
  type,
  value,
  readOnly = false,
}) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
      />
      {isError ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default FormInput;
