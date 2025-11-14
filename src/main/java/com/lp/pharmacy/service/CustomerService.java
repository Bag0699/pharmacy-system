package com.lp.pharmacy.service;

import com.lp.pharmacy.model.dto.request.CreateCustomerRequest;
import com.lp.pharmacy.model.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {

  List<CustomerResponse> findAll();

  CustomerResponse findById(Long id);

  CustomerResponse findByDni(String dni);

  CustomerResponse save(CreateCustomerRequest request);

  CustomerResponse update(Long id, CreateCustomerRequest request);

  void deleteById(Long id);
}
