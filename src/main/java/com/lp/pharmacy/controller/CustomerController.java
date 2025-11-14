package com.lp.pharmacy.controller;

import com.lp.pharmacy.model.dto.request.CreateCustomerRequest;
import com.lp.pharmacy.model.entity.Customer;
import com.lp.pharmacy.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/customers")
public class CustomerController {

  private static final String VIEW_FOLDER = "redirect:/customers";
  private final CustomerService customerService;

  // Lista todos los clientes
  @GetMapping
  public String getCustomers(Model model) {
    model.addAttribute("customers", customerService.findAll());
    return "customer/list";
  }

  // Formulario para crear un nuevo cliente
  @GetMapping("/new")
  public String newCustomerForm(Model model) {
    model.addAttribute("customer", new Customer());
    return "customer/new";
  }

  // Crea un nuevo cliente
  @PostMapping("/save")
  public String saveCustomer(@Valid @ModelAttribute CreateCustomerRequest request) {
    customerService.save(request);
    return VIEW_FOLDER;
  }

  // Formulario para editar un cliente
  @GetMapping("/edit/{id}")
  public String editCustomerForm(@PathVariable Long id, Model model) {
    model.addAttribute("customer", customerService.findById(id));
    return "customer/new";
  }

  // Actualiza un cliente
  @PostMapping("/update/{id}")
  public String updateCustomer(
      @PathVariable Long id, @Valid @ModelAttribute CreateCustomerRequest request) {

    customerService.update(id, request);
    return VIEW_FOLDER;
  }

  // Elimina un cliente
  @PostMapping("/delete/{id}")
  public String deleteCustomer(@PathVariable Long id) {
    customerService.deleteById(id);
    return VIEW_FOLDER;
  }
}
