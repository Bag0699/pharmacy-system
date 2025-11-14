package com.lp.pharmacy.model.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PharmacistResponse {

  private Long id;
  private String firstName;
  private String lastName;
  private String username;
}
