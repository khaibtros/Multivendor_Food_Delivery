"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DollarSign, Package, Activity, TrendingUp, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import {
  useGetSellerRestaurant,
} from "@/api/seller/SellerApi"

const SellerDashboardPage = () => {
  const navigate = useNavigate()

  const { data: sellerData, isLoading: isLoadingSeller, error: sellerError } =
    useGetSellerRestaurant()

  useEffect(() => {
    if (!isLoadingSeller && !sellerData) {
      navigate("/seller")
    }
  }, [isLoadingSeller, sellerData, navigate])

  if (isLoadingSeller) {
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

  if (sellerError) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {sellerError instanceof Error ? sellerError.message : 
      
           "Failed to load dashboard data. Please try refreshing the page."}
        </AlertDescription>
      </Alert>
    )
  }

  if (!sellerData?.restaurant) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No restaurant found. Please set up your restaurant first.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your restaurant dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {sellerData.restaurant.name}
          </Badge>
        </div>
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
      </div>
    </div>
  )
}

export default SellerDashboardPage 