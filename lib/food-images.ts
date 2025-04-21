// High-quality food images for different categories
const foodImages = {
  // Pizza category
  pizza: [
    "/images/food/pizza-1.jpg",
    "/images/food/pizza-2.jpg",
    "/images/food/pizza-3.jpg",
    "/images/food/pizza-4.jpg",
  ],

  // Burger category
  burger: [
    "/images/food/burger-1.jpg",
    "/images/food/burger-2.jpg",
    "/images/food/burger-3.jpg",
    "/images/food/burger-4.jpg",
  ],

  // Indian food category
  indian: [
    "/images/food/indian-1.jpg",
    "/images/food/indian-2.jpg",
    "/images/food/indian-3.jpg",
    "/images/food/indian-4.jpg",
  ],

  // Sushi category
  sushi: [
    "/images/food/sushi-1.jpg",
    "/images/food/sushi-2.jpg",
    "/images/food/sushi-3.jpg",
    "/images/food/sushi-4.jpg",
  ],

  // Desserts category
  desserts: [
    "/images/food/dessert-1.jpg",
    "/images/food/dessert-2.jpg",
    "/images/food/dessert-3.jpg",
    "/images/food/dessert-4.jpg",
  ],

  // Drinks category
  drinks: [
    "/images/food/drink-1.jpg",
    "/images/food/drink-2.jpg",
    "/images/food/drink-3.jpg",
    "/images/food/drink-4.jpg",
  ],

  // Sides category
  sides: [
    "/images/food/sides-1.jpg",
    "/images/food/sides-2.jpg",
    "/images/food/sides-3.jpg",
    "/images/food/sides-4.jpg",
  ],
}

// Specific food items with their images
const specificFoodImages: Record<string, string> = {
  "item-1": "/images/food/margherita-pizza.jpg",
  "item-2": "/images/food/pepperoni-pizza.jpg",
  "item-3": "/images/food/garlic-bread.jpg",
  "item-4": "/images/food/caesar-salad.jpg",
  "item-5": "/images/food/tiramisu.jpg",
  "item-6": "/images/food/classic-burger.jpg",
  "item-7": "/images/food/cheeseburger.jpg",
  "item-8": "/images/food/bacon-burger.jpg",
  "item-9": "/images/food/french-fries.jpg",
  "item-10": "/images/food/milkshake.jpg",
  "item-11": "/images/food/california-roll.jpg",
  "item-12": "/images/food/salmon-nigiri.jpg",
  "item-13": "/images/food/spicy-tuna-roll.jpg",
  "item-14": "/images/food/miso-soup.jpg",
  "item-15": "/images/food/edamame.jpg",
}

// Restaurant images
const restaurantImages = {
  "rest-1": [
    "/images/restaurants/pizza-restaurant-1.jpg",
    "/images/restaurants/pizza-restaurant-2.jpg",
    "/images/restaurants/pizza-restaurant-3.jpg",
    "/images/restaurants/pizza-restaurant-4.jpg",
  ],
  "rest-2": [
    "/images/restaurants/burger-restaurant-1.jpg",
    "/images/restaurants/burger-restaurant-2.jpg",
    "/images/restaurants/burger-restaurant-3.jpg",
    "/images/restaurants/burger-restaurant-4.jpg",
  ],
  "rest-3": [
    "/images/restaurants/sushi-restaurant-1.jpg",
    "/images/restaurants/sushi-restaurant-2.jpg",
    "/images/restaurants/sushi-restaurant-3.jpg",
    "/images/restaurants/sushi-restaurant-4.jpg",
  ],
  "rest-4": [
    "/images/restaurants/taco-restaurant-1.jpg",
    "/images/restaurants/taco-restaurant-2.jpg",
    "/images/restaurants/taco-restaurant-3.jpg",
    "/images/restaurants/taco-restaurant-4.jpg",
  ],
  "rest-5": [
    "/images/restaurants/pasta-restaurant-1.jpg",
    "/images/restaurants/pasta-restaurant-2.jpg",
    "/images/restaurants/pasta-restaurant-3.jpg",
    "/images/restaurants/pasta-restaurant-4.jpg",
  ],
  "rest-6": [
    "/images/restaurants/curry-restaurant-1.jpg",
    "/images/restaurants/curry-restaurant-2.jpg",
    "/images/restaurants/curry-restaurant-3.jpg",
    "/images/restaurants/curry-restaurant-4.jpg",
  ],
  "rest-7": [
    "/images/restaurants/noodle-restaurant-1.jpg",
    "/images/restaurants/noodle-restaurant-2.jpg",
    "/images/restaurants/noodle-restaurant-3.jpg",
    "/images/restaurants/noodle-restaurant-4.jpg",
  ],
  "rest-8": [
    "/images/restaurants/salad-restaurant-1.jpg",
    "/images/restaurants/salad-restaurant-2.jpg",
    "/images/restaurants/salad-restaurant-3.jpg",
    "/images/restaurants/salad-restaurant-4.jpg",
  ],
}

