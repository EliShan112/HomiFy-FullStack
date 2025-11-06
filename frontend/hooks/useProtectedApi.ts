import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

export const useProtectedApi = () => {
  const router = useRouter();
  const pathname = usePathname();

  // 'useMemo' is the key. It "locks" the 'api' object
  // and will only re-create it if 'router' or 'pathname' changes.
  // This stops it from being re-created on every render.
  const api = useMemo(() => {
    const api = axios.create({
      baseURL: "http://localhost:4000",
      withCredentials: true,
    });

    // Interceptor to handle 401
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        
        // Stop redirect loop if already on login page
        if (pathname === '/login') {
          return Promise.reject(error);
        }

        // If 401, redirect to login
        if (error.response?.status === 401) {
          const redirectTo = error.response.data?.redirectTo || pathname;
          router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        }
        
        return Promise.reject(error);
      }
    );

    return api;
  }, [router, pathname]); // The dependencies for the hook

  return api;
};