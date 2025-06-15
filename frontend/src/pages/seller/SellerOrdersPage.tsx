"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetSellerRestaurant, useGetSellerOrders, useUpdateOrderStatus } from "@/api/seller/SellerApi";
import { OrderStatus } from "@/types";
import { ORDER_STATUS } from "@/config/order-status-config";
import { toast } from "sonner";

const SellerOrdersPage = () => {
  const navigate = useNavigate();

  const {
    data: sellerData,
    isLoading: isLoadingSeller,
    error: sellerError,
  } = useGetSellerRestaurant();

  const { 
    data: orders, 
    isLoading: isLoadingOrders, 
    error: ordersError,
    refetch: refetchOrders 
  } = useGetSellerOrders();

  const { 
    mutate: updateOrderStatus,
    isLoading: isUpdatingStatus 
  } = useUpdateOrderStatus();

  useEffect(() => {
    if (!isLoadingSeller && !sellerData) {
      // If no seller data, redirect to seller login
      navigate("/seller");
    }
  }, [isLoadingSeller, sellerData, navigate]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully");
          refetchOrders();
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to update order status");
        }
      }
    );
  };

  const getAvailableStatuses = (currentStatus: OrderStatus) => {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["confirmed", "inProgress"],
      confirmed: ["inProgress"],
      inProgress: ["outForDelivery"],
      outForDelivery: ["delivered"],
      delivered: []
    };

    return ORDER_STATUS.filter((s) => 
      validTransitions[currentStatus]?.includes(s.value as OrderStatus)
    );
  };

  const formatOrderTime = (date: string) => {
    try {
      const orderDate = new Date(date);
      const hours = orderDate.getHours();
      const minutes = orderDate.getMinutes();
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${paddedMinutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (isLoadingSeller || isLoadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Orders...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your restaurant data.
          </p>
        </div>
      </div>
    );
  }

  if (sellerError) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {sellerError instanceof Error
            ? sellerError.message
            : "Failed to load dashboard data. Please try refreshing the page."}
        </AlertDescription>
      </Alert>
    );
  }

  if (ordersError) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {ordersError instanceof Error
            ? ordersError.message
            : "Failed to load orders. Please try refreshing the page."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!sellerData?.restaurant) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No restaurant found. Please set up your restaurant first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your restaurant orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {sellerData.restaurant.restaurantName}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Order #{order._id.slice(-6)}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatOrderTime(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {order.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Customer Details</h4>
                      <p className="text-sm">{order.user.name}</p>
                      <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Delivery Address</h4>
                      <p className="text-sm">{order.deliveryDetails.addressLine1}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryDetails.city}, {order.deliveryDetails.country}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.cartItems.map((item) => (
                        <div key={item.menuItemId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              x{item.quantity}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground">
                            ${(item.itemTotal / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Order Status</h4>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order._id, value as OrderStatus)}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableStatuses(order.status).map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold">${(order.totalAmount / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerOrdersPage;
