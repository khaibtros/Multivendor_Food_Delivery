import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface VerifyAdminResponse {
  user: User;
  message?: string;
}

export const useVerifyAdminAccess = () => {
  const { getAccessTokenSilently } = useAuth0();

  const verifyAdminRequest = async (): Promise<VerifyAdminResponse> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify admin access");
    }

    return data;
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

export const useMakeUserAdmin = () => {
  const { getAccessTokenSilently } = useAuth0();

  const makeUserAdminRequest = async (email: string): Promise<{ message: string }> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/admin/make-admin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to make user admin");
    }

    return data;
  };

  const {
    mutate: makeUserAdmin,
    isLoading,
    error,
    isSuccess,
  } = useMutation(makeUserAdminRequest);

  if (isSuccess) {
    toast.success("User role updated to admin");
  }

  if (error) {
    toast.error("Failed to update user role");
  }

  return { makeUserAdmin, isLoading };
}; 