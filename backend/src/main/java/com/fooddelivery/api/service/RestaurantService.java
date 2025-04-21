package com.fooddelivery.api.service;

import com.fooddelivery.api.exception.ResourceNotFoundException;
import com.fooddelivery.api.model.Restaurant;
import com.fooddelivery.api.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    public List<Restaurant> getRestaurantsByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineContaining(cuisine);
    }

    public List<Restaurant> searchRestaurants(String keyword) {
        return restaurantRepository.searchByNameOrCuisine(keyword);
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurantDetails) {
        Restaurant restaurant = getRestaurantById(id);
        
        restaurant.setName(restaurantDetails.getName());
        restaurant.setDescription(restaurantDetails.getDescription());
        restaurant.setImage(restaurantDetails.getImage());
        restaurant.setCuisine(restaurantDetails.getCuisine());
        restaurant.setRating(restaurantDetails.getRating());
        restaurant.setDeliveryTime(restaurantDetails.getDeliveryTime());
        restaurant.setDeliveryFee(restaurantDetails.getDeliveryFee());
        restaurant.setMinOrder(restaurantDetails.getMinOrder());
        
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurantRepository.delete(restaurant);
    }
}
