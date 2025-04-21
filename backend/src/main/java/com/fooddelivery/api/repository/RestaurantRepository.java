package com.fooddelivery.api.repository;

import com.fooddelivery.api.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCuisineContaining(String cuisine);
    
    @Query("SELECT r FROM Restaurant r WHERE r.name LIKE %?1% OR ?1 MEMBER OF r.cuisine")
    List<Restaurant> searchByNameOrCuisine(String keyword);
    
    List<Restaurant> findByOwnerId(Long ownerId);
}
