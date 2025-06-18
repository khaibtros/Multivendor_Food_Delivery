import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Store, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin/AdminHeader";
import { useVerifyAdminAccess } from "@/api/admin/AdminApi";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AdminDashboardPage = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const navigate = useNavigate();
  const { data: adminData } = useVerifyAdminAccess();

  useEffect(() => {
    if (adminData?.user) {
      setAdminUser({
        id: adminData.user._id,
        email: adminData.user.email,
        name: adminData.user.name || adminData.user.email,
        role: adminData.user.role
      });
    } else {
      navigate("/admin");
    }
  }, [adminData, navigate]);

  if (!adminUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Restaurant Approvals Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Restaurant Approvals</h3>
                <p className="text-sm text-gray-500">Review and manage restaurant applications</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/admin/restaurant-approvals")}
                className="w-full"
              >
                View Pending Approvals
              </Button>
            </div>
          </div>

          {/* Users Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500">Manage user roles and permissions</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/admin/users")}
                className="w-full"
              >
                Manage Users
              </Button>
            </div>
          </div>

          {/* Restaurants Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Restaurants</h3>
                <p className="text-sm text-gray-500">View and manage all restaurants</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/admin/restaurants")}
                className="w-full"
              >
                View Restaurants
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage; 