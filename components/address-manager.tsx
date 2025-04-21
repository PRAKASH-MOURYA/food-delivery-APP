"use client"

import type React from "react"

import { useState } from "react"
import { Home, Plus, Edit, Trash2, Check, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { addUserAddress, updateUserAddress, deleteUserAddress } from "@/lib/api"

interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  instructions?: string
  isDefault: boolean
}

interface AddressManagerProps {
  addresses: Address[]
}

export default function AddressManager({ addresses: initialAddresses }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    instructions: "",
    isDefault: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDefaultChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, isDefault: value }))
  }

  const resetForm = () => {
    setFormData({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      instructions: "",
      isDefault: false,
    })
    setError(null)
  }

  const handleAddAddress = async () => {
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const newAddress = await addUserAddress(formData)

      // Update local state
      setAddresses((prev) => {
        // If the new address is default, update other addresses
        if (newAddress.isDefault) {
          return [...prev.map((addr) => ({ ...addr, isDefault: false })), newAddress]
        }
        return [...prev, newAddress]
      })

      setIsAddDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error adding address:", err)
      setError("Failed to add address. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditAddress = async () => {
    if (!currentAddress) return

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const updatedAddress = await updateUserAddress(currentAddress.id, formData)

      // Update local state
      setAddresses((prev) => {
        // If the updated address is default, update other addresses
        if (updatedAddress.isDefault) {
          return prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : { ...addr, isDefault: false }))
        }
        return prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
      })

      setIsEditDialogOpen(false)
      setCurrentAddress(null)
      resetForm()
    } catch (err) {
      console.error("Error updating address:", err)
      setError("Failed to update address. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async () => {
    if (!currentAddress) return

    try {
      setIsLoading(true)
      setError(null)

      await deleteUserAddress(currentAddress.id)

      // Update local state
      setAddresses((prev) => prev.filter((addr) => addr.id !== currentAddress.id))

      setIsDeleteDialogOpen(false)
      setCurrentAddress(null)
    } catch (err) {
      console.error("Error deleting address:", err)
      setError("Failed to delete address. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (address: Address) => {
    setCurrentAddress(address)
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      instructions: address.instructions || "",
      isDefault: address.isDefault,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (address: Address) => {
    setCurrentAddress(address)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>Add a new delivery address to your account</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input id="street" name="street" value={formData.street} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="E.g., Ring the doorbell, leave at the door, etc."
                />
              </div>

              <RadioGroup
                value={formData.isDefault ? "default" : "regular"}
                onValueChange={(value) => handleDefaultChange(value === "default")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Regular address</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default">Set as default address</Label>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAddress} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You don't have any saved addresses yet.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    <CardTitle className="text-lg">{address.isDefault ? "Default Address" : "Address"}</CardTitle>
                  </div>
                  {address.isDefault && (
                    <div className="flex items-center text-xs font-medium text-primary">
                      <Check className="h-3 w-3 mr-1" />
                      Default
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.instructions && <p className="mt-2 text-muted-foreground text-xs">{address.instructions}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-0">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(address)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteDialog(address)}
                  disabled={address.isDefault}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update your delivery address details</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-street">Street Address *</Label>
              <Input id="edit-street" name="street" value={formData.street} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City *</Label>
                <Input id="edit-city" name="city" value={formData.city} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-state">State *</Label>
                <Input id="edit-state" name="state" value={formData.state} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-zipCode">ZIP Code *</Label>
              <Input id="edit-zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="edit-instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="E.g., Ring the doorbell, leave at the door, etc."
              />
            </div>

            <RadioGroup
              value={formData.isDefault ? "default" : "regular"}
              onValueChange={(value) => handleDefaultChange(value === "default")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="edit-regular" />
                <Label htmlFor="edit-regular">Regular address</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="edit-default" />
                <Label htmlFor="edit-default">Set as default address</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAddress} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAddress} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
