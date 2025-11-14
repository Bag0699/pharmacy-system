package com.lp.pharmacy.mapper;

import com.lp.pharmacy.model.dto.request.CreatePharmacistRequest;
import com.lp.pharmacy.model.dto.response.PharmacistResponse;
import com.lp.pharmacy.model.entity.Pharmacist;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PharmacistMapper {

  PharmacistResponse toPharmacistResponse(Pharmacist pharmacist);

  Pharmacist toPharmacist(CreatePharmacistRequest pharmacistRequest);
}
