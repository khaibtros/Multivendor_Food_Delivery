"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { Shield } from "lucide-react"
import { useVerifyAdminAccess } from "@/api/admin/AdminApi"

const AdminLoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const { data, isLoading, error } = useVerifyAdminAccess()

  useEffect(() => {
    if (isAuthenticated) {
      if (data) {
        localStorage.setItem("adminUser", JSON.stringify(data.user))
        navigate("/admin/dashboard")
      } else if (error) {
        navigate("/")
      }
    }
  }, [isAuthenticated, data, error, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="flex items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-xl font-bold text-gray-900">QuickMunch</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Admin Access</h1>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to access the admin dashboard.
              </p>
            </div>

            <button
              onClick={() => loginWithRedirect()}
              className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              {isLoading ? "Verifying..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
