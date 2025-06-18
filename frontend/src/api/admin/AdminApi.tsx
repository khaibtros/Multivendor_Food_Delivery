import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface VerifyAdminResponse {
  user: User;
  message?: string;
}

export const useVerifyAdminAccess = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  const verifyAdminRequest = async (): Promise<VerifyAdminResponse> => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          prompt: "login"
        }
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await getAccessTokenSilently({
          authorizationParams: {
            prompt: "login"
          }
        });
        
        // Retry the request with new token
        const retryResponse = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json();
          throw new Error(error.message || "Failed to verify admin access");
        }

        return retryResponse.json();
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify admin access");
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("token")) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      }
      throw error;
    }
  };

  const { data, isLoading, error, isSuccess } = useQuery(
    "verifyAdminAccess",
    verifyAdminRequest,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  if (isSuccess) {
    toast.success("Admin access verified");
  }

  if (error) {
    toast.error("Failed to verify admin access");
  }

  return { data, isLoading, error };
};

