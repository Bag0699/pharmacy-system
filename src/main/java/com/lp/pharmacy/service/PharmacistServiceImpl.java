package com.lp.pharmacy.service;

import com.lp.pharmacy.exception.PharmacistNotFoundException;
import com.lp.pharmacy.mapper.PharmacistMapper;
import com.lp.pharmacy.model.dto.request.CreatePharmacistRequest;
import com.lp.pharmacy.model.dto.response.PharmacistResponse;
import com.lp.pharmacy.model.entity.Pharmacist;
import com.lp.pharmacy.repository.PharmacistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacistServiceImpl implements PharmacistService {

  private final PharmacistRepository pharmacistRepository;
  private final PharmacistMapper pharmacistMapper;

  @Override
  public List<PharmacistResponse> findAll() {
    return pharmacistRepository.findAll().stream()
        .map(pharmacistMapper::toPharmacistResponse)
        .toList();
  }

  @Override
  public PharmacistResponse findById(Long id) {
    return pharmacistRepository
        .findById(id)
        .map(pharmacistMapper::toPharmacistResponse)
        .orElseThrow(PharmacistNotFoundException::new);
  }

  @Override
  public PharmacistResponse save(CreatePharmacistRequest request) {
    Pharmacist pharmacist = pharmacistMapper.toPharmacist(request);
    return pharmacistMapper.toPharmacistResponse(pharmacistRepository.save(pharmacist));
  }

  @Override
  public PharmacistResponse update(Long id, CreatePharmacistRequest request) {
    return pharmacistRepository
        .findById(id)
        .map(
            pharmacist -> {
              pharmacist.setFirstName(request.getFirstName());
              pharmacist.setLastName(request.getLastName());
              pharmacist.setUsername(request.getUsername());
              return pharmacistRepository.save(pharmacist);
            })
        .map(pharmacistMapper::toPharmacistResponse)
        .orElseThrow(PharmacistNotFoundException::new);
  }

  @Override
  public void deleteById(Long id) {
    if (!pharmacistRepository.existsById(id)) {
      throw new PharmacistNotFoundException();
    }
    pharmacistRepository.deleteById(id);
  }
}
