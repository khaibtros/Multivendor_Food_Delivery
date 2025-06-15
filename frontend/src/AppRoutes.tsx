import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import UserProfilePage from "@/pages/UserProfilePage";
import { AdminProtectedRoute, ManagerProtectedRoute, ProtectedRoute, SellerProtectedRoute, ShipperProtectedRoute } from "./auth/ProtectedRoute";
import ManageRestaurantPage from "./pages/ManageRestaurantPage";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import RestaurantApprovalsPage from "./pages/admin/RestaurantApprovalsPage";
import ManagerDashboardPage from "./pages/manager/ManagerDashboardPage";
import ManagerLoginPage from "./pages/manager/ManagerLoginPage";
import SellerLoginPage from "./pages/seller/SellerLoginPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import DashboardLayout from "./layouts/ManagerLayout";
import SellerLayout from "./layouts/SellerLayout";
import ShipperLayout from "./layouts/ShipperLayout";
import ManageSellersPage from "@/pages/manager/ManageSellersPage";
import ShipperLoginPage from "@/pages/shipper/ShipperLoginPage";
import ShipperOrdersPage from "@/pages/shipper/ShipperOrdersPage";
import ManageShippersPage from "@/pages/manager/ManageShippersPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showHero>
            <HomePage />
          </Layout>
        }
      />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/restaurant-approvals" element={<RestaurantApprovalsPage />} />
      </Route>
      
      {/* Manager Routes */}
      <Route path="/manager" element={<ManagerLoginPage />} />
      <Route element={<ManagerProtectedRoute />}>
        <Route
          path="/manager/dashboard/:restaurantId"
          element={
            <DashboardLayout>
              <ManagerDashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/manager/sellers"
          element={
            <DashboardLayout>
              <ManageSellersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/manager/shippers"
          element={
            <DashboardLayout>
              <ManageShippersPage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Seller Routes */}
      <Route path="/seller" element={<SellerLoginPage />} />
      <Route element={<SellerProtectedRoute />}>
        <Route
          path="/seller/orders"
          element={
            <SellerLayout>
              <SellerOrdersPage />
            </SellerLayout>
          }
        />
      </Route>

      {/* Shipper Routes */}
      <Route path="/shipper" element={<ShipperLoginPage />} />
      <Route element={<ShipperProtectedRoute />}>
        <Route
          path="/shipper/orders"
          element={
            <ShipperLayout>
              <ShipperOrdersPage />
            </ShipperLayout>
          }
        />
      </Route>

      {/* Public Routes */}
      <Route
        path="/search/:city"
        element={
          <Layout showHero={false}>
            <SearchPage />
          </Layout>
        }
      />
      <Route
        path="/detail/:restaurantId"
        element={
          <Layout showHero={false}>
            <DetailPage />
          </Layout>
        }
      />

      {/* User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/order-status"
          element={
            <Layout>
              <OrderStatusPage />
            </Layout>
          }
        />
        <Route
          path="/user-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
        <Route
          path="/manage-restaurant"
          element={
            <Layout>
              <ManageRestaurantPage />
            </Layout>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
