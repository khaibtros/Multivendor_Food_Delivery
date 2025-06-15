import { Order } from "@/types";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul className="space-y-2">
          {order.cartItems.map((item) => (
            <li key={item.menuItemId} className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.name}</span>
                <Badge variant="outline">x{item.quantity}</Badge>
              </div>
              {item.toppings && item.toppings.length > 0 && (
                <span className="text-sm text-muted-foreground ml-4">
                  {item.toppings.map(t => t.selectedOption.name).join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">Payment Method:</span>
          <Badge variant="outline">{order.paymentMethod.toUpperCase()}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Payment Status:</span>
          <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
            {order.paymentStatus.toUpperCase()}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Total:</span>
          <span className="font-medium">£{(order.totalAmount / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
