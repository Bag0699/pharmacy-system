package com.lp.pharmacy.service;

import com.lp.pharmacy.model.dto.request.CreateMedicineRequest;
import com.lp.pharmacy.model.dto.response.MedicineResponse;

import java.util.List;

public interface MedicineService {

  List<MedicineResponse> findAll();

  MedicineResponse findById(Long id);

  MedicineResponse save(CreateMedicineRequest request);

  MedicineResponse update(Long id, CreateMedicineRequest request);

  void deleteById(Long id);

  List<MedicineResponse> findByName(String name);

  List<MedicineResponse> findByStockLessThan(Integer stock);

  List<MedicineResponse> findByExpirationDateBefore();
}
