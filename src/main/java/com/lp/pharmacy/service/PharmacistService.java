package com.lp.pharmacy.service;

import com.lp.pharmacy.model.dto.request.CreatePharmacistRequest;
import com.lp.pharmacy.model.dto.response.PharmacistResponse;

import java.util.List;

public interface PharmacistService {

  List<PharmacistResponse> findAll();

  PharmacistResponse findById(Long id);

  PharmacistResponse save(CreatePharmacistRequest request);

  PharmacistResponse update(Long id, CreatePharmacistRequest request);

  void deleteById(Long id);
}
