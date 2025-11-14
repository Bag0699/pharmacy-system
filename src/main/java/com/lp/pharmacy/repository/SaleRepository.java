package com.lp.pharmacy.repository;

import com.lp.pharmacy.model.dto.response.SaleResponse;
import com.lp.pharmacy.model.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
  List<SaleResponse> findBySaleDateBetween(
      LocalDateTime saleDateAfter, LocalDateTime saleDateBefore);
}
