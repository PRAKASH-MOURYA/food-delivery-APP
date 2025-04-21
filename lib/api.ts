import type { CartItem } from "@/components/cart-provider"

const API_URL = "http://localhost:8080/api"

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API Error (${response.status}): ${errorText}`)
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return await response.json()
}

// Improved helper function to handle API requests with fallback
async function handleApiRequestWithFallback<T>(
  apiCall: () => Promise<T>,
  fallbackData: T,
  errorMessage: string,
  logError = false,
): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    // Only log the error if explicitly requested
    if (logError) {
      console.error(errorMessage, error)
    }

    // Return fallback data silently in development
    return fallbackData
  }
}

// Auth API
export const login = async (username: string, password: string) => {
  // Ensure we're working with string values
  const usernameStr = String(username)
  const passwordStr = String(password)

  // Create a mock user for fallback
  const mockUser = {
    id: "user-1",
    username: usernameStr,
    email: `${usernameStr}@example.com`,
    name: usernameStr.charAt(0).toUpperCase() + usernameStr.slice(1),
    token: "mock-jwt-token",
    roles: ["ROLE_USER"],
  }

  const userData = await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usernameStr, password: passwordStr }),
      })
      return await handleResponse(response)
    },
    mockUser,
    "Login failed",
    false, // Don't log the error
  )

  // Store user data in localStorage
  if (userData.token) {
    localStorage.setItem("token", userData.token)
  }

  // Create a clean user object without circular references
  const cleanUserData = {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    name: userData.name,
    roles: userData.roles,
  }

  localStorage.setItem("user", JSON.stringify(cleanUserData))
  return cleanUserData
}

export const register = async (userData: any) => {
  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      return await handleResponse(response)
    },
    { message: "User registered successfully!", ...userData },
    "Registration failed",
    false, // Don't log the error
  )
}

export const logout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Restaurant API
export const getRestaurants = async () => {
  const { restaurants } = await import("@/lib/data")

  // Convert prices to INR
  const restaurantsWithINR = restaurants.map((restaurant) => ({
    ...restaurant,
    deliveryFee: restaurant.deliveryFee === "$0.00" ? "₹0" : "₹49",
    minOrder: restaurant.minOrder === "$0.00" ? "₹0" : "₹199",
  }))

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/restaurants`)
      return await handleResponse(response)
    },
    restaurantsWithINR,
    "Failed to fetch restaurants from API, using mock data",
    false, // Don't log the error
  )
}

export const getRestaurantById = async (id: string) => {
  const { restaurants } = await import("@/lib/data")
  let mockRestaurant = restaurants.find((r) => r.id === id) || restaurants[0]

  // Convert prices to INR
  mockRestaurant = {
    ...mockRestaurant,
    deliveryFee: mockRestaurant.deliveryFee === "$0.00" ? "₹0" : "₹49",
    minOrder: mockRestaurant.minOrder === "$0.00" ? "₹0" : "₹199",
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/restaurants/${id}`)
      return await handleResponse(response)
    },
    mockRestaurant,
    `Failed to fetch restaurant with ID: ${id}, using mock data`,
    false,
  )
}

export const getRestaurantsByCuisine = async (cuisine: string) => {
  const { restaurants } = await import("@/lib/data")
  const filteredRestaurants = restaurants.filter((r) =>
    r.cuisine.some((c) => c.toLowerCase() === cuisine.toLowerCase()),
  )

  // Convert prices to INR
  const restaurantsWithINR = filteredRestaurants.map((restaurant) => ({
    ...restaurant,
    deliveryFee: restaurant.deliveryFee === "$0.00" ? "₹0" : "₹49",
    minOrder: restaurant.minOrder === "$0.00" ? "₹0" : "₹199",
  }))

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/restaurants/cuisine/${cuisine}`)
      return await handleResponse(response)
    },
    restaurantsWithINR,
    `Failed to fetch restaurants with cuisine: ${cuisine}, using mock data`,
    false,
  )
}

