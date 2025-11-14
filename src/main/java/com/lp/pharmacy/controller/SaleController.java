package com.lp.pharmacy.controller;

import com.lp.pharmacy.model.dto.request.CreateSaleRequest;
import com.lp.pharmacy.model.dto.response.SaleResponse;
import com.lp.pharmacy.model.entity.Sale;
import com.lp.pharmacy.service.CustomerService;
import com.lp.pharmacy.service.MedicineService;
import com.lp.pharmacy.service.PharmacistService;
import com.lp.pharmacy.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/sales")
public class SaleController {

  private final SaleService saleService;
  private final CustomerService customerService;
  private final MedicineService medicineService;
  private final PharmacistService pharmacistService;

  // Lista todas las ventas
  @GetMapping
  public String getSales(Model model) {
    model.addAttribute("sales", saleService.findAll());
    return "sale/list";
  }

  // Formulario para crear una nueva venta
  @GetMapping("/new")
  public String newSaleForm(Model model) {
    model.addAttribute("sale", new Sale());

    model.addAttribute("customers", customerService.findAll());
    model.addAttribute("medicines", medicineService.findAll());
    model.addAttribute("pharmacists", pharmacistService.findAll());
    return "sale/new";
  }

  // Crea una nueva venta
  @PostMapping("/save")
  public String createSale(@ModelAttribute("sale") CreateSaleRequest request) {
    try {
      saleService.createSale(request);
      return "redirect:/sales";
    } catch (IllegalArgumentException e) {
      return "redirect:/sales/new?error=" + e.getMessage();
    }
  }

  // Vista de detalles de una venta
  @GetMapping("/{id}")
  public String viewSaleDetails(@PathVariable Long id, Model model) {
    model.addAttribute("saleDetails", saleService.findAllSaleDetailsBySaleId(id));
    return "sale/details";
  }

}
