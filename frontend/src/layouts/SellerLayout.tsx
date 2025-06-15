"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Calendar,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Store,
} from "lucide-react"
import { useGetManagerRestaurant } from "@/api/manager/ManagerApi"
import { useAuth0 } from "@auth0/auth0-react"

type Props = {
  children: React.ReactNode
}

type NavItemProps = {
  to: string
  icon: React.ElementType
  label: string
  isActive?: boolean
}

const NavItem = ({ to, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "text-white/80 hover:bg-gray-700/50 hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </li>
  )
}

const NavGroup = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <div className="px-3 py-2">
      <h3 className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">{title}</h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  )
}

const DashboardLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { data: managerData } = useGetManagerRestaurant()
  const { user, logout } = useAuth0()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {!sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(true)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-gray-800 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{managerData?.restaurant?.restaurantName || "Loading..."}</h1>
              <p className="text-xs text-gray-400">{managerData?.restaurant?.addressLine1 || "Loading..."}</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-4">
          <NavGroup title="Main Menu">
            <NavItem
              to="/manager/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={isActive("/manager/dashboard")}
            />
            {/* <NavItem to="/manager/orders" icon={ShoppingCart} label="Orders" isActive={isActive("/manager/orders")} /> */}
            <NavItem
              to="/manager/payment"
              icon={CreditCard}
              label="Payments"
              isActive={isActive("/manager/payment")}
            />
          </NavGroup>

          <NavGroup title="Restaurant">
            <NavItem
              to="/manager/restaurant"
              icon={Package}
              label="My Restaurant"
              isActive={isActive("/manager/restaurant")}
            />
          </NavGroup>

          <NavGroup title="Sales Staff">
            <NavItem 
              to="/manager/salesstaff" 
              icon={Calendar} 
              label="Manage Sales Staffs" 
              isActive={isActive("/manager/salesstaff")} 
            />
          </NavGroup>
        </div>

        {/* Sidebar footer - User profile */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || "Manager"} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name || "Restaurant Manager"}</p>
              <p className="truncate text-xs text-gray-400">{user?.email || "Loading..."}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm">
          <button onClick={toggleSidebar} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || "Manager"} 
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
