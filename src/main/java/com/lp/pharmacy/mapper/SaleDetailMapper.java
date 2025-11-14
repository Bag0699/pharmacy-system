package com.lp.pharmacy.mapper;

import com.lp.pharmacy.model.dto.request.CreateSaleRequest;
import com.lp.pharmacy.model.dto.response.SaleDetailResponse;
import com.lp.pharmacy.model.entity.SaleDetail;
import org.mapstruct.Mapper;

@Mapper(
    componentModel = "spring",
    uses = {MedicineMapper.class})
public interface SaleDetailMapper {

  SaleDetailResponse toSaleDetailResponse(SaleDetail saleDetail);

  SaleDetail toSaleDetail(CreateSaleRequest request);
}
