import { useQuery } from "react-query"
import { toast } from "sonner"

interface VerifySellerResponse {
  user: {
    _id: string
    email: string
    name: string
    role: string
  }
  restaurant: {
    _id: string
    name: string
    address: string
    phone: string
    cuisine: string
    image: string
  }
}

export const useGetSellerRestaurant = () => {
  const getSellerRestaurantRequest = async (): Promise<VerifySellerResponse> => {
    const token = localStorage.getItem("sellerToken")
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/seller/restaurant`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch restaurant data")
    }

    return response.json()
  }

  return useQuery<VerifySellerResponse, unknown>(["getSellerRestaurant"], getSellerRestaurantRequest, {
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to fetch restaurant data")
    },
  })
}

