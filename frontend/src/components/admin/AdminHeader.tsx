import { useAuth0 } from "@auth0/auth0-react";
import { Shield, LogOut } from "lucide-react";

const AdminHeader = () => {
  const { logout, user } = useAuth0();

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">QuickMunch Admin</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 