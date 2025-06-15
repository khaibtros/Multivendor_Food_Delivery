import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Store, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin/AdminHeader";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AdminDashboardPage = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    if (!storedAdmin) {
      navigate("/admin");
      return;
    }
    setAdminUser(JSON.parse(storedAdmin));
  }, [navigate]);

  if (!adminUser) {
    return null;
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
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/admin/users")}
                className="w-full"
                variant="outline"
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
                variant="outline"
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