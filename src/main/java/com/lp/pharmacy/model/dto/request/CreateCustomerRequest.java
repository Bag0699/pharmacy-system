package com.lp.pharmacy.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateCustomerRequest {

  @NotBlank(message = "Name is required")
  private String firstName;

  @NotBlank(message = "Last name is required")
  private String lastName;

  @NotBlank(message = "DNI is required")
  private String dni;
}
