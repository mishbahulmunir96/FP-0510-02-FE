import useAxios from "@/hooks/api/useAxios";
import { PageableResponse, PaginationQueries } from "@/types/pagination";
import { PropertyCategory } from "@/types/propertyCategory";
import { useQuery } from "@tanstack/react-query";

interface GetCategoryListQueries extends PaginationQueries {
  search?: string;
  userId?: number;
}

const useGetCategory = (queries: GetCategoryListQueries) => {
  const { axiosInstance } = useAxios();

  return useQuery({
    queryKey: ["categorylist", queries],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PageableResponse<PropertyCategory>
      >("/categories/", { params: queries });
      return data;
    },
  });
};

export default useGetCategory;
