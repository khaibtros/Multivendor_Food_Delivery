import { Order } from "@/types/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get orders");
    }

    return response.json();
  };

  const { data: orders, isLoading } = useQuery(
    "fetchMyOrders",
    getMyOrdersRequest,
    {
      refetchInterval: 5000,
    }
  );

  return { orders, isLoading };
};

type CheckoutSessionRequest = {
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
  restaurantId: string;
  paymentMethod: "cod" | "online";
};

interface CheckoutSessionResponse {
  url?: string;
  orderId?: string;
}

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/order/checkout/create-checkout-session`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutSessionRequest),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unable to create checkout session");
    }

    return response.json();
  };

  return useMutation({
    mutationFn: createCheckoutSessionRequest,
    onSuccess: (data) => {
      if (data.url) {
        // For online payment, redirect to Stripe
        window.location.href = data.url;
      } else if (data.orderId) {
        // For COD, show success message
        toast.success("Order placed successfully! Waiting for confirmation.");
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to place order");
    },
  });
};
