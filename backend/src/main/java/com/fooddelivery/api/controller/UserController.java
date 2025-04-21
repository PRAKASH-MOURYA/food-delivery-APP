package com.fooddelivery.api.controller;

import com.fooddelivery.api.model.Address;
import com.fooddelivery.api.model.User;
import com.fooddelivery.api.payload.response.MessageResponse;
import com.fooddelivery.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('RESTAURANT') or hasRole('ADMIN')")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('RESTAURANT') or hasRole('ADMIN')")
    public ResponseEntity<User> updateCurrentUser(@RequestBody User user) {
        User updatedUser = userService.updateCurrentUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/addresses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Address>> getUserAddresses() {
        List<Address> addresses = userService.getCurrentUserAddresses();
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/addresses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Address> addUserAddress(@RequestBody Address address) {
        Address savedAddress = userService.addUserAddress(address);
        return ResponseEntity.ok(savedAddress);
    }

    @PutMapping("/addresses/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Address> updateUserAddress(@PathVariable Long id, @RequestBody Address address) {
        Address updatedAddress = userService.updateUserAddress(id, address);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/addresses/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteUserAddress(@PathVariable Long id) {
        userService.deleteUserAddress(id);
        return ResponseEntity.ok(new MessageResponse("Address deleted successfully"));
    }
}
