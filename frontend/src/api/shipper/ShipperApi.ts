import { useQuery } from "react-query"
import { toast } from "sonner"
import { useAuth0 } from "@auth0/auth0-react"

interface VerifyShipperResponse {
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

export const useGetShipperRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0()

  const getShipperRestaurantRequest = async () => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/shipper/restaurant`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch shipper restaurant")
      }

      return response.json()
    } catch (error) {
      toast.error("Failed to fetch shipper restaurant")
      throw error
    }
  }

  return useQuery<VerifyShipperResponse>({
    queryKey: ["getShipperRestaurant"],
    queryFn: getShipperRestaurantRequest
  })
} 