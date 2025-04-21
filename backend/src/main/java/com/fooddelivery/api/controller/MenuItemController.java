package com.fooddelivery.api.controller;

import com.fooddelivery.api.model.MenuItem;
import com.fooddelivery.api.payload.response.MessageResponse;
import com.fooddelivery.api.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/menu-items")
public class MenuItemController {
    @Autowired
    private MenuItemService menuItemService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        List<MenuItem> menuItems = menuItemService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/restaurant/{restaurantId}/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurantAndCategory(
            @PathVariable Long restaurantId, @PathVariable String category) {
        List<MenuItem> menuItems = menuItemService.getMenuItemsByRestaurantAndCategory(restaurantId, category);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        MenuItem menuItem = menuItemService.getMenuItemById(id);
        return ResponseEntity.ok(menuItem);
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem createdMenuItem = menuItemService.createMenuItem(menuItem);
        return ResponseEntity.ok(createdMenuItem);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        MenuItem updatedMenuItem = menuItemService.updateMenuItem(id, menuItem);
        return ResponseEntity.ok(updatedMenuItem);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RESTAURANT') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(new MessageResponse("Menu item deleted successfully"));
    }
}
