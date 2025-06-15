import { useGetMyOrders } from "@/api/OrderApi";
import OrderStatusDetail from "@/components/OrderStatusDetail";
import OrderStatusHeader from "@/components/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2 } from "lucide-react";

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <h2 className="text-xl font-semibold">Loading Orders...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your order history.
          </p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No Orders Found</h2>
          <p className="text-muted-foreground">
            You haven't placed any orders yet. Start exploring restaurants to place your first order!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {orders.map((order) => (
        <div key={order._id} className="space-y-10 bg-gray-50 p-10 rounded-lg">
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img
                src={order.restaurant.imageUrl}
                className="rounded-md object-cover h-full w-full"
                alt={`${order.restaurant.restaurantName} restaurant image`}
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
