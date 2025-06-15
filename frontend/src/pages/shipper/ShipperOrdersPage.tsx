"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetShipperRestaurant, useGetShipperOrders, useUpdateOrderStatus } from "@/api/shipper/ShipperApi";
import { OrderStatus, Order } from "@/types";
import { ORDER_STATUS } from "@/config/order-status-config";

const ShipperOrdersPage = () => {
  const navigate = useNavigate();

  const {
    data: shipperData,
    isLoading: isLoadingShipper,
    error: shipperError,
  } = useGetShipperRestaurant();

  const { 
    data: orders, 
    isLoading: isLoadingOrders, 
    error: ordersError,
    refetch: refetchOrders 
  } = useGetShipperOrders();

  const { 
    mutate: updateOrderStatus,
    isLoading: isUpdatingStatus 
  } = useUpdateOrderStatus();

  useEffect(() => {
    if (!isLoadingShipper && !shipperData) {
      // If no shipper data, redirect to shipper login
      navigate("/shipper");
    }
  }, [isLoadingShipper, shipperData, navigate]);

  if (isLoadingShipper || isLoadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Orders...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your delivery orders.
          </p>
        </div>
      </div>
    );
  }

  if (shipperError || ordersError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Error Loading Orders</h2>
          <p className="text-muted-foreground">
            {shipperError ? "Failed to verify shipper access." : "Failed to load orders."}
          </p>
          <button
            onClick={() => refetchOrders()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
    // Shippers can only update from outForDelivery to delivered
    if (currentStatus === "outForDelivery") {
      return ORDER_STATUS.filter((s) => s.value === "delivered");
    }
    return [];
  };

  const formatOrderTime = (date: Date | string) => {
    try {
      const orderDate = date instanceof Date ? date : new Date(date);
      const hours = orderDate.getHours();
      const minutes = orderDate.getMinutes();
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${paddedMinutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your delivery orders
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {orders && orders.length > 0 ? (
          orders.map((order: Order) => (
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
                      <h4 className="text-sm font-medium mb-1">Restaurant</h4>
                      <p className="text-sm">{order.restaurant.restaurantName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.restaurant.addressLine1}, {order.restaurant.city}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Delivery Address</h4>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{order.deliveryDetails.addressLine1}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.deliveryDetails.city}, {order.deliveryDetails.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.cartItems.map((item: Order["cartItems"][0]) => (
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
                        disabled={isUpdatingStatus || getAvailableStatuses(order.status).length === 0}
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
              <p className="text-muted-foreground">No delivery orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShipperOrdersPage;
