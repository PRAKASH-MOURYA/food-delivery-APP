package com.fooddelivery.api.payload.request;

import com.fooddelivery.api.model.PaymentMethod;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Long deliveryAddressId;
    private List<OrderItemRequest> items;
    private PaymentMethod paymentMethod;
}
