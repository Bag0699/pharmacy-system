package com.lp.pharmacy.repository;

import com.lp.pharmacy.model.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

  List<Medicine> findByNameContainingIgnoreCase(String name);

  List<Medicine> findByStockLessThan(Integer stock);

  List<Medicine> findByExpirationDateBefore(LocalDate expirationDate);
}
