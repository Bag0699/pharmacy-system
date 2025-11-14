package com.lp.pharmacy.mapper;

import com.lp.pharmacy.model.dto.request.CreateCustomerRequest;
import com.lp.pharmacy.model.dto.response.CustomerResponse;
import com.lp.pharmacy.model.entity.Customer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

  CustomerResponse toCustomerResponse(Customer customer);

  Customer toCustomer(CreateCustomerRequest request);
}
