package com.lp.pharmacy.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreatePharmacistRequest {

  @NotBlank(message = "Name is required")
  private String firstName;

  @NotBlank(message = "Last name is required")
  private String lastName;

  @NotBlank(message = "Username is required")
  private String username;

  @NotBlank(message = "Password is required")
  private String password;
}
