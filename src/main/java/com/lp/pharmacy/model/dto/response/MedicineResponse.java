package com.lp.pharmacy.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class MedicineResponse {

  private Long id;
  private String name;
  private BigDecimal price;
  private String expirationDate;
}
