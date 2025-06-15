import { useQuery, useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { useAuth0 } from "@auth0/auth0-react"
import { Restaurant, Order, OrderStatus } from "@/types"

interface VerifyShipperResponse {
  user: {
    _id: string
    email: string
    name: string
    role: string
  }
  restaurant: Restaurant
}

interface DeliveryOrder {
  _id: string
  user: {
    email: string
    name: string
  }
  status: "pending" | "confirmed" | "inProgress" | "outForDelivery" | "delivered"
  paymentStatus: "unpaid" | "paid"
  paymentMethod: "cod" | "online"
  totalAmount: number
  createdAt: string
  deliveryDetails: {
    email: string
    name: string
    addressLine1: string
    street: string
    ward: string
    district: string
    city: string
    country: string
  }
  cartItems: {
    menuItemId: string
    name: string
    quantity: string
    price: number
    toppings?: {
      categoryName: string
      selectedOption: {
        name: string
        price: number
      }
    }[]
    itemTotal: number
  }[]
}

export const useGetShipperRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0()

  const getShipperRestaurantRequest = async () => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/shipper/restaurant`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch shipper restaurant")
    }

    return response.json()
  }

  return useQuery<VerifyShipperResponse>({
    queryKey: ["getShipperRestaurant"],
    queryFn: getShipperRestaurantRequest,
    onError: () => {
      toast.error("Failed to fetch shipper restaurant")
    }
  })
}

export const useGetDeliveryOrders = () => {
  const { getAccessTokenSilently } = useAuth0()

  const getDeliveryOrdersRequest = async () => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/shipper/orders`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch delivery orders")
    }

    return response.json()
  }

  return useQuery<DeliveryOrder[]>({
    queryKey: ["deliveryOrders"],
    queryFn: getDeliveryOrdersRequest,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: () => {
      toast.error("Failed to fetch delivery orders")
    }
  })
}

export const useConfirmDelivery = () => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const confirmDeliveryRequest = async ({
    orderId,
    paymentReceived,
  }: {
    orderId: string
    paymentReceived: boolean
  }) => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/shipper/order/${orderId}/confirm-delivery`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ paymentReceived }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to confirm delivery")
    }

    return response.json()
  }

  return useMutation({
    mutationFn: confirmDeliveryRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["deliveryOrders"] })
      if (data.paymentMethod === "cod") {
        toast.success("Delivery confirmed and payment received")
      } else {
        toast.success("Delivery confirmed successfully")
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to confirm delivery")
    }
  })
}

export const useGetShipperOrders = () => {
  const { getAccessTokenSilently } = useAuth0()

  const getShipperOrdersRequest = async () => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/shipper/orders?status=outForDelivery`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch shipper orders")
    }

    return response.json()
  }

  return useQuery<Order[]>({
    queryKey: ["shipperOrders"],
    queryFn: getShipperOrdersRequest,
    refetchInterval: 30000, // Refetch every 30 seconds
    onError: () => {
      toast.error("Failed to fetch delivery orders")
    },
  })
}

export const useUpdateOrderStatus = () => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const updateOrderStatusRequest = async ({
    orderId,
    status,
  }: {
    orderId: string
    status: OrderStatus
  }) => {
    const accessToken = await getAccessTokenSilently()
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/shipper/order/${orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update order status")
    }

    return response.json()
  }

  return useMutation({
    mutationFn: updateOrderStatusRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipperOrders"] })
      toast.success("Order status updated successfully")
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update order status")
    },
  })
} 