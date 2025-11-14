package com.lp.pharmacy.service;

import com.lp.pharmacy.exception.CustomerNotFoundException;
import com.lp.pharmacy.exception.MedicineNotFoundException;
import com.lp.pharmacy.exception.PharmacistNotFoundException;
import com.lp.pharmacy.exception.SaleNotFoundException;
import com.lp.pharmacy.mapper.SaleDetailMapper;
import com.lp.pharmacy.mapper.SaleMapper;
import com.lp.pharmacy.model.dto.request.CreateSaleRequest;
import com.lp.pharmacy.model.dto.response.SaleDetailResponse;
import com.lp.pharmacy.model.dto.response.SaleResponse;
import com.lp.pharmacy.model.entity.*;
import com.lp.pharmacy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

  private final SaleRepository saleRepository;
  private final CustomerRepository customerRepository;
  private final PharmacistRepository pharmacistRepository;
  private final MedicineRepository medicineRepository;
  private final SaleDetailRepository saleDetailRepository;

  private final SaleMapper saleMapper;
  private final SaleDetailMapper saleDetailMapper;

  @Override
  @Transactional
  public SaleResponse createSale(CreateSaleRequest request) {
    Pharmacist pharmacist =
        pharmacistRepository
            .findById(request.getPharmacistId())
            .orElseThrow(PharmacistNotFoundException::new);

    Customer customer =
        customerRepository
            .findById(request.getCustomerId())
            .orElseThrow(CustomerNotFoundException::new);

    if (request.getSaleDetails() == null || request.getSaleDetails().isEmpty()) {
      throw new IllegalArgumentException("Sale details cannot be empty");
    }

    Sale sale = new Sale();
    sale.setSaleDate(LocalDateTime.now());
    sale.setCustomer(customer);
    sale.setPharmacist(pharmacist);

    List<SaleDetail> createSaleDetails =
        request.getSaleDetails().stream()
            .map(
                saleDetailRequest -> {
                  Medicine medicine =
                      medicineRepository
                          .findById(saleDetailRequest.getMedicineId())
                          .orElseThrow(MedicineNotFoundException::new);

                  decreaseMedicineStock(medicine, saleDetailRequest.getQuantity());
                  BigDecimal unitPrice = medicine.getPrice();
                  BigDecimal subTotal =
                      unitPrice.multiply(BigDecimal.valueOf(saleDetailRequest.getQuantity()));

                  SaleDetail saleDetail = new SaleDetail();
                  saleDetail.setQuantity(saleDetailRequest.getQuantity());
                  saleDetail.setUnitPrice(unitPrice);
                  saleDetail.setSubTotal(subTotal);
                  saleDetail.setSale(sale);
                  saleDetail.setMedicine(medicine);
                  return saleDetail;
                })
            .toList();

    sale.setSaleDetails(createSaleDetails);

    BigDecimal totalAmount =
        createSaleDetails.stream()
            .map(SaleDetail::getSubTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    sale.setTotalAmount(totalAmount);

    Sale savedSale = saleRepository.save(sale);
    return saleMapper.toSaleResponse(savedSale);
  }

  @Override
  public List<SaleResponse> findAll() {
    return saleRepository.findAll().stream().map(saleMapper::toSaleResponse).toList();
  }

  @Override
  public SaleResponse findById(Long id) {
    return saleRepository
        .findById(id)
        .map(saleMapper::toSaleResponse)
        .orElseThrow(SaleNotFoundException::new);
  }

  @Override
  public List<SaleDetailResponse> findAllSaleDetailsBySaleId(Long saleId) {
    if (!saleRepository.existsById(saleId)) {
      throw new SaleNotFoundException();
    }
    return saleDetailRepository.findBySale_Id(saleId).stream()
        .map(saleDetailMapper::toSaleDetailResponse)
        .toList();
  }

  private void decreaseMedicineStock(Medicine medicine, Integer quantity) {

    if (medicine.getStock() < quantity) {
      throw new IllegalArgumentException(
          "Insufficient stock for medication ID:" + medicine.getId());
    }
    medicine.setStock(medicine.getStock() - quantity);
    medicineRepository.save(medicine);
  }
}