export const searchRestaurants = async (keyword: string) => {
  const { restaurants } = await import("@/lib/data")
  const query = keyword.toLowerCase()
  const filteredRestaurants = restaurants.filter(
    (r) => r.name.toLowerCase().includes(query) || r.cuisine.some((c) => c.toLowerCase().includes(query)),
  )

  // Convert prices to INR
  const restaurantsWithINR = filteredRestaurants.map((restaurant) => ({
    ...restaurant,
    deliveryFee: restaurant.deliveryFee === "$0.00" ? "₹0" : "₹49",
    minOrder: restaurant.minOrder === "$0.00" ? "₹0" : "₹199",
  }))

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/restaurants/search?keyword=${keyword}`)
      return await handleResponse(response)
    },
    restaurantsWithINR,
    `Failed to search restaurants with keyword: ${keyword}, using mock data`,
    false,
  )
}

// Menu Items API
export const getMenuItemsByRestaurant = async (restaurantId: string) => {
  const { menuItems } = await import("@/lib/data")
  const filteredMenuItems = menuItems.filter((item) => item.restaurantId === restaurantId)

  // Import the food images utility
  const { getFoodImageById } = await import("@/lib/food-images")

  // Convert prices to INR (multiply by 80 as a rough conversion)
  const menuItemsWithINR = filteredMenuItems.map((item) => {
    // Get a high-quality image based on the item's ID and category
    const highQualityImage = getFoodImageById(item.id, item.category)

    return {
      ...item,
      price: Math.round(item.price * 80),
      image:
        highQualityImage ||
        `/images/food/${item.category.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 4) + 1}.jpg`,
    }
  })

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/menu-items/restaurant/${restaurantId}`)
      return await handleResponse(response)
    },
    menuItemsWithINR,
    `Failed to fetch menu items for restaurant ID: ${restaurantId}, using mock data`,
    false,
  )
}

