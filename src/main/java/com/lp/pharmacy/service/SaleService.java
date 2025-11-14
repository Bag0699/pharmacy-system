package com.lp.pharmacy.service;

import com.lp.pharmacy.model.dto.request.CreateSaleRequest;
import com.lp.pharmacy.model.dto.response.SaleDetailResponse;
import com.lp.pharmacy.model.dto.response.SaleResponse;

import java.util.List;

public interface SaleService {

  SaleResponse createSale(CreateSaleRequest request);

  List<SaleResponse> findAll();

  SaleResponse findById(Long id);

  List<SaleDetailResponse> findAllSaleDetailsBySaleId(Long saleId);
}
