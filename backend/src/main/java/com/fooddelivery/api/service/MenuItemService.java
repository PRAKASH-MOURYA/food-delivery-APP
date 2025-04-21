package com.fooddelivery.api.service;

import com.fooddelivery.api.exception.ResourceNotFoundException;
import com.fooddelivery.api.model.MenuItem;
import com.fooddelivery.api.model.Restaurant;
import com.fooddelivery.api.repository.MenuItemRepository;
import com.fooddelivery.api.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<MenuItem> getMenuItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> getMenuItemsByRestaurantAndCategory(Long restaurantId, String category) {
        return menuItemRepository.findByRestaurantIdAndCategory(restaurantId, category);
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        Restaurant restaurant = restaurantRepository.findById(menuItem.getRestaurant().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        
        menuItem.setRestaurant(restaurant);
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        MenuItem menuItem = getMenuItemById(id);
        
        menuItem.setName(menuItemDetails.getName());
        menuItem.setDescription(menuItemDetails.getDescription());
        menuItem.setPrice(menuItemDetails.getPrice());
        menuItem.setImage(menuItemDetails.getImage());
        menuItem.setCategory(menuItemDetails.getCategory());
        menuItem.setAvailable(menuItemDetails.getAvailable());
        
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long id) {
        MenuItem menuItem = getMenuItemById(id);
        menuItemRepository.delete(menuItem);
    }
}
