package com.lp.pharmacy.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class SaleResponse {

  private Long id;
  private PharmacistResponse pharmacist;
  private CustomerResponse customer;
  private String saleDate;
  private BigDecimal totalAmount;
}
