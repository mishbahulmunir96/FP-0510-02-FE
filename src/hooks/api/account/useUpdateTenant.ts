"use client";

import useAxios from "@/hooks/api/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Interface untuk data tenant

// Interface untuk payload update tenant
interface UpdateTenantPayload {
  name?: string;
  phoneNumber?: string;
  bankName?: string;
  bankNumber?: string;
  imageFile?: File | null;
}

// Hook untuk mengupdate tenant profile
export const useUpdateTenant = () => {
  const router = useRouter();
  const { axiosInstance } = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateTenantPayload) => {
      const updateTenantForm = new FormData();

      // Append semua field yang ada di payload ke FormData
      if (payload.name) updateTenantForm.append("name", payload.name);
      if (payload.phoneNumber)
        updateTenantForm.append("phoneNumber", payload.phoneNumber);
      if (payload.bankName)
        updateTenantForm.append("bankName", payload.bankName);
      if (payload.bankNumber)
        updateTenantForm.append("bankNumber", payload.bankNumber);
      if (payload.imageFile)
        updateTenantForm.append("imageFile", payload.imageFile);

      // Menggunakan endpoint tenant tanpa ID
      const { data } = await axiosInstance.patch(
        "/account/tenant",
        updateTenantForm,
      );
      return data;
    },
    onSuccess: async () => {
      toast.success("Tenant profile updated successfully");
      // Invalidate query untuk memperbarui cache
      await queryClient.invalidateQueries({ queryKey: ["tenant"] });
      router.push("/tenant/dashboard/account");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data.message ||
          error.response?.data ||
          "Failed to update tenant profile",
      );
    },
  });
};
