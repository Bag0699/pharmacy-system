package com.lp.pharmacy.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class CreateMedicineRequest {

  @NotBlank(message = "Name is required")
  private String name;

  @NotNull(message = "Price is required")
  private BigDecimal price;

  @NotNull(message = "Stock is required")
  private Integer stock;

  @NotNull(message = "Expiration date is required")
  private LocalDate expirationDate;
}
