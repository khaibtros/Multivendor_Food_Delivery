import { useGetMyRestaurantOrders } from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Loader2 } from "lucide-react";

const OrderHistoryPage = () => {
  const { orders, isLoading: isLoadingOrders } = useGetMyRestaurantOrders();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Order History</h1>
      <div className="space-y-5 bg-gray-50 p-10 rounded-lg">
        {isLoadingOrders ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <h2 className="text-xl font-semibold">Loading Orders...</h2>
              <p className="text-muted-foreground">
                Please wait while we load your restaurant orders.
              </p>
            </div>
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">No Orders</h2>
            <p className="text-muted-foreground">
              You don't have any orders at the moment.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold">
              {orders?.length} {orders?.length === 1 ? "Order" : "Orders"}
            </h2>
            <div className="grid gap-4">
              {orders?.map((order) => (
                <OrderItemCard 
                  key={order._id} 
                  order={order} 
                  role="seller"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage; 