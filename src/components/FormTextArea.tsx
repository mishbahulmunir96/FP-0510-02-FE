"use client";

import { FormikHandlers } from "formik";
import { Label } from "./ui/label";
import { FC } from "react";
import { Textarea } from "./ui/textarea";

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder: string;
  value: any;
  isError: boolean;
  error: string | undefined;
  onChange: FormikHandlers["handleChange"];
  onBlur: FormikHandlers["handleBlur"];
}

const FormTextarea: FC<FormTextareaProps> = ({
  name,
  label,
  error,
  isError,
  onBlur,
  onChange,
  placeholder,
  value,
}) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        name={name}
        value={value}
        placeholder={placeholder}
        style={{ resize: "none" }}
        rows={10}
        onChange={onChange}
        onBlur={onBlur}
      />
      {isError ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
};

export default FormTextarea;
