package com.fooddelivery.api.repository;

import com.fooddelivery.api.model.Order;
import com.fooddelivery.api.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    List<Order> findByRestaurantIdAndStatus(Long restaurantId, OrderStatus status);
    Optional<Order> findByOrderNumber(String orderNumber);
}
