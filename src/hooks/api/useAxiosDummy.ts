import { axiosInstance } from "@/lib/axios";
import { useEffect } from "react";

const useAxios = () => {
  // Konfigurasi interceptor
  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
    };
  }, []);

  return axiosInstance; // Hanya kembalikan axiosInstance
};

export default useAxios;
