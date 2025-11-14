package com.lp.pharmacy.model.dto.response;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SaleDetailRequest {

  @NotNull(message = "Medicine Id is required")
  private Long medicineId;

  @NotNull(message = "Quantity is required")
  private Integer quantity;
}
