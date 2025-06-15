import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import { Restaurant } from "@/types";

interface User {
  _id: string;
  email: string;
  role: string;
  auth0Id: string;
}

interface VerifySellerResponse {
  user: User;
  restaurant: Restaurant;
}

interface OrderUser {
  email: string;
  name: string;
}

interface DeliveryDetails {
  email: string;
  name: string;
  addressLine1: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

interface CartItem {
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
}

interface Order {
  _id: string;
  user: OrderUser;
  status: "pending" | "confirmed" | "inProgress" | "outForDelivery" | "delivered";
  paymentStatus: "unpaid" | "paid";
  paymentMethod: "cod" | "online";
  totalAmount: number;
  createdAt: string;
  deliveryDetails: DeliveryDetails;
  cartItems: CartItem[];
}

export const useGetSellerRestaurant = () => {
  const { getAccessTokenSilently, logout } = useAuth0();

  const getSellerRestaurantRequest = async (): Promise<VerifySellerResponse> => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          prompt: "login"
        }
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/seller/restaurant`, {
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
        const retryResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/seller/restaurant`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json();
          throw new Error(error.message || "Failed to fetch restaurant data");
        }

        return retryResponse.json();
      }

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          throw new Error("You don't have permission to access the seller dashboard. Please contact your manager.");
        }
        throw new Error(error.message || "Failed to fetch restaurant data");
      }

      return response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("token")) {
        toast.error("Your session has expired. Please log in again.");
        logout();
      }
      throw error;
    }
  };

  return useQuery<VerifySellerResponse>({
    queryKey: ["getSellerRestaurant"],
    queryFn: getSellerRestaurantRequest,
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to fetch restaurant data");
    },
  });
};

export const useGetSellerOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getSellerOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/seller/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch orders");
    }

    return response.json();
  };

  return useQuery<Order[]>({
    queryKey: ["getSellerOrders"],
    queryFn: getSellerOrdersRequest,
  });
};

export const useUpdateOrderStatus = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/seller/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update order status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getSellerOrders"] });
    },
  });
};