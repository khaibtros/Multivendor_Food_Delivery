import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { toast } from "sonner";
import { Restaurant } from "@/types";

interface VerifyManagerResponse {
  user: {
    _id: string;
    email: string;
    role: string;
  };
  restaurant: Restaurant;
}

interface RestaurantStats {
  restaurantName: string;
  activeOrders: number;
  totalRevenue: number;
  totalOrders: number;
  restaurantId: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

export const useVerifyManagerAccess = (restaurantId?: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const verifyManagerAccessRequest = async () => {
    const accessToken = await getAccessTokenSilently();
    const url = restaurantId 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/manager/verify/${restaurantId}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/manager/verify`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify manager access");
    }

    return response.json();
  };

  return useQuery<VerifyManagerResponse>({
    queryKey: ["verifyManagerAccess", restaurantId],
    queryFn: verifyManagerAccessRequest,
  });
};

export const useGetRestaurantStats = (restaurantId: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantStatsRequest = async () => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/manager/restaurant/${restaurantId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant stats");
    }

    return response.json();
  };

  return useQuery<RestaurantStats>({
    queryKey: ["restaurantStats", restaurantId],
    queryFn: getRestaurantStatsRequest,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: () => {
      toast.error("Failed to fetch restaurant statistics");
    },
  });
};

export const useGetRestaurantActivity = (restaurantId: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantActivityRequest = async () => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/manager/restaurant/${restaurantId}/activity`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant activity");
    }

    return response.json();
  };

  return useQuery<RecentActivity[]>({
    queryKey: ["restaurantActivity", restaurantId],
    queryFn: getRestaurantActivityRequest,
    refetchInterval: 60000, // Refetch every minute
    onError: () => {
      toast.error("Failed to fetch recent activity");
    },
  });
};

export const useGetManagerRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getManagerRestaurantRequest = async () => {
    const accessToken = await getAccessTokenSilently();
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/manager/restaurant`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get manager restaurant");
    }

    return response.json();
  };

  return useQuery<VerifyManagerResponse>({
    queryKey: ["getManagerRestaurant"],
    queryFn: getManagerRestaurantRequest,
  });
}; 