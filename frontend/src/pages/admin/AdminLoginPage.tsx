"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { Shield } from "lucide-react"
import { useVerifyAdminAccess } from "@/api/admin/AdminApi"
import { toast } from "sonner"

const AdminLoginPage = () => {
  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const { data, isLoading, error } = useVerifyAdminAccess()

  useEffect(() => {
    const setupAuth = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          // Force a token refresh to get updated role information
          const token = await getAccessTokenSilently({
            authorizationParams: {
              prompt: "login"
            }
          })
          
          if (data) {
            navigate("/admin/dashboard")
          } else if (error) {
            toast.error("You don't have permission to access the admin dashboard.")
            navigate("/")
          }
        } catch (error) {
          console.error("Error getting access token:", error)
          toast.error("Authentication failed. Please try logging in again.")
          navigate("/")
        }
      }
    }

    setupAuth()
  }, [isAuthenticated, isLoading, data, error, navigate, getAccessTokenSilently])

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
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
