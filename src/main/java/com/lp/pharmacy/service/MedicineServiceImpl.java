package com.lp.pharmacy.service;

import com.lp.pharmacy.exception.MedicineNotFoundException;
import com.lp.pharmacy.mapper.MedicineMapper;
import com.lp.pharmacy.model.dto.request.CreateMedicineRequest;
import com.lp.pharmacy.model.dto.response.MedicineResponse;
import com.lp.pharmacy.model.entity.Medicine;
import com.lp.pharmacy.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

  private final MedicineRepository medicineRepository;
  private final MedicineMapper medicineMapper;

  @Override
  public List<MedicineResponse> findAll() {
    return medicineRepository.findAll().stream().map(medicineMapper::toMedicineResponse).toList();
  }

  @Override
  public MedicineResponse findById(Long id) {
    return medicineRepository
        .findById(id)
        .map(medicineMapper::toMedicineResponse)
        .orElseThrow(MedicineNotFoundException::new);
  }

  @Override
  public MedicineResponse save(CreateMedicineRequest request) {
    Medicine medicine = medicineMapper.toMedicine(request);
    return medicineMapper.toMedicineResponse(medicineRepository.save(medicine));
  }

  @Override
  public MedicineResponse update(Long id, CreateMedicineRequest request) {
    return medicineRepository
        .findById(id)
        .map(
            medicine -> {
              medicine.setName(request.getName());
              medicine.setPrice(request.getPrice());
              medicine.setStock(request.getStock());
              medicine.setExpirationDate(request.getExpirationDate());
              return medicineRepository.save(medicine);
            })
        .map(medicineMapper::toMedicineResponse)
        .orElseThrow(MedicineNotFoundException::new);
  }

  @Override
  public void deleteById(Long id) {
    if (!medicineRepository.existsById(id)) {
      throw new MedicineNotFoundException();
    }
    medicineRepository.deleteById(id);
  }

  @Override
  public List<MedicineResponse> findByName(String name) {
    return medicineRepository.findByNameContainingIgnoreCase(name).stream()
        .map(medicineMapper::toMedicineResponse)
        .toList();
  }

  @Override
  public List<MedicineResponse> findByStockLessThan(Integer stock) {
    return medicineRepository.findByStockLessThan(stock).stream()
        .map(medicineMapper::toMedicineResponse)
        .toList();
  }

  @Override
  public List<MedicineResponse> findByExpirationDateBefore() {
    return medicineRepository.findByExpirationDateBefore(LocalDate.now()).stream()
        .map(medicineMapper::toMedicineResponse)
        .toList();
  }
}
