import { Input } from "@/components/ui/input";
import { FC } from "react";

interface InputElementDetailProps {
  label: string;
  placeholder: string;
  defaultValue: string;
}

const InputElementDetail: FC<InputElementDetailProps> = ({
  label,
  placeholder,
  defaultValue,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <Input
        placeholder={placeholder}
        className="w-[70%] rounded-full"
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default InputElementDetail;
