"use client"

import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DollarSign, Package, TrendingUp, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  useGetManagerRestaurant,
  useGetRestaurantStats,
  useGetRestaurantOrders,
  useGetRestaurantCustomers,
} from "@/api/manager/ManagerApi"

const ManagerDashboardPage = () => {
  const navigate = useNavigate()
  const { restaurantId } = useParams()

  const { data: managerData, isLoading: isLoadingManager } = useGetManagerRestaurant()
  const { data: stats, isLoading: isLoadingStats } = useGetRestaurantStats()
  const { data: orders, isLoading: isLoadingOrders } = useGetRestaurantOrders()
  const { data: customers, isLoading: isLoadingCustomers } = useGetRestaurantCustomers()

  useEffect(() => {
    if (!isLoadingManager && !managerData) {
      navigate("/manager")
    } else if (!isLoadingManager && managerData && restaurantId !== managerData.restaurant._id) {
      if (restaurantId) {
        navigate(`/manager/dashboard/${managerData.restaurant._id}`)
      }
    }
  }, [isLoadingManager, managerData, navigate, restaurantId])

  if (isLoadingManager || isLoadingStats || isLoadingOrders || isLoadingCustomers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your restaurant data.</p>
        </div>
      </div>
    )
  }

  if (!managerData?.restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Restaurant Found</h2>
          <p>It seems you don't have a restaurant associated with your account.</p>
        </div>
      </div>
    )
  }

  // Calculate average order value
  const averageOrderValue = stats?.totalOrders 
    ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
    : "0.00"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your restaurant today.</p>
        </div>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(2) || "0.00"}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="ml-1">Total revenue from all orders</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || "0"}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="ml-1">Total orders placed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || "0"}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="ml-1">Unique customers served</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="ml-1">Average amount per order</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your revenue performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
              <div className="text-center space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Revenue Chart</p>
                <p className="text-xs text-muted-foreground">Chart component will be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions from your restaurant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.user.name}</p>
                      <p className="text-xs text-muted-foreground">Order ID: {order._id}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">${(order.totalAmount / 100).toFixed(2)}</p>
                      <div className="flex gap-1 justify-end">
                        <Badge
                          variant={order.paymentStatus === "paid" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {order.paymentStatus.toUpperCase()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">No recent orders</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Your most valuable customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customers && customers.length > 0 ? (
              customers.slice(0, 5).map((customer) => (
                <div key={customer._id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">${customer.totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{customer.totalOrders} orders</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">No customer data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Distribution</CardTitle>
            <CardDescription>Geographic breakdown of your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25">
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Geographic Map</p>
                <p className="text-xs text-muted-foreground">Map component will be rendered here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Recent Orders</CardTitle>
          <CardDescription>Complete list of recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.user.name}</p>
                    <p className="text-xs text-muted-foreground">{order.user.email}</p>
                    <p className="text-xs text-muted-foreground">Order ID: {order._id}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">${(order.totalAmount / 100).toFixed(2)}</p>
                    <div className="flex gap-1 justify-end">
                      <Badge
                        variant={order.paymentStatus === "paid" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">No orders found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ManagerDashboardPage
