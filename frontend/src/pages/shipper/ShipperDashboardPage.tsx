import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useGetShipperRestaurant } from "@/api/shipper/ShipperApi"
import { Truck } from "lucide-react"

const ShipperDashboardPage = () => {
  const navigate = useNavigate()
  const { data, isLoading, error } = useGetShipperRestaurant()

  useEffect(() => {
    if (error) {
      navigate("/shipper")
    }
  }, [error, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Truck className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">QuickMunch</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("shipperToken")
                localStorage.removeItem("shipperUser")
                navigate("/shipper")
              }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {data.user.name}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            You are assigned to {data.restaurant.name}
          </p>
        </div>

        {/* Restaurant Info Card */}
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Restaurant Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-sm text-gray-900">{data.restaurant.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1 text-sm text-gray-900">{data.restaurant.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1 text-sm text-gray-900">{data.restaurant.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cuisine</p>
                <p className="mt-1 text-sm text-gray-900">{data.restaurant.cuisine}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Orders</h2>
            <div className="text-center text-sm text-gray-500">
              No orders available at the moment.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipperDashboardPage 