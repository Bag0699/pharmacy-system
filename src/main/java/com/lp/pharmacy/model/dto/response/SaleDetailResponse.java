package com.lp.pharmacy.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class SaleDetailResponse {

    private Long id;
    private MedicineResponse medicine;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;
    private BigDecimal totalAmount;
}
