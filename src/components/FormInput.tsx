"use client";

import { FormikHandlers } from "formik";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FC } from "react";

interface FormInputProps {
  name: string;
  label: string;
  type: string;

  placeholder?: string;
  value: any;
  isError: boolean;
  error?: string;
  onChange: FormikHandlers["handleChange"];
  onBlur: FormikHandlers["handleBlur"];
  readOnly?: boolean;
  className?: string; // Tambahkan ini
  inputClassName?: string; // Optional: untuk styling input secara terpisah
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
  className,
  inputClassName,
}) => {
  return (
    <div className={className}>

      <Label htmlFor={name}>{label}</Label>
      <Input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        className={inputClassName}
      />
      {isError && error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : null}

    </div>
  );
};

export default FormInput;
