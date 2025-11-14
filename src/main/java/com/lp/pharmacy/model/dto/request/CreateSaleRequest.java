package com.lp.pharmacy.model.dto.request;

import com.lp.pharmacy.model.dto.response.SaleDetailRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CreateSaleRequest {

  @NotNull(message = "Medicine Id is required")
  private Long pharmacistId;

  @NotNull(message = "Customer Id is required")
  private Long customerId;

  @Valid
  @NotEmpty(message = "Sale details are required")
  private List<SaleDetailRequest> saleDetails;
}
