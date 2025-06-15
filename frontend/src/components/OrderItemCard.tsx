import { Order, OrderStatus } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useUpdateOrderStatus } from "@/api/seller/SellerApi";
import { useEffect, useState } from "react";

type Props = {
  order: Order;
  role: "seller" | "shipper";
};

const OrderItemCard = ({ order, role }: Props) => {
  const { mutate: updateOrderStatus, isLoading } = useUpdateOrderStatus();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    updateOrderStatus(
      { orderId: order._id as string, status: newStatus },
      {
        onSuccess: () => {
          setStatus(newStatus);
        },
      }
    );
  };

  const getTime = () => {
    const orderDateTime = new Date(order.createdAt);
    const hours = orderDateTime.getHours();
    const minutes = orderDateTime.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };

  const getAvailableStatuses = () => {
    if (role === "shipper") {
      // Shippers can only confirm delivery
      return ORDER_STATUS.filter((s) => s.value === "delivered");
    }

    // Sellers can update status based on payment method
    const validTransitions = {
      pending: ["confirmed", "inProgress"],
      confirmed: ["inProgress"],
      inProgress: ["outForDelivery"],
    };

    return ORDER_STATUS.filter((s) => 
      validTransitions[order.status as keyof typeof validTransitions]?.includes(s.value)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3">
          <div>
            Customer Name:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.name}
            </span>
          </div>
          <div>
            Delivery address:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
            </span>
          </div>
          <div>
            Time:
            <span className="ml-2 font-normal">{getTime()}</span>
          </div>
          <div>
            Total Cost:
            <span className="ml-2 font-normal">
              £{(order.totalAmount / 100).toFixed(2)}
            </span>
          </div>
        </CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
            Payment: {order.paymentStatus}
          </Badge>
          <Badge variant="outline">
            Method: {order.paymentMethod.toUpperCase()}
          </Badge>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {order.cartItems.map((cartItem) => (
            <span key={cartItem.menuItemId}>
              <Badge variant="outline" className="mr-2">
                {cartItem.quantity}
              </Badge>
              {cartItem.name}
              {cartItem.toppings && cartItem.toppings.length > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({cartItem.toppings.map(t => t.selectedOption.name).join(", ")})
                </span>
              )}
            </span>
          ))}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="status">Order Status</Label>
          <Select
            value={status}
            disabled={isLoading}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              {getAvailableStatuses().map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;