package com.lp.pharmacy.mapper;

import com.lp.pharmacy.model.dto.request.CreateMedicineRequest;
import com.lp.pharmacy.model.dto.response.MedicineResponse;
import com.lp.pharmacy.model.entity.Medicine;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MedicineMapper {

  MedicineResponse toMedicineResponse(Medicine medicine);

  Medicine toMedicine(CreateMedicineRequest request);
}