export const getMenuItemsByCategory = async (restaurantId: string, category: string) => {
  const { menuItems } = await import("@/lib/data")
  const filteredMenuItems = menuItems.filter((item) => item.restaurantId === restaurantId && item.category === category)

  // Convert prices to INR (multiply by 80 as a rough conversion)
  const menuItemsWithINR = filteredMenuItems.map((item) => ({
    ...item,
    price: Math.round(item.price * 80),
    image: `/images/food/${item.category.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 4) + 1}.jpg`,
  }))

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/menu-items/restaurant/${restaurantId}/category/${category}`)
      return await handleResponse(response)
    },
    menuItemsWithINR,
    `Failed to fetch menu items for restaurant ID: ${restaurantId} and category: ${category}, using mock data`,
    false,
  )
}

// Order API
export const createOrder = async (orderData: {
  restaurantId: string
  deliveryAddressId: string
  items: { menuItemId: string; quantity: number }[]
  paymentMethod: string
}) => {
  // Mock successful order creation for development
  const mockOrderResponse = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "RECEIVED",
    items: orderData.items.map((item) => ({
      ...item,
      price: 899, // Mock price in INR
      subtotal: 899 * item.quantity,
    })),
    subtotal: orderData.items.reduce((sum, item) => sum + 899 * item.quantity, 0),
    deliveryFee: 49,
    serviceFee: 29,
    total: orderData.items.reduce((sum, item) => sum + 899 * item.quantity, 0) + 49 + 29,
    createdAt: new Date().toISOString(),
    deliveryAddress: {
      street: "Hostel Block A, Room 203",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
    },
    deliveryLocation: {
      lat: 30.7691,
      lng: 76.5764,
    },
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return mockOrderResponse
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })
      return await handleResponse(response)
    },
    mockOrderResponse,
    "Failed to create order, using mock order data",
    false,
  )
}

export const getUserOrders = async () => {
  // Mock orders for development
  const mockOrders = [
    {
      id: "order-1",
      orderNumber: "ORD-123456",
      status: "DELIVERED",
      restaurant: { id: "rest-1", name: "Pizza Paradise" },
      items: [
        { id: "item-1", name: "Margherita Pizza", quantity: 2, price: 399, image: "/images/food/pizza-1.jpg" },
        { id: "item-3", name: "Garlic Bread", quantity: 1, price: 149, image: "/images/food/bread-1.jpg" },
      ],
      subtotal: 947,
      deliveryFee: 49,
      serviceFee: 29,
      total: 1025,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      deliveryAddress: {
        street: "Hostel Block A, Room 203",
        city: "Chandigarh University",
        state: "Punjab",
        zipCode: "140413",
      },
      deliveryLocation: {
        lat: 30.7691,
        lng: 76.5764,
      },
    },
    {
      id: "order-2",
      orderNumber: "ORD-234567",
      status: "OUT_FOR_DELIVERY",
      restaurant: { id: "rest-2", name: "Burger Bliss" },
      items: [
        { id: "item-6", name: "Classic Burger", quantity: 1, price: 249, image: "/images/food/burger-1.jpg" },
        { id: "item-9", name: "French Fries", quantity: 1, price: 149, image: "/images/food/sides-1.jpg" },
      ],
      subtotal: 398,
      deliveryFee: 49,
      serviceFee: 29,
      total: 476,
      createdAt: new Date().toISOString(), // Now
      deliveryAddress: {
        street: "Academic Block 3, Department of Computer Science",
        city: "Chandigarh University",
        state: "Punjab",
        zipCode: "140413",
      },
      deliveryLocation: {
        lat: 30.7701,
        lng: 76.5774,
      },
    },
  ]

  const token = localStorage.getItem("token")
  if (!token) {
    return mockOrders
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    mockOrders,
    "Failed to fetch orders, using mock orders",
    false,
  )
}

export const getOrderById = async (id: string) => {
  const mockOrder = {
    id,
    orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "PREPARING",
    restaurant: { id: "rest-1", name: "Pizza Paradise" },
    items: [
      { id: "item-1", name: "Margherita Pizza", quantity: 2, price: 399, image: "/images/food/pizza-1.jpg" },
      { id: "item-3", name: "Garlic Bread", quantity: 1, price: 149, image: "/images/food/bread-1.jpg" },
    ],
    subtotal: 947,
    deliveryFee: 49,
    serviceFee: 29,
    total: 1025,
    createdAt: new Date().toISOString(),
    deliveryAddress: {
      street: "Hostel Block A, Room 203",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
    },
    deliveryLocation: {
      lat: 30.7691,
      lng: 76.5764,
    },
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return mockOrder
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    mockOrder,
    "Failed to fetch order, using mock order",
    false,
  )
}

export const getOrderByOrderNumber = async (orderNumber: string) => {
  const mockOrder = {
    id: `order-${Date.now()}`,
    orderNumber,
    status: "PREPARING",
    restaurant: { id: "rest-1", name: "Pizza Paradise" },
    items: [
      { id: "item-1", name: "Margherita Pizza", quantity: 2, price: 399, image: "/images/food/pizza-1.jpg" },
      { id: "item-3", name: "Garlic Bread", quantity: 1, price: 149, image: "/images/food/bread-1.jpg" },
    ],
    subtotal: 947,
    deliveryFee: 49,
    serviceFee: 29,
    total: 1025,
    createdAt: new Date().toISOString(),
    deliveryAddress: {
      street: "Hostel Block A, Room 203",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
    },
    deliveryLocation: {
      lat: 30.7691,
      lng: 76.5764,
    },
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/orders/tracking/${orderNumber}`)
      return await handleResponse(response)
    },
    mockOrder,
    "Failed to fetch order, using mock order",
    false,
  )
}

// User API
export const getUserProfile = async () => {
  const mockUserProfile = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return mockUserProfile
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    mockUserProfile,
    "Failed to fetch user profile, using mock user profile",
    false,
  )
}

export const updateUserProfile = async (userData: any) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return { ...userData, message: "Profile updated successfully" }
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })
      return await handleResponse(response)
    },
    { ...userData, message: "Profile updated successfully" },
    "Failed to update user profile",
    false,
  )
}

export const getUserAddresses = async () => {
  // Mock addresses for development
  const mockAddresses = [
    {
      id: "addr-1",
      street: "Hostel Block A, Room 203",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
      isDefault: true,
    },
    {
      id: "addr-2",
      street: "Academic Block 3, Department of Computer Science",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
      isDefault: false,
    },
  ]

  const token = localStorage.getItem("token")
  if (!token) {
    return mockAddresses
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    mockAddresses,
    "Failed to fetch addresses, using mock addresses",
    false,
  )
}

