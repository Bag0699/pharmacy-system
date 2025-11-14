package com.lp.pharmacy.service;

import com.lp.pharmacy.exception.CustomerNotFoundException;
import com.lp.pharmacy.mapper.CustomerMapper;
import com.lp.pharmacy.model.dto.request.CreateCustomerRequest;
import com.lp.pharmacy.model.dto.response.CustomerResponse;
import com.lp.pharmacy.model.entity.Customer;
import com.lp.pharmacy.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

  private final CustomerRepository customerRepository;
  private final CustomerMapper customerMapper;

  @Override
  public List<CustomerResponse> findAll() {
    return customerRepository.findAll().stream().map(customerMapper::toCustomerResponse).toList();
  }

  @Override
  public CustomerResponse findById(Long id) {
    return customerRepository
        .findById(id)
        .map(customerMapper::toCustomerResponse)
        .orElseThrow(CustomerNotFoundException::new);
  }

  @Override
  public CustomerResponse findByDni(String dni) {
    return customerRepository
        .findByDni(dni)
        .map(customerMapper::toCustomerResponse)
        .orElseThrow(CustomerNotFoundException::new);
  }

  @Override
  public CustomerResponse save(CreateCustomerRequest request) {
    Customer customer = customerMapper.toCustomer(request);
    return customerMapper.toCustomerResponse(customerRepository.save(customer));
  }

  @Override
  public CustomerResponse update(Long id, CreateCustomerRequest request) {
    return customerRepository
        .findById(id)
        .map(
            customer -> {
              customer.setFirstName(request.getFirstName());
              customer.setLastName(request.getLastName());
              customer.setDni(request.getDni());
              return customerRepository.save(customer);
            })
        .map(customerMapper::toCustomerResponse)
        .orElseThrow(CustomerNotFoundException::new);
  }

  @Override
  public void deleteById(Long id) {
    if (!customerRepository.existsById(id)) {
      throw new CustomerNotFoundException();
    }
    customerRepository.deleteById(id);
  }
}
