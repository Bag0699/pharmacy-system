package com.lp.pharmacy.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {

  private Long id;
  private String firstName;
  private String lastName;
  private String dni;
}