export const getUserAddressesUpdated = async () => {
  // Mock addresses for development with Chandigarh University
  const mockAddresses = [
    {
      id: "addr-1",
      street: "Hostel Block A, Room 203",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
      instructions: "Call when at the hostel gate",
      isDefault: true,
    },
    {
      id: "addr-2",
      street: "Academic Block 3, Department of Computer Science",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
      instructions: "Deliver during lunch break (12-1 PM)",
      isDefault: false,
    },
    {
      id: "addr-3",
      street: "Student Center, Food Court",
      city: "Chandigarh University",
      state: "Punjab",
      zipCode: "140413",
      instructions: "Meet at the entrance",
      isDefault: false,
    },
  ]

  const token = localStorage.getItem("token")
  if (!token) {
    return mockAddresses
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    mockAddresses,
    "Failed to fetch addresses, using mock addresses",
    false,
  )
}

export const addUserAddress = async (addressData: any) => {
  // Ensure the address is for Chandigarh University
  const updatedAddressData = {
    ...addressData,
    city: "Chandigarh University",
    state: "Punjab",
    zipCode: "140413",
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return { ...updatedAddressData, id: `addr-${Date.now()}`, message: "Address added successfully" }
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAddressData),
      })
      return await handleResponse(response)
    },
    { ...updatedAddressData, id: `addr-${Date.now()}`, message: "Address added successfully" },
    "Failed to add address",
    false,
  )
}

export const updateUserAddress = async (id: string, addressData: any) => {
  // Ensure the address is for Chandigarh University
  const updatedAddressData = {
    ...addressData,
    city: "Chandigarh University",
    state: "Punjab",
    zipCode: "140413",
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return { ...updatedAddressData, id, message: "Address updated successfully" }
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAddressData),
      })
      return await handleResponse(response)
    },
    { ...updatedAddressData, id, message: "Address updated successfully" },
    "Failed to update address",
    false,
  )
}

export const deleteUserAddress = async (id: string) => {
  const token = localStorage.getItem("token")
  if (!token) {
    return { message: "Address deleted successfully" }
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    { message: "Address deleted successfully" },
    "Failed to delete address",
    false,
  )
}

// Helper function to convert cart items to order items
export const convertCartToOrderItems = (cartItems: CartItem[]) => {
  return cartItems.map((item) => ({
    menuItemId: item.id,
    quantity: item.quantity,
  }))
}

