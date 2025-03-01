import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCategory from "@/hooks/api/category/useGetCategory";
import { PropertyCategory } from "@/types/property";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface FormSelectProps {
  setFieldValue: (field: string, value: string) => void;
}

interface CategoryResponse {
  data: PropertyCategory[];
  meta: {
    total: number;
    totalCount: number;
    page: number;
    take: number;
  };
}

export const PropertyCategorySelect: FC<FormSelectProps> = ({
  setFieldValue,
}) => {
  const session = useSession();
  const { data, isPending, error } = useGetCategory({
    userId: session.data?.user.id,
  });

  if (isPending) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories</div>;
  }

  return (
    <Select
      onValueChange={(value) => setFieldValue("propertyCategoryId", value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select property category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Category List</SelectLabel>
          {data?.data?.map((category: PropertyCategory) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
