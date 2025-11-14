package com.lp.pharmacy.util;

import lombok.Getter;

@Getter
public enum ErrorCatalog {
  CUSTOMER_NOT_FOUND("ERR_CTR_001", "Customer not found"),
  INVALID_CUSTOMER("ERR_CTR_002", "Customer parameters is invalid"),

  MEDICINE_NOT_FOUND("ERR_MED_001", "Medicine not found"),
  INVALID_MEDICINE("ERR_MED_002", "Medicine parameters is invalid"),

  PHARMACIST_NOT_FOUND("ERR_PHA_001", "Pharmacist not found"),
  INVALID_PHARMACIST("ERR_PHA_002", "Pharmacist parameters is invalid"),

  SALE_NOT_FOUND("ERR_SAL_001", "Sale not found"),
  INVALID_SALE("ERR_SAL_002", "Sale parameters is invalid"),

  SALE_DETAIL_NOT_FOUND("ERR_SDT_001", "Sale detail not found"),
  INVALID_SALE_DETAIL("ERR_SDT_002", "Sale detail parameters is invalid"),

  GENERIC_ERROR("ERR_GEN_001", "Generic error"),
  VALIDATION_ERROR("ERR_GEN_002", "Validation error");

  private final String code;
  private final String message;

  ErrorCatalog(String code, String message) {
    this.code = code;
    this.message = message;
  }
}
