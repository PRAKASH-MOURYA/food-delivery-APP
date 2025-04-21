package com.fooddelivery.api.service;

import com.fooddelivery.api.exception.ResourceNotFoundException;
import com.fooddelivery.api.model.Address;
import com.fooddelivery.api.model.User;
import com.fooddelivery.api.repository.AddressRepository;
import com.fooddelivery.api.repository.UserRepository;
import com.fooddelivery.api.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AddressRepository addressRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User updateCurrentUser(User userDetails) {
        User user = getCurrentUser();
        
        user.setName(userDetails.getName());
        user.setPhone(userDetails.getPhone());
        
        return userRepository.save(user);
    }

    public List<Address> getCurrentUserAddresses() {
        User currentUser = getCurrentUser();
        return addressRepository.findByUserId(currentUser.getId());
    }

    public Address getUserAddressById(Long id) {
        User currentUser = getCurrentUser();
        
        return addressRepository.findById(id)
                .filter(address -> address.getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or does not belong to current user"));
    }

    public Address addUserAddress(Address address) {
        User currentUser = getCurrentUser();
        address.setUser(currentUser);
        
        if (address.getIsDefault()) {
            // If this address is set as default, unset any existing default address
            addressRepository.findByUserIdAndIsDefaultTrue(currentUser.getId())
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setIsDefault(false);
                        addressRepository.save(defaultAddress);
                    });
        }
        
        return addressRepository.save(address);
    }

    public Address updateUserAddress(Long id, Address addressDetails) {
        Address address = getUserAddressById(id);
        
        address.setStreet(addressDetails.getStreet());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setZipCode(addressDetails.getZipCode());
        address.setInstructions(addressDetails.getInstructions());
        
        if (addressDetails.getIsDefault() && !address.getIsDefault()) {
            // If this address is being set as default, unset any existing default address
            User currentUser = getCurrentUser();
            addressRepository.findByUserIdAndIsDefaultTrue(currentUser.getId())
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setIsDefault(false);
                        addressRepository.save(defaultAddress);
                    });
            
            address.setIsDefault(true);
        }
        
        return addressRepository.save(address);
    }

    public void deleteUserAddress(Long id) {
        Address address = getUserAddressById(id);
        addressRepository.delete(address);
    }
}
