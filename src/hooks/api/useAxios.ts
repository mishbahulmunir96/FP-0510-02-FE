import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(error),
);

const useAxios = () => {
  return { axiosInstance };
};

export default useAxios;
