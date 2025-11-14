package com.lp.pharmacy.mapper;

import com.lp.pharmacy.model.dto.request.CreateSaleRequest;
import com.lp.pharmacy.model.dto.response.SaleResponse;
import com.lp.pharmacy.model.entity.Sale;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {CustomerMapper.class, MedicineMapper.class, PharmacistMapper.class})
public interface SaleMapper {

  SaleResponse toSaleResponse(Sale sale);

  Sale toSale(CreateSaleRequest request);
}
