package com.lp.pharmacy.repository;

import com.lp.pharmacy.model.entity.Sale;
import com.lp.pharmacy.model.entity.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {

  List<SaleDetail> findBySale_Id(Long saleId);

    Long sale(Sale sale);
}
