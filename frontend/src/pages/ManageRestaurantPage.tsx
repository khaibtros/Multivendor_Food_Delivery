import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
  useUpdateMyRestaurant,
} from "@/api/MyRestaurantApi";
import OrderItemCard from "@/components/OrderItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import { Loader2 } from "lucide-react";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateMyRestaurant();

  const { orders, isLoading: isLoadingOrders } = useGetMyRestaurantOrders();

  const isEditing = !!restaurant;

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 p-10 rounded-lg"
      >
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
            <h2 className="text-xl font-semibold">No Active Orders</h2>
            <p className="text-muted-foreground">
              You don't have any active orders at the moment.
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
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
