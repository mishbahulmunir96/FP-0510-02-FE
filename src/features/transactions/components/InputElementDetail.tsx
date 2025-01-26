import { Input } from "@/components/ui/input";
import { FC } from "react";

interface InputElementDetailProps {
  label: string;
  placeholder: string;
}

const InputElementDetail: FC<InputElementDetailProps> = ({
  label,
  placeholder,
}) => {
  return (
    <div>
      <label className="text-base font-medium text-gray-600">{label}</label>
      <Input placeholder={placeholder} className="w-[70%] rounded-full" />
    </div>
  );
};

export default InputElementDetail;