// Restaurant cover images (for cards and featured sections)
const restaurantCoverImages: Record<string, string> = {
  "rest-1": "/images/restaurants/pizza-restaurant-cover.jpg",
  "rest-2": "/images/restaurants/burger-restaurant-cover.jpg",
  "rest-3": "/images/restaurants/sushi-restaurant-cover.jpg",
  "rest-4": "/images/restaurants/taco-restaurant-cover.jpg",
  "rest-5": "/images/restaurants/pasta-restaurant-cover.jpg",
  "rest-6": "/images/restaurants/curry-restaurant-cover.jpg",
  "rest-7": "/images/restaurants/noodle-restaurant-cover.jpg",
  "rest-8": "/images/restaurants/salad-restaurant-cover.jpg",
}

// Special offers images
const specialOfferImages: Record<string, string> = {
  "special-1": "/images/food/special-biryani.jpg",
  "special-2": "/images/food/special-thali.jpg",
  "special-3": "/images/food/special-pizza.jpg",
  "special-4": "/images/food/special-burger.jpg",
  "special-5": "/images/food/special-dosa.jpg",
  "special-6": "/images/food/special-paneer.jpg",
}

/**
 * Get a food image based on the item ID and category
 * @param id The food item ID
 * @param category The food category
 * @returns The image URL
 */
export function getFoodImageById(id: string, category?: string): string {
  // First check if we have a specific image for this item
  if (specificFoodImages[id]) {
    return specificFoodImages[id]
  }

  // If not, get a random image from the category
  if (category) {
    const normalizedCategory = category.toLowerCase()

    // Map the category to our image categories
    let imageCategory: keyof typeof foodImages = "sides" // default

    if (normalizedCategory.includes("pizza")) {
      imageCategory = "pizza"
    } else if (normalizedCategory.includes("burger")) {
      imageCategory = "burger"
    } else if (
      normalizedCategory.includes("indian") ||
      normalizedCategory.includes("curry") ||
      normalizedCategory.includes("biryani") ||
      normalizedCategory.includes("paneer")
    ) {
      imageCategory = "indian"
    } else if (
      normalizedCategory.includes("sushi") ||
      normalizedCategory.includes("roll") ||
      normalizedCategory.includes("nigiri")
    ) {
      imageCategory = "sushi"
    } else if (
      normalizedCategory.includes("dessert") ||
      normalizedCategory.includes("sweet") ||
      normalizedCategory.includes("cake")
    ) {
      imageCategory = "desserts"
    } else if (
      normalizedCategory.includes("drink") ||
      normalizedCategory.includes("beverage") ||
      normalizedCategory.includes("shake")
    ) {
      imageCategory = "drinks"
    }

    // Get a random image from the category
    const images = foodImages[imageCategory]
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
  }

  // If no category, return a random food image
  const allCategories = Object.keys(foodImages) as Array<keyof typeof foodImages>
  const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)]
  const images = foodImages[randomCategory]
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

/**
 * Get restaurant gallery images
 * @param restaurantId The restaurant ID
 * @returns Array of image URLs
 */
export function getRestaurantImages(restaurantId: string): string[] {
  if (restaurantImages[restaurantId as keyof typeof restaurantImages]) {
    return restaurantImages[restaurantId as keyof typeof restaurantImages]
  }

  // Default images if specific restaurant images not found
  return [
    "/placeholder.svg?height=400&width=600&text=Restaurant+Gallery",
    "/placeholder.svg?height=400&width=600&text=Restaurant+Interior",
    "/placeholder.svg?height=400&width=600&text=Restaurant+Food",
  ]
}

/**
 * Get a restaurant cover image for cards and featured sections
 * @param restaurantId The restaurant ID
 * @returns The image URL
 */
export function getRestaurantCoverImage(restaurantId: string): string {
  if (restaurantCoverImages[restaurantId]) {
    return restaurantCoverImages[restaurantId]
  }

  // If no specific cover image, use the first gallery image
  const galleryImages = getRestaurantImages(restaurantId)
  if (galleryImages.length > 0 && !galleryImages[0].includes("placeholder")) {
    return galleryImages[0]
  }

  // Default placeholder if no images found
  return `/placeholder.svg?height=400&width=600&text=Restaurant`
}

/**
 * Get a special offer image
 * @param offerId The special offer ID
 * @returns The image URL
 */
export function getSpecialOfferImage(offerId: string): string {
  if (specialOfferImages[offerId]) {
    return specialOfferImages[offerId]
  }

  // Default placeholder if no image found
  return `/placeholder.svg?height=300&width=400&text=Special+Offer`
}
