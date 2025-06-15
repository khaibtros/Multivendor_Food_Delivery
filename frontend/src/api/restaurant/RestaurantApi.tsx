import { useQuery, useMutation, useQueryClient } from "react-query";
import { Restaurant } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth0 } from "@auth0/auth0-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

// Get pending restaurants (admin only)
export const useGetPendingRestaurants = () => {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery<ApiResponse<Restaurant[]>>({
    queryKey: ["pendingRestaurants"],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/restaurant/admin/pending`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch pending restaurants");
        }
        
        return response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch pending restaurants",
          variant: "destructive",
        });
        throw error;
      }
    },
  });
};

// Approve restaurant (admin only)
export const useApproveRestaurant = () => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();
  
  return useMutation<ApiResponse<Restaurant>, Error, { restaurantId: string; approvalNote?: string }>({
    mutationFn: async ({ restaurantId, approvalNote }) => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `${API_BASE_URL}/api/restaurant/admin/${restaurantId}/approve`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify({ approvalNote }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to approve restaurant");
        }

        return response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to approve restaurant",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pendingRestaurants"] });
      toast({
        title: "Success",
        description: data.message || "Restaurant approved successfully",
      });
    },
  });
};

// Reject restaurant (admin only)
export const useRejectRestaurant = () => {
  const queryClient = useQueryClient();
  const { getAccessTokenSilently } = useAuth0();
  
  return useMutation<ApiResponse<Restaurant>, Error, { restaurantId: string; approvalNote: string }>({
    mutationFn: async ({ restaurantId, approvalNote }) => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `${API_BASE_URL}/api/restaurant/admin/${restaurantId}/reject`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify({ approvalNote }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to reject restaurant");
        }

        return response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to reject restaurant",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pendingRestaurants"] });
      toast({
        title: "Success",
        description: data.message || "Restaurant rejected successfully",
      });
    },
  });
}; 