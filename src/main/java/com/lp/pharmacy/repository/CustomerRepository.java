package com.lp.pharmacy.repository;

import com.lp.pharmacy.model.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

  Optional<Customer> findByDni(String dni);
}
