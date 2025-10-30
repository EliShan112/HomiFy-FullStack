import axios from "axios";
import { useRouter } from "next/navigation";

export const useProtectedApi = () => {
  const router = useRouter();

  const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
  });

  // Interceptor to handle 401
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const redirectTo  = error.response.data?.redirectTo || window.location.pathname;

        router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      }
      return Promise.reject(error);
    }
  );
 
  return api; 
};
