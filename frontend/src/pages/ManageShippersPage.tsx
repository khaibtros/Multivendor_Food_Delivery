"use client"

import { useState } from "react"
import { useGetManagerRestaurant } from "@/api/manager/ManagerApi"
import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

interface Shipper {
  _id: string
  email: string
  name: string
  role: string
}

const ManageShippersPage = () => {
  const { data: managerData } = useGetManagerRestaurant()
  const { getAccessTokenSilently } = useAuth0()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shippers, setShippers] = useState<Shipper[]>([])

  const handleAddShipper = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsLoading(true)
      const accessToken = await getAccessTokenSilently()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/manager/shippers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          restaurantId: managerData?.restaurant._id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to add shipper")
      }

      const newShipper = await response.json()
      setShippers([...shippers, newShipper])
      setEmail("")
      toast.success("Shipper added successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add shipper")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveShipper = async (shipperId: string) => {
    try {
      setIsLoading(true)
      const accessToken = await getAccessTokenSilently()
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/manager/shippers/${shipperId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to remove shipper")
      }

      setShippers(shippers.filter((shipper) => shipper._id !== shipperId))
      toast.success("Shipper removed successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove shipper")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Shippers</h1>
        <p className="text-muted-foreground">
          Add and manage shippers for your restaurant
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Shipper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddShipper} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter shipper's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm"
                required
              />
              <Button type="submit" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Add Shipper
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The shipper will use this email to log in to their dashboard.
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Shippers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippers.map((shipper) => (
                <TableRow key={shipper._id}>
                  <TableCell>{shipper.name}</TableCell>
                  <TableCell>{shipper.email}</TableCell>
                  <TableCell>{shipper.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveShipper(shipper._id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {shippers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No shippers added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ManageShippersPage