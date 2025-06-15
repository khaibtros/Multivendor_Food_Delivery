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
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
}

interface RestaurantOrder {
  _id: string;
  user: {
    email: string;
    name: string;
  };
  status: "pending" | "confirmed" | "inProgress" | "outForDelivery" | "delivered";
  paymentStatus: "unpaid" | "paid";
  paymentMethod: "cod" | "online";
  totalAmount: number;
  createdAt: string;
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
    price: number;
    toppings?: {
      categoryName: string;
      selectedOption: {
        name: string;
        price: number;
      };
    }[];
    itemTotal: number;
  }[];
}

interface RestaurantCustomer {
  _id: string;
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
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

export const useGetRestaurantStats = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantStatsRequest = async () => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/manager/stats`,
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
    queryKey: ["restaurantStats"],
    queryFn: getRestaurantStatsRequest,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: () => {
      toast.error("Failed to fetch restaurant statistics");
    },
  });
};

export const useGetRestaurantOrders = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  const getRestaurantOrdersRequest = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/manager/orders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 403) {
        toast.error("You don't have permission to view orders. Please contact support.");
        return [];
      }

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant orders");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes("token")) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      }
      throw error;
    }
  };

  return useQuery<RestaurantOrder[]>({
    queryKey: ["restaurantOrders"],
    queryFn: getRestaurantOrdersRequest,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: (error) => {
      if (error instanceof Error && !error.message.includes("token")) {
        toast.error("Failed to fetch restaurant orders");
      }
    },
  });
};

export const useGetRestaurantCustomers = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantCustomersRequest = async () => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/manager/customers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant customers");
    }

    return response.json();
  };

  return useQuery<RestaurantCustomer[]>({
    queryKey: ["restaurantCustomers"],
    queryFn: getRestaurantCustomersRequest,
    refetchInterval: 60000, // Refetch every minute
    onError: () => {
      toast.error("Failed to fetch restaurant customers");
    },
  });
};

export const useGetManagerRestaurant = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  const getManagerRestaurantRequest = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/manager/restaurant`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 403) {
        toast.error("You don't have permission to access this restaurant. Please contact support.");
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to get manager restaurant");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes("token")) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      }
      throw error;
    }
  };

  return useQuery<VerifyManagerResponse>({
    queryKey: ["getManagerRestaurant"],
    queryFn: getManagerRestaurantRequest,
    onError: (error) => {
      if (error instanceof Error && !error.message.includes("token")) {
        toast.error("Failed to get manager restaurant");
      }
    },
  });
}; 