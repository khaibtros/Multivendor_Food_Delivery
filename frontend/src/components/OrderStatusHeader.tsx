import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";
import { Badge } from "./ui/badge";
import { Clock } from "lucide-react";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    );
  };

  const formatOrderTime = () => {
    const created = new Date(order.createdAt);
    const hours = created.getHours();
    const minutes = created.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tighter">Order Status:</h1>
            <Badge variant="outline" className="text-lg">
              {getOrderStatusInfo().label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-muted-foreground">
              Placed at {formatOrderTime()}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Payment:</span>
            <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
              {order.paymentStatus.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {order.paymentMethod.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Expected by:</span>
            <span className="text-muted-foreground">{getExpectedDelivery()}</span>
          </div>
        </div>
      </div>
      <Progress
        className="h-2"
        value={getOrderStatusInfo().progressValue}
      />
    </div>
  );
};

export default OrderStatusHeader;
