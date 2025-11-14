package com.lp.pharmacy.controller;

import com.lp.pharmacy.exception.CustomerNotFoundException;
import com.lp.pharmacy.exception.MedicineNotFoundException;
import com.lp.pharmacy.exception.PharmacistNotFoundException;
import com.lp.pharmacy.exception.SaleNotFoundException;
import com.lp.pharmacy.model.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static com.lp.pharmacy.util.ErrorCatalog.*;

@RestControllerAdvice
public class GlobalControllerAdvice {

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(CustomerNotFoundException.class)
  public ErrorResponse handleCustomerNotFoundException() {
    return ErrorResponse.builder()
        .code(CUSTOMER_NOT_FOUND.getCode())
        .status(HttpStatus.NOT_FOUND)
        .message(CUSTOMER_NOT_FOUND.getMessage())
        .timeStamp(LocalDateTime.now())
        .build();
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(MedicineNotFoundException.class)
  public ErrorResponse handleMedicineNotFoundException() {
    return ErrorResponse.builder()
        .code(MEDICINE_NOT_FOUND.getCode())
        .status(HttpStatus.NOT_FOUND)
        .message(MEDICINE_NOT_FOUND.getMessage())
        .timeStamp(LocalDateTime.now())
        .build();
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(PharmacistNotFoundException.class)
  public ErrorResponse handlePharmacistNotFoundException() {
    return ErrorResponse.builder()
        .code(PHARMACIST_NOT_FOUND.getCode())
        .status(HttpStatus.NOT_FOUND)
        .message(PHARMACIST_NOT_FOUND.getMessage())
        .timeStamp(LocalDateTime.now())
        .build();
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(SaleNotFoundException.class)
  public ErrorResponse handleSaleNotFoundException() {
    return ErrorResponse.builder()
        .code(SALE_NOT_FOUND.getCode())
        .status(HttpStatus.NOT_FOUND)
        .message(SALE_NOT_FOUND.getMessage())
        .timeStamp(LocalDateTime.now())
        .build();
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ErrorResponse handleMethodArgumentNotValidException(
      MethodArgumentNotValidException exception) {
    List<String> detailMessages =
        exception.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .toList();

    return ErrorResponse.builder()
        .code("VALIDATION_ERROR")
        .status(HttpStatus.BAD_REQUEST)
        .message("Uno o más campos contienen errores de validación.")
        .detailMessage(detailMessages)
        .timeStamp(LocalDateTime.now())
        .build();
  }

  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  @ExceptionHandler(Exception.class)
  public ErrorResponse handleInternalServerError(Exception exception) {
    return ErrorResponse.builder()
        .code(GENERIC_ERROR.getCode())
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .message(GENERIC_ERROR.getMessage())
        .detailMessage(Collections.singletonList(exception.getMessage()))
        .timeStamp(LocalDateTime.now())
        .build();
  }
}
