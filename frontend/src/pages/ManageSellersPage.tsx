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

interface Seller {
  _id: string
  email: string
  name: string
  role: string
}

const ManageSellersPage = () => {
  const { data: managerData } = useGetManagerRestaurant()
  const { getAccessTokenSilently } = useAuth0()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sellers, setSellers] = useState<Seller[]>([])

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsLoading(true)
      const accessToken = await getAccessTokenSilently()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/manager/sellers`, {
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
        throw new Error(error.message || "Failed to add seller")
      }

      const newSeller = await response.json()
      setSellers([...sellers, newSeller])
      setEmail("")
      toast.success("Seller added successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add seller")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveSeller = async (sellerId: string) => {
    try {
      setIsLoading(true)
      const accessToken = await getAccessTokenSilently()
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/manager/sellers/${sellerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to remove seller")
      }

      setSellers(sellers.filter((seller) => seller._id !== sellerId))
      toast.success("Seller removed successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove seller")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Sellers</h1>
        <p className="text-muted-foreground">
          Add and manage sellers for your restaurant
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Seller</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSeller} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter seller's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm"
                required
              />
              <Button type="submit" disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Add Seller
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The seller will use this email to log in to their dashboard.
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Sellers</CardTitle>
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
              {sellers.map((seller) => (
                <TableRow key={seller._id}>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSeller(seller._id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {sellers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No sellers added yet
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

export default ManageSellersPage 