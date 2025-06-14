import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useGetCurrentUser } from "@/api/MyUserApi";
import { useGetMyUser } from "@/api/MyUserApi";
import { useGetManagerRestaurant } from "@/api/manager/ManagerApi";
import { useGetSellerRestaurant } from "@/api/seller/SellerApi";
import { useGetShipperRestaurant } from "@/api/shipper/ShipperApi";

// Base protected route that just checks authentication
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { currentUser, isLoading: isLoadingUser } = useGetMyUser();

  if (isLoading || isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Admin protected route
export const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const adminUser = localStorage.getItem("adminUser");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !adminUser) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

// Manager protected route
export const ManagerProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { data: managerData, isLoading: isLoadingManager } = useGetManagerRestaurant();

  if (isLoading || isLoadingManager) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !managerData) {
    return <Navigate to="/manager" replace />;
  }

  return <Outlet />;
};

// User protected route (for regular users)
export const UserProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { currentUser, isLoading: isLoadingUser } = useGetCurrentUser();

  if (isLoading || isLoadingUser) {
    return null;
  }

  if (isAuthenticated && currentUser?.role === "user") {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export const SellerProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { data: sellerData, isLoading: isLoadingSeller } = useGetSellerRestaurant();

  if (isLoading || isLoadingSeller) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !sellerData) {
    return <Navigate to="/seller" replace />;
  }

  return <Outlet />;
};

export const ShipperProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { data: shipperData, isLoading: isLoadingShipper } = useGetShipperRestaurant();

  if (isLoading || isLoadingShipper) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !shipperData) {
    return <Navigate to="/shipper" replace />;
  }

  return <Outlet />;
};
