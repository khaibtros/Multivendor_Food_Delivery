import { useGetPendingRestaurants, useApproveRestaurant, useRejectRestaurant } from "@/api/restaurant/RestaurantApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";

const RestaurantApprovalsPage = () => {
  const { toast } = useToast();
  const { data: pendingRestaurants, isLoading, refetch } = useGetPendingRestaurants();
  const { mutateAsync: approveRestaurant, isLoading: isApproving } = useApproveRestaurant();
  const { mutateAsync: rejectRestaurant, isLoading: isRejecting } = useRejectRestaurant();

  const handleApprove = async (restaurantId: string) => {
    try {
      await approveRestaurant({ 
        restaurantId,
        approvalNote: "Restaurant approved by admin"
      });
      toast({
        title: "Success",
        description: "Restaurant has been approved",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve restaurant",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (restaurantId: string) => {
    try {
      await rejectRestaurant({ 
        restaurantId,
        approvalNote: "Restaurant rejected by admin"
      });
      toast({
        title: "Success",
        description: "Restaurant has been rejected",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject restaurant",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Restaurant Approvals
        </h1>
        
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : pendingRestaurants?.data?.length === 0 ? (
          <div className="text-center text-gray-500">No pending restaurants to approve</div>
        ) : (
          <div className="grid gap-6">
            {pendingRestaurants?.data?.map((restaurant) => (
              <Card key={restaurant._id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{restaurant.restaurantName}</span>
                    <span className="text-sm font-normal text-gray-500">
                      {restaurant.city}, {restaurant.country}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Contact Information</h3>
                      <p>Phone: {restaurant.phoneNumber}</p>
                      <p>Address: {restaurant.addressLine1}, {restaurant.city}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Business Details</h3>
                      <p>Cuisines: {restaurant.cuisines.join(", ")}</p>
                      <p>Delivery Price: £{(restaurant.deliveryPrice / 100).toFixed(2)}</p>
                      <p>Estimated Delivery Time: {restaurant.estimatedDeliveryTime} minutes</p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleApprove(restaurant._id)}
                        disabled={isApproving || isRejecting}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(restaurant._id)}
                        disabled={isApproving || isRejecting}
                        variant="destructive"
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantApprovalsPage; 