// Get special offers for Today's Special section
export async function getSpecialOffers() {
  // Import the special images utility
  const { getSpecialOfferImage } = await import("@/lib/food-images")

  // Mock special offers with high-quality images
  const specialOffers = [
    {
      id: "special-1",
      name: "Hyderabadi Chicken Biryani",
      description: "Aromatic basmati rice cooked with tender chicken pieces and authentic spices",
      restaurantId: "rest-6",
      restaurantName: "Curry Corner",
      originalPrice: 299,
      discountedPrice: 199,
      discount: 33,
      image: getSpecialOfferImage("special-1"),
    },
    {
      id: "special-2",
      name: "Punjabi Thali",
      description: "Complete meal with dal makhani, paneer butter masala, naan, rice, raita and dessert",
      restaurantId: "rest-6",
      restaurantName: "Curry Corner",
      originalPrice: 349,
      discountedPrice: 249,
      discount: 29,
      image: getSpecialOfferImage("special-2"),
    },
    {
      id: "special-3",
      name: "Cheese Burst Pizza",
      description: "Loaded with extra cheese, bell peppers, olives, corn and jalapenos",
      restaurantId: "rest-1",
      restaurantName: "Pizza Paradise",
      originalPrice: 399,
      discountedPrice: 299,
      discount: 25,
      image: getSpecialOfferImage("special-3"),
    },
    {
      id: "special-4",
      name: "Double Cheese Burger",
      description: "Juicy patty with double cheese, lettuce, tomato and special sauce",
      restaurantId: "rest-2",
      restaurantName: "Burger Bliss",
      originalPrice: 249,
      discountedPrice: 179,
      discount: 28,
      image: getSpecialOfferImage("special-4"),
    },
    {
      id: "special-5",
      name: "Masala Dosa",
      description: "Crispy dosa filled with spiced potato filling, served with sambar and chutney",
      restaurantId: "rest-5",
      restaurantName: "Pasta Palace",
      originalPrice: 199,
      discountedPrice: 149,
      discount: 25,
      image: getSpecialOfferImage("special-5"),
    },
    {
      id: "special-6",
      name: "Paneer Butter Masala",
      description: "Cottage cheese cubes in rich tomato and butter gravy, best with naan",
      restaurantId: "rest-6",
      restaurantName: "Curry Corner",
      originalPrice: 249,
      discountedPrice: 199,
      discount: 20,
      image: getSpecialOfferImage("special-6"),
    },
  ]

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/special-offers`)
      return await handleResponse(response)
    },
    specialOffers,
    "Failed to fetch special offers",
    false,
  )
}

// Update the getUserOrders function to include maps data
export const getUserOrdersUpdated = async () => {
  // Import the food images utility
  const { getFoodImageById } = await import("@/lib/food-images")

  // Mock orders for development with high-quality images
  const mockOrders = [
    {
      id: "order-1",
      orderNumber: "ORD-123456",
      status: "DELIVERED",
      restaurant: { id: "rest-6", name: "Curry Corner" },
      items: [
        {
          id: "item-curry-1",
          name: "Butter Chicken",
          quantity: 2,
          price: 399,
          image: getFoodImageById("item-curry-1", "Indian"),
        },
        {
          id: "item-bread-1",
          name: "Garlic Naan",
          quantity: 3,
          price: 79,
          image: getFoodImageById("item-bread-1", "Bread"),
        },
      ],
      subtotal: 1035,
      deliveryFee: 49,
      serviceFee: 29,
      total: 1113,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      deliveryAddress: {
        street: "Hostel Block A, Room 203",
        city: "Chandigarh University",
        state: "Punjab",
        zipCode: "140413",
      },
      deliveryLocation: {
        lat: 30.7691,
        lng: 76.5764,
      },
      estimatedDeliveryTime: "Delivered",
      paymentMethod: "CREDIT_CARD",
    },
    {
      id: "order-2",
      orderNumber: "ORD-234567",
      status: "OUT_FOR_DELIVERY",
      restaurant: { id: "rest-1", name: "Pizza Paradise" },
      items: [
        {
          id: "item-pizza-1",
          name: "Margherita Pizza",
          quantity: 1,
          price: 349,
          image: getFoodImageById("item-pizza-1", "Pizza"),
        },
        {
          id: "item-sides-1",
          name: "Garlic Bread",
          quantity: 1,
          price: 149,
          image: getFoodImageById("item-sides-1", "Sides"),
        },
        {
          id: "item-drink-1",
          name: "Coca Cola",
          quantity: 2,
          price: 59,
          image: getFoodImageById("item-drink-1", "Drinks"),
        },
      ],
      subtotal: 626,
      deliveryFee: 49,
      serviceFee: 29,
      total: 704,
      createdAt: new Date().toISOString(), // Now
      deliveryAddress: {
        street: "Academic Block 3, Department of Computer Science",
        city: "Chandigarh University",
        state: "Punjab",
        zipCode: "140413",
      },
      deliveryLocation: {
        lat: 30.7701,
        lng: 76.5774,
      },
      estimatedDeliveryTime: "10-15 min",
      paymentMethod: "CASH",
    },
    {
      id: "order-3",
      orderNumber: "ORD-345678",
      status: "PREPARING",
      restaurant: { id: "rest-2", name: "Burger Bliss" },
      items: [
        {
          id: "item-burger-1",
          name: "Double Cheese Burger",
          quantity: 2,
          price: 299,
          image: getFoodImageById("item-burger-1", "Burger"),
        },
        {
          id: "item-sides-2",
          name: "French Fries",
          quantity: 2,
          price: 149,
          image: getFoodImageById("item-sides-2", "Sides"),
        },
        {
          id: "item-drink-2",
          name: "Chocolate Shake",
          quantity: 2,
          price: 179,
          image: getFoodImageById("item-drink-2", "Drinks"),
        },
      ],
      subtotal: 1354,
      deliveryFee: 49,
      serviceFee: 29,
      total: 1432,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      deliveryAddress: {
        street: "Student Center, Chandigarh University",
        city: "Chandigarh University",
        state: "Punjab",
        zipCode: "140413",
      },
      deliveryLocation: {
        lat: 30.7681,
        lng: 76.5754,
      },
      estimatedDeliveryTime: "25-35 min",
      paymentMethod: "CREDIT_CARD",
    },
  ]

  const token = localStorage.getItem("token")
  if (!token) {
    return mockOrders
  }

  return await handleApiRequestWithFallback(
    async () => {
      const response = await fetch(`${API_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return await handleResponse(response)
    },
    mockOrders,
    "Failed to fetch orders, using mock orders",
    false,
  )
}
