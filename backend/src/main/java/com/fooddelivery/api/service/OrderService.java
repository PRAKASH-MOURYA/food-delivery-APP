package com.fooddelivery.api.service;

import com.fooddelivery.api.exception.ResourceNotFoundException;
import com.fooddelivery.api.model.*;
import com.fooddelivery.api.payload.request.OrderItemRequest;
import com.fooddelivery.api.payload.request.OrderRequest;
import com.fooddelivery.api.repository.MenuItemRepository;
import com.fooddelivery.api.repository.OrderRepository;
import com.fooddelivery.api.repository.RestaurantRepository;
import com.fooddelivery.api.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private UserService userService;

    public List<Order> getCurrentUserOrders() {
        User currentUser = userService.getCurrentUser();
        return orderRepository.findByUserId(currentUser.getId());
    }

    public List<Order> getRestaurantOrders(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        User currentUser = userService.getCurrentUser();
        
        Restaurant restaurant = restaurantRepository.findById(orderRequest.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        
        Address deliveryAddress = userService.getUserAddressById(orderRequest.getDeliveryAddressId());
        
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.RECEIVED);
        order.setUser(currentUser);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(deliveryAddress);
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentStatus("PAID");
        order.setEstimatedDeliveryTime(30);
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setName(menuItem.getName());
            orderItem.setPrice(menuItem.getPrice());
            orderItem.setQuantity(itemRequest.getQuantity());
            
            BigDecimal itemSubtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            orderItem.setSubtotal(itemSubtotal);
            
            orderItems.add(orderItem);
            subtotal = subtotal.add(itemSubtotal);
        }
        
        order.setItems(orderItems);
        order.setSubtotal(subtotal);
        order.setDeliveryFee(restaurant.getDeliveryFee());
        order.setServiceFee(new BigDecimal("1.99"));
        order.setTotal(subtotal.add(restaurant.getDeliveryFee()).add(new BigDecimal("1.99")));
        
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, OrderStatus status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        
        if (status == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }
    
    private String generateOrderNumber() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return "ORD-" + number;
    }
}